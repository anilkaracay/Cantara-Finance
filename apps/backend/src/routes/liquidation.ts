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
        // 1. Check for Liquidator API Key
        const apiKey = request.headers["x-cantara-liquidator-key"];
        if (apiKey !== fastify.cantaraConfig.liquidatorApiKey) {
            // If key is missing or invalid, check for user auth (optional, but for now we enforce key for this endpoint)
            // Or maybe we allow users to liquidate if they are authorized?
            // The requirement says: "Only the Liquidator Bot should call this endpoint in production; normal users cannot liquidate other users directly."
            // So we strictly enforce the key.
            throw unauthorized("Invalid or missing liquidator key");
        }

        // 2. We still need a DAML token to execute the command.
        // The bot should probably use the Liquidator Party token.
        // But `request.cantaraUserParty` comes from `userIdentityPlugin` which parses the JWT.
        // If the bot sends a JWT, we have a user.
        // If the bot ONLY sends the API Key, we need to use a configured Liquidator Token.

        // Let's assume the bot sends the API Key AND we use the configured Liquidator Token for the DAML command.
        // OR the bot sends a JWT for the Liquidator Party.

        // The current implementation uses `request.cantaraUserParty`.
        // If we want to support API Key only, we need to bypass `userIdentityPlugin` or handle it there.
        // However, `userIdentityPlugin` is global or registered on routes.
        // Let's check `apps/backend/src/server.ts`.

        // `userIdentityPlugin` is registered globally. It might throw if no token is present?
        // If so, the bot needs to send a token.
        // But the requirement says "Bot uses a shared secret header... to authenticate".
        // It doesn't explicitly say it sends a JWT.
        // If `userIdentityPlugin` is strict, we have a problem.

        // Let's assume for now the bot sends the API Key, and we use the `damlLiquidatorToken` from config as the acting party.
        // But `request.cantaraUserParty` will be undefined if no JWT.

        // We need to see if `userIdentityPlugin` allows unauthenticated requests.
        // If it does, `request.cantaraUserParty` is undefined.

        if (!request.cantaraUserParty) {
            throw unauthorized("Missing x-cantara-user header");
        }
        const userParty = request.cantaraUserParty;

        const { targetUser, collateralAsset, debtAsset, repayAmount } = request.body as {
            targetUser: string;
            collateralAsset: string;
            debtAsset: string;
            repayAmount: number;
        };

        // Prevent self-liquidation
        if (targetUser === userParty) {
            throw badRequest("Cannot liquidate your own position");
        }

        try {
            const result = await LiquidationService.executeLiquidation(
                fastify.cantaraConfig,
                userParty,
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

