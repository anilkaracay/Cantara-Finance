import { FastifyInstance } from "fastify";
import { z } from "zod";
import { PositionService } from "../services/positionService.js";
import { OracleService } from "../services/oracleService.js";
import { unauthorized } from "../errors.js";

const DepositBodySchema = z.object({
    portfolioCid: z.string(),
    assetCid: z.string(),
    poolCid: z.string(),
    amount: z.string(),
});

const WithdrawBodySchema = z.object({
    portfolioCid: z.string(),
    symbol: z.string(),
    amount: z.string(),
    poolCid: z.string(),
    oracleCids: z.array(z.string()),
});

const BorrowBodySchema = z.object({
    portfolioCid: z.string(),
    symbol: z.string(),
    amount: z.string(),
    poolCid: z.string(),
    oracleCids: z.array(z.string()),
});

const RepayBodySchema = z.object({
    portfolioCid: z.string(),
    assetCid: z.string(),
    poolCid: z.string(),
    amount: z.string(),
});

export default async function portfolioRoutes(fastify: FastifyInstance) {

    // GET /portfolio
    fastify.get("/", async (request) => {
        if (!request.cantaraUserParty) {
            throw unauthorized("Missing x-cantara-user header");
        }
        return await PositionService.getClientPortfolio(fastify.cantaraConfig, request.cantaraUserParty);
    });

    // GET /portfolio/wallet
    fastify.get("/wallet", async (request) => {
        if (!request.cantaraUserParty) {
            throw unauthorized("Missing x-cantara-user header");
        }
        return await PositionService.getClientAssetHoldings(fastify.cantaraConfig, request.cantaraUserParty);
    });

    // GET /portfolio/oracles
    fastify.get("/oracles", async (request) => {
        // Oracles are public/admin data, but we might need auth. Let's require auth for consistency.
        if (!request.cantaraUserParty) {
            throw unauthorized("Missing x-cantara-user header");
        }
        return await OracleService.getClientOracles(fastify.cantaraConfig);
    });

    // POST /portfolio/deposit
    fastify.post("/deposit", {
        schema: { body: DepositBodySchema }
    }, async (request) => {
        if (!request.cantaraUserParty) {
            throw unauthorized("Missing x-cantara-user header");
        }
        const { portfolioCid, assetCid, poolCid, amount } = request.body as z.infer<typeof DepositBodySchema>;
        return await PositionService.performDeposit(fastify.cantaraConfig, request.cantaraUserParty, portfolioCid, assetCid, poolCid, amount);
    });

    // POST /portfolio/withdraw
    fastify.post("/withdraw", {
        schema: { body: WithdrawBodySchema }
    }, async (request) => {
        if (!request.cantaraUserParty) {
            throw unauthorized("Missing x-cantara-user header");
        }
        const { portfolioCid, symbol, amount, poolCid, oracleCids } = request.body as z.infer<typeof WithdrawBodySchema>;
        return await PositionService.performWithdraw(fastify.cantaraConfig, request.cantaraUserParty, portfolioCid, symbol, amount, poolCid, oracleCids);
    });

    // POST /portfolio/borrow
    fastify.post("/borrow", {
        schema: { body: BorrowBodySchema }
    }, async (request) => {
        if (!request.cantaraUserParty) {
            throw unauthorized("Missing x-cantara-user header");
        }
        const { portfolioCid, symbol, amount, poolCid, oracleCids } = request.body as z.infer<typeof BorrowBodySchema>;
        return await PositionService.performBorrow(fastify.cantaraConfig, request.cantaraUserParty, portfolioCid, symbol, amount, poolCid, oracleCids);
    });

    // POST /portfolio/repay
    fastify.post("/repay", {
        schema: { body: RepayBodySchema }
    }, async (request) => {
        if (!request.cantaraUserParty) {
            throw unauthorized("Missing x-cantara-user header");
        }
        const { portfolioCid, assetCid, poolCid, amount } = request.body as z.infer<typeof RepayBodySchema>;
        return await PositionService.performRepay(fastify.cantaraConfig, request.cantaraUserParty, portfolioCid, assetCid, poolCid, amount);
    });
}

