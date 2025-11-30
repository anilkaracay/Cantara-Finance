import { FastifyInstance } from "fastify";
import { z } from "zod";
import { OracleService } from "../services/oracleService.js";

export default async function adminRoutes(fastify: FastifyInstance) {
    fastify.post("/oracle/update", {
        schema: {
            description: "Update oracle price for an asset",
            tags: ["Admin"],
            body: z.object({
                symbol: z.string(),
                price: z.string(),
            }),
            response: {
                200: z.object({
                    status: z.number(),
                    result: z.any(),
                }),
            },
        },
    }, async (request, reply) => {
        const { symbol, price } = request.body as { symbol: string; price: string };
        const config = request.server.cantaraConfig;

        return await OracleService.updateOraclePrice(fastify.cantaraConfig, symbol, price);
    });
}
