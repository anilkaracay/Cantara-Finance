import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

export interface OracleBotConfig {
    env: "development" | "production";
    pollIntervalMs: number;
    staleAfterMs: number;
    allowedSymbols: string[];
    priceSource: "coingecko" | "dummy";
    coingeckoBaseUrl: string;
    damlBaseUrl: string;
    damlLedgerId: string;
    damlOracleToken: string;
}

export function loadOracleBotConfigFromEnv(): OracleBotConfig {
    const env = process.env.NODE_ENV === "production" ? "production" : "development";
    const pollIntervalMs = parseInt(process.env.ORACLE_POLL_INTERVAL_MS || "30000", 10);
    const staleAfterMs = parseInt(process.env.ORACLE_STALE_AFTER_MS || "300000", 10);
    const allowedSymbols = (process.env.ORACLE_ALLOWED_SYMBOLS || "ETH,BTC,USDC,PAXG,USTB,CC")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    const priceSource = (process.env.ORACLE_PRICE_SOURCE || "dummy") as "coingecko" | "dummy";
    const coingeckoBaseUrl = process.env.COINGECKO_BASE_URL || "https://api.coingecko.com/api/v3";

    const damlBaseUrl = process.env.CANTARA_DAML_BASE_URL;
    const damlLedgerId = process.env.CANTARA_DAML_LEDGER_ID;
    const damlOracleToken = process.env.CANTARA_DAML_ORACLE_TOKEN;

    if (!damlBaseUrl) throw new Error("Missing CANTARA_DAML_BASE_URL");
    if (!damlLedgerId) throw new Error("Missing CANTARA_DAML_LEDGER_ID");
    if (!damlOracleToken) throw new Error("Missing CANTARA_DAML_ORACLE_TOKEN");

    return {
        env,
        pollIntervalMs,
        staleAfterMs,
        allowedSymbols,
        priceSource,
        coingeckoBaseUrl,
        damlBaseUrl,
        damlLedgerId,
        damlOracleToken,
    };
}
