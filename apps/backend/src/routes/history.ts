import { FastifyInstance } from "fastify";
import { z } from "zod";
import { HistoryService } from "../services/historyService.js";

export default async function historyRoutes(fastify: FastifyInstance) {
    fastify.get("/", {
        schema: {
            description: "Get transaction history",
            tags: ["History"],
            response: {
                200: z.array(z.object({
                    id: z.string(),
                    type: z.enum(["DEPOSIT", "WITHDRAW", "BORROW", "REPAY"]),
                    asset: z.string(),
                    amount: z.string(),
                    timestamp: z.string(),
                    txId: z.string().optional(),
                })),
            },
        },
    }, async (request, reply) => {
        const history = await HistoryService.getHistory();
        return history;
    });
}
