import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { loadBackendConfigFromEnv, BackendConfig } from "./config.js";
import { logger } from "./logger.js";
import registerRoutes from "./routes/index.js";
import userIdentityPlugin from "./middleware/auth.js";
import { AppError } from "./errors.js";

// Type augmentation must be top-level
declare module "fastify" {
    interface FastifyInstance {
        cantaraConfig: BackendConfig;
    }
}

async function main() {
    const config = loadBackendConfigFromEnv();

    const app = Fastify({
        maxParamLength: 500,
        logger: {
            level: config.env === 'development' ? 'debug' : 'info',
            transport: config.env === 'development' ? {
                target: 'pino-pretty',
                options: {
                    colorize: true
                }
            } : undefined
        }
    });

    // Set Zod validator and serializer compilers
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    await app.register(cors, {
        origin: config.corsOrigin,
        credentials: true,
    });

    await app.register(swagger, {
        openapi: { info: { title: "Cantara Backend API", version: "0.1.0" } },
    });
    await app.register(swaggerUi, { routePrefix: "/docs" });

    // Decorate app with config so routes can access it
    app.decorate("cantaraConfig", config);

    // Auth & identity
    await app.register(userIdentityPlugin);

    // Business routes
    await registerRoutes(app);

    // Global error handler (for AppError)
    app.setErrorHandler((err, request, reply) => {
        if (err instanceof AppError) {
            logger.warn({ err, code: err.code }, "AppError");
            return reply.status(err.statusCode).send({ code: err.code, message: err.message });
        }
        logger.error({ err }, "Unhandled error");
        return reply.status(500).send({ code: "INTERNAL_ERROR", message: "Unexpected server error" });
    });

    const port = config.port;
    await app.listen({ port, host: "0.0.0.0" });
    logger.info(`Cantara backend listening on port ${port}`);
}

main().catch((err) => {
    logger.fatal({ err }, "Failed to start backend");
    process.exit(1);
});
