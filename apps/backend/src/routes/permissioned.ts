import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PoolService } from "../services/poolService.js";
import { listInstitutions } from "../services/permissionedDaml.js";

const PermissionedPoolSchema = z.object({
    contractId: z.string(),
    admin: z.string(),
    poolId: z.string(),
    railType: z.literal("Permissioned"),
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
        rpRailType: z.literal("Permissioned"),
    }),
    ownerInstitution: z.string().optional(),
    rwaReference: z.string().optional().nullable(),
    maturityDate: z.string().optional().nullable(),
    visibility: z.enum(["Public", "Private"]).optional().nullable(),
    category: z.string().optional().nullable(),
});

const PermissionedPoolsResponseSchema = z.object({
    crypto: z.array(PermissionedPoolSchema),
    securities: z.array(PermissionedPoolSchema),
});

export default async function permissionedRoutes(fastify: FastifyInstance) {
    fastify.get("/institutions", {
        schema: {
            description: "List all institutions (Institution role required)",
            response: {
                200: z.array(z.object({
                    institution: z.string(),
                    name: z.string().optional().nullable(),
                    jurisdiction: z.string().optional().nullable(),
                })),
            },
        },
    }, async (request, reply) => {
        if (request.cantaraRole !== "institution") {
            return reply.status(403).send({ code: "FORBIDDEN", message: "Only institutions can access this resource" });
        }

        const institutions = await listInstitutions(fastify.cantaraConfig);
        return institutions;
    });
    fastify.get("/pools", {
        schema: {
            description: "List all permissioned lending pools (Institution only)",
            response: {
                200: PermissionedPoolsResponseSchema,
            },
        },
    }, async (request, reply) => {
        // RBAC Check
        if (request.cantaraRole !== "institution") {
            return reply.status(403).send({ code: "FORBIDDEN", message: "Only institutions can access permissioned pools" });
        }

        const pools = await PoolService.listPermissionedPools(fastify.cantaraConfig, request.cantaraInstitutionParty);
        return pools;
    });
}
