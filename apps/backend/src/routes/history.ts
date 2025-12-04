import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PoolService } from "../services/poolService.js";

const HistoryItemSchema = z.object({
    contractId: z.string(),
    actor: z.string(),
    user: z.string(),
    actionType: z.string(),
    assetSymbol: z.string(),
    amount: z.string(),
    timestamp: z.string(),
    visibility: z.enum(["Public", "Private"]).optional(),
});

const HistoryResponseSchema = z.array(HistoryItemSchema);

export default async function historyRoutes(fastify: FastifyInstance) {
    fastify.get("/", {
        schema: {
            description: "Get user transaction history",
            response: {
                200: HistoryResponseSchema,
            },
        },
    }, async (request, reply) => {
        const userParty = request.cantaraUserParty;
        if (!userParty) {
            return reply.status(400).send({ code: "BAD_REQUEST", message: "User party header missing" });
        }

        const history = await PoolService.getHistory(fastify.cantaraConfig, userParty);
        return history;
    });
}
