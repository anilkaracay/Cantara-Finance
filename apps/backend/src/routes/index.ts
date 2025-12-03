import { FastifyInstance } from "fastify";
import poolsRoutes from "./pools.js";
import portfolioRoutes from "./portfolio.js";
import healthRoutes from "./health.js";
import historyRoutes from "./history.js";
import adminRoutes from "./admin.js";
import liquidationRoutes from "./liquidation.js";
import riskRoutes from "./risk.js";
import permissionedRoutes from "./permissioned.js";

export default async function registerRoutes(fastify: FastifyInstance) {
    fastify.register(healthRoutes, { prefix: "/health" });
    fastify.register(import("./pools.js"), { prefix: "/pools" });
    fastify.register(import("./permissioned.js"), { prefix: "/permissioned" });
    fastify.register(import("./history.js"), { prefix: "/history" });
    fastify.register(import("./portfolio.js"), { prefix: "/portfolio" });
    fastify.register(adminRoutes, { prefix: "/admin" });
    fastify.register(liquidationRoutes, { prefix: "/liquidation" });

    fastify.register(riskRoutes, { prefix: "/risk" });
}
