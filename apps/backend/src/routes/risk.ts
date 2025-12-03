import { FastifyInstance } from "fastify";
import { z } from "zod";
import { RiskAggregator } from "../risk/aggregator.js";

export default async function riskRoutes(fastify: FastifyInstance) {
    fastify.get("/summary", {
        schema: {
            description: "Get user risk summary",
            tags: ["Risk"],
            headers: z.object({
                "x-cantara-user": z.string().optional(),
            }),
            response: {
                200: z.object({
                    totalCollateralUsd: z.number(),
                    totalBorrowUsd: z.number(),
                    netWorthUsd: z.number(),
                    netApyPercent: z.number(),
                    borrowCapacityUsd: z.number(),
                    healthFactor: z.number().nullable(),
                    weightedAvgLtv: z.number(),
                    weightedAvgLiqThreshold: z.number(),
                    collaterals: z.array(z.object({
                        symbol: z.string(),
                        amount: z.number(),
                        usdValue: z.number(),
                    })),
                    borrows: z.array(z.object({
                        symbol: z.string(),
                        amount: z.number(),
                        usdValue: z.number(),
                    })),
                }),
                400: z.object({ error: z.string() }),
                500: z.object({ error: z.string() }),
            },
        },
    }, async (request, reply) => {
        const userParty = request.headers["x-cantara-user"] as string;

        if (!userParty) {
            return reply.status(400).send({ error: "Missing x-cantara-user header" });
        }

        try {
            const config = {
                baseUrl: fastify.cantaraConfig.damlBaseUrl,
                ledgerId: fastify.cantaraConfig.damlLedgerId,
                apiToken: fastify.cantaraConfig.damlAdminToken || fastify.cantaraConfig.damlUserToken
            };
            const aggregator = new RiskAggregator(config);
            const summary = await aggregator.getRiskSummary(userParty);
            return summary;
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error: "Failed to compute risk summary" });
        }
    });

    fastify.get("/liquidatable", {
        schema: {
            description: "Get liquidatable positions",
            tags: ["Risk"],
            querystring: z.object({
                maxHf: z.string().optional().default("1.0"),
                limit: z.string().optional().default("50")
            }),
            response: {
                200: z.object({
                    positions: z.array(z.object({
                        contractId: z.string(),
                        userParty: z.string(),
                        assetSymbol: z.string(),
                        collateralAmount: z.string(),
                        debtAmount: z.string(),
                        healthFactor: z.number(),
                        hfThreshold: z.number(),
                        price: z.string()
                    }))
                }),
                500: z.object({ error: z.string() })
            }
        }
    }, async (request, reply) => {
        try {
            const { maxHf, limit } = request.query as { maxHf: string, limit: string };

            const config = {
                baseUrl: fastify.cantaraConfig.damlBaseUrl,
                ledgerId: fastify.cantaraConfig.damlLedgerId,
                apiToken: fastify.cantaraConfig.damlAdminToken || fastify.cantaraConfig.damlUserToken
            };
            const aggregator = new RiskAggregator(config);
            const positions = await aggregator.findLiquidatablePositions(parseFloat(maxHf), parseInt(limit));

            return { positions };
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ error: "Failed to fetch liquidatable positions" });
        }
    });
}
