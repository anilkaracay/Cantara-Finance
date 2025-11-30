import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PoolService } from "../services/poolService.js";

const PoolSchema = z.object({
    contractId: z.string(),
    admin: z.string(),
    poolId: z.string(),
    railType: z.literal("Permissionless"),
    assetSymbol: z.string(),
    assetClass: z.enum(["ClassA", "ClassAA", "ClassB", "ClassR"]),
    totalDeposits: z.string(),
    totalBorrows: z.string(),
    baseRate: z.string(),
    slope1: z.string(),
    slope2: z.string(),
    kinkUtilization: z.string(),
    riskParams: z.object({
        rpMaxLtv: z.string(),
        rpLiquidationThreshold: z.string(),
        rpLiquidationBonus: z.string(),
        rpMinHealthFactor: z.string(),
        rpRailType: z.literal("Permissionless"),
    }),
});

const PoolsResponseSchema = z.array(PoolSchema);

export default async function poolsRoutes(fastify: FastifyInstance) {
    fastify.get("/permissionless", {
        schema: {
            description: "List all permissionless lending pools",
            response: {
                200: PoolsResponseSchema,
            },
        },
    }, async (request) => {
        const pools = await PoolService.listPermissionlessPools(fastify.cantaraConfig);
        return pools;
    });
}
