import { FastifyInstance } from "fastify";
import poolsRoutes from "./pools.js";
import portfolioRoutes from "./portfolio.js";
import healthRoutes from "./health.js";
import historyRoutes from "./history.js";
import adminRoutes from "./admin.js";
import liquidationRoutes from "./liquidation.js";

export default async function registerRoutes(fastify: FastifyInstance) {
    fastify.register(healthRoutes, { prefix: "/health" });
    fastify.register(poolsRoutes, { prefix: "/pools" });
    fastify.register(portfolioRoutes, { prefix: "/portfolio" });
    fastify.register(historyRoutes, { prefix: "/history" });
    fastify.register(adminRoutes, { prefix: "/admin" });
    fastify.register(liquidationRoutes, { prefix: "/liquidation" });
}
