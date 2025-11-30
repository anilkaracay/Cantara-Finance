import { FastifyInstance } from "fastify";
import { z } from "zod";
import { LiquidationService } from "../services/liquidationService.js";
import { PositionService } from "../services/positionService.js";
import { OracleService } from "../services/oracleService.js";
import { PoolService } from "../services/poolService.js";
import { unauthorized, badRequest } from "../errors.js";

export default async function liquidationRoutes(fastify: FastifyInstance) {
    // GET /liquidation/health - Get health factor for current user
    fastify.get("/health", async (request) => {
        if (!request.cantaraUserParty) {
            throw unauthorized("Missing x-cantara-user header");
        }

        // Get user's portfolio
        const portfolio = await PositionService.getClientPortfolio(
            fastify.cantaraConfig,
            request.cantaraUserParty
        );

        if (!portfolio) {
            return { healthFactor: 1000000, isLiquidatable: false, portfolio: null };
        }

        // Get oracle prices and pools
        const { OracleService } = await import("../services/oracleService.js");
        const { PoolService } = await import("../services/poolService.js"); // Assuming PoolService exists or we use SDK directly. 
        // Actually, let's use the SDK directly or PoolService if it exposes what we need.
        // PoolService.getPermissionlessPools returns the pools.

        const [oracles, pools] = await Promise.all([
            OracleService.getClientOracles(fastify.cantaraConfig),
            PoolService.listPermissionlessPools(fastify.cantaraConfig)
        ]);

        const priceMap: Record<string, number> = {};
        oracles.forEach(o => {
            priceMap[o.symbol] = parseFloat(o.price);
        });

        const poolsMap: Record<string, any> = {};
        pools.forEach(p => {
            poolsMap[p.assetSymbol] = p;
        });

        // Calculate health factor
        const healthFactor = LiquidationService.calculateHealthFactor(
            portfolio.deposits,
            portfolio.borrows,
            priceMap,
            poolsMap
        );

        return {
            healthFactor,
            isLiquidatable: healthFactor < 1.0,
            portfolio
        };
    });

    // GET /liquidation/positions - Get all liquidatable positions (public)
    fastify.get("/positions", async (request) => {
        const positions = await LiquidationService.getAllLiquidatablePositions(fastify.cantaraConfig);
        return { positions };
    });

    // POST /liquidation/execute - Execute a liquidation
    fastify.post("/execute", {
        schema: {
            body: z.object({
                targetUser: z.string(),
                collateralAsset: z.string(),
                debtAsset: z.string(),
                repayAmount: z.number().positive(),
            }),
        }
    }, async (request) => {
        if (!request.cantaraUserParty) {
            throw unauthorized("Missing x-cantara-user header");
        }

        const { targetUser, collateralAsset, debtAsset, repayAmount } = request.body as {
            targetUser: string;
            collateralAsset: string;
            debtAsset: string;
            repayAmount: number;
        };

        // Prevent self-liquidation
        if (targetUser === request.cantaraUserParty) {
            throw badRequest("Cannot liquidate your own position");
        }

        try {
            const result = await LiquidationService.executeLiquidation(
                fastify.cantaraConfig,
                request.cantaraUserParty,
                {
                    targetUser,
                    collateralAsset,
                    debtAsset,
                    repayAmount
                }
            );

            return { success: true, message: result };
        } catch (e: any) {
            // Pass error message to frontend
            throw badRequest(e.message || "Liquidation failed");
        }
    });
}

