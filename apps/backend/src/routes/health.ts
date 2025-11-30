import { FastifyInstance } from "fastify";
import { loadBackendConfigFromEnv } from "../config.js";

export default async function healthRoutes(fastify: FastifyInstance) {
    fastify.get("/", async () => {
        const config = loadBackendConfigFromEnv();
        return {
            status: "ok",
            env: config.env,
            timestamp: new Date().toISOString(),
        };
    });
}
