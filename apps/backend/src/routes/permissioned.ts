import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PoolService } from "../services/poolService.js";
import { listInstitutions, listInstitutionalCapital, performInstitutionCapitalDeposit, performInstitutionCapitalWithdraw } from "../services/permissionedDaml.js";

const PoolsQuerySchema = z.object({
    privacy: z.enum(["public", "private"]).optional(),
    institutionParty: z.string().optional(),
});

const CapitalQuerySchema = z.object({
    privacy: z.enum(["public", "private"]).optional(),
});

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

const InstitutionalCapitalSchema = z.object({
    contractId: z.string(),
    admin: z.string(),
    institution: z.string(),
    poolId: z.string(),
    railType: z.literal("Permissioned"),
    visibility: z.enum(["Public", "Private"]),
    assetSymbol: z.string(),
    suppliedAmount: z.string(),
    createdAt: z.string(),
});

const CapitalMutationBodySchema = z.object({
    amount: z.string().min(1, "Amount is required"),
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
                403: z.object({ code: z.string(), message: z.string() }),
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
            querystring: PoolsQuerySchema.optional(),
            response: {
                200: PermissionedPoolsResponseSchema,
                403: z.object({ code: z.string(), message: z.string() }),
            },
        },
    }, async (request, reply) => {
        // RBAC Check
        if (request.cantaraRole !== "institution") {
            return reply.status(403).send({ code: "FORBIDDEN", message: "Only institutions can access permissioned pools" });
        }

        const query = (request.query ?? {}) as z.infer<typeof PoolsQuerySchema>;
        const queryPrivacy = query.privacy ? (query.privacy === "private" ? "Private" : "Public") : undefined;
        const resolvedPrivacy = queryPrivacy ?? (request.cantaraPrivacyMode ?? "Public");
        const ownerFilter = query.institutionParty
            ?? (resolvedPrivacy === "Private" ? request.cantaraInstitutionParty : undefined);

        const pools = await PoolService.listPermissionedPools(
            fastify.cantaraConfig,
            ownerFilter,
            resolvedPrivacy
        );
        return pools;
    });

    fastify.get("/capital", {
        schema: {
            description: "List institutional capital allocations (Institution role required)",
            querystring: CapitalQuerySchema.optional(),
            response: {
                200: z.array(InstitutionalCapitalSchema),
                403: z.object({ code: z.string(), message: z.string() }),
            },
        },
    }, async (request, reply) => {
        if (request.cantaraRole !== "institution" || !request.cantaraInstitutionParty) {
            return reply.status(403).send({ code: "FORBIDDEN", message: "Only institutions can access capital allocations" });
        }

        const query = (request.query ?? {}) as z.infer<typeof CapitalQuerySchema>;
        const queryPrivacy = query.privacy ? (query.privacy === "private" ? "Private" : "Public") : undefined;
        const privacyMode = queryPrivacy ?? (request.cantaraPrivacyMode ?? "Public");
        const capital = await listInstitutionalCapital(fastify.cantaraConfig, request.cantaraInstitutionParty);
        const filtered = capital.filter(cap => {
            if (privacyMode === "Private") {
                return cap.visibility === "Private";
            }
            return cap.visibility !== "Private";
        });
        return filtered;
    });

    fastify.post("/capital/:contractId/deposit", {
        schema: {
            description: "Increase institutional capital in a permissioned pool",
            body: CapitalMutationBodySchema,
            params: z.object({ contractId: z.string() }),
            response: {
                200: z.object({ status: z.literal("ok") }),
                400: z.object({ code: z.string(), message: z.string() }),
                403: z.object({ code: z.string(), message: z.string() }),
                404: z.object({ code: z.string(), message: z.string() }),
            },
        },
    }, async (request, reply) => {
        if (request.cantaraRole !== "institution" || !request.cantaraInstitutionParty) {
            return reply.status(403).send({ code: "FORBIDDEN", message: "Only institutions can manage capital" });
        }

        const { contractId } = request.params as { contractId: string };
        const parsedBody = CapitalMutationBodySchema.safeParse(request.body ?? {});
        if (!parsedBody.success) {
            return reply.status(400).send({ code: "BAD_REQUEST", message: parsedBody.error.issues[0]?.message ?? "Invalid amount" });
        }

        const privacyMode = request.cantaraPrivacyMode ?? "Public";
        const capital = await listInstitutionalCapital(fastify.cantaraConfig, request.cantaraInstitutionParty);
        const target = capital.find(cap => cap.contractId === contractId);
        if (!target) {
            return reply.status(404).send({ code: "NOT_FOUND", message: "Capital position not found" });
        }
        if (privacyMode === "Private" && target.visibility !== "Private") {
            return reply.status(403).send({ code: "FORBIDDEN", message: "Cannot mutate public capital while in Private mode" });
        }
        if (privacyMode !== "Private" && target.visibility === "Private") {
            return reply.status(403).send({ code: "FORBIDDEN", message: "Switch to Private mode to manage restricted capital" });
        }

        await performInstitutionCapitalDeposit(
            fastify.cantaraConfig,
            contractId,
            parsedBody.data.amount,
            new Date().toISOString()
        );
        return { status: "ok" };
    });

    fastify.post("/capital/:contractId/withdraw", {
        schema: {
            description: "Withdraw institutional capital from a permissioned pool",
            body: CapitalMutationBodySchema,
            params: z.object({ contractId: z.string() }),
            response: {
                200: z.object({ status: z.literal("ok") }),
                400: z.object({ code: z.string(), message: z.string() }),
                403: z.object({ code: z.string(), message: z.string() }),
                404: z.object({ code: z.string(), message: z.string() }),
            },
        },
    }, async (request, reply) => {
        if (request.cantaraRole !== "institution" || !request.cantaraInstitutionParty) {
            return reply.status(403).send({ code: "FORBIDDEN", message: "Only institutions can manage capital" });
        }

        const { contractId } = request.params as { contractId: string };
        const parsedBody = CapitalMutationBodySchema.safeParse(request.body ?? {});
        if (!parsedBody.success) {
            return reply.status(400).send({ code: "BAD_REQUEST", message: parsedBody.error.issues[0]?.message ?? "Invalid amount" });
        }

        const privacyMode = request.cantaraPrivacyMode ?? "Public";
        const capital = await listInstitutionalCapital(fastify.cantaraConfig, request.cantaraInstitutionParty);
        const target = capital.find(cap => cap.contractId === contractId);
        if (!target) {
            return reply.status(404).send({ code: "NOT_FOUND", message: "Capital position not found" });
        }
        if (privacyMode === "Private" && target.visibility !== "Private") {
            return reply.status(403).send({ code: "FORBIDDEN", message: "Cannot mutate public capital while in Private mode" });
        }
        if (privacyMode !== "Private" && target.visibility === "Private") {
            return reply.status(403).send({ code: "FORBIDDEN", message: "Switch to Private mode to manage restricted capital" });
        }

        await performInstitutionCapitalWithdraw(
            fastify.cantaraConfig,
            contractId,
            parsedBody.data.amount,
            new Date().toISOString()
        );
        return { status: "ok" };
    });
}
