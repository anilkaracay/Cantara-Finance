import { z } from "zod";
import "dotenv/config";

export interface LiquidatorBotConfig {
    env: "development" | "production";
    backendBaseUrl: string;
    liquidatorApiKey: string;
    pollIntervalMs: number;
    hfThreshold: number;
    maxPositionsPerCycle: number;
    dryRun: boolean;
}

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    LIQUIDATOR_BACKEND_URL: z.string().url().default("http://localhost:4000"),
    LIQUIDATOR_API_KEY: z.string().default("dev-liquidator-secret"),
    LIQUIDATOR_POLL_INTERVAL_MS: z.string().default("10000").transform(Number),
    LIQUIDATOR_HF_THRESHOLD: z.string().default("1.0").transform(Number),
    LIQUIDATOR_MAX_POSITIONS: z.string().default("5").transform(Number),
    LIQUIDATOR_DRY_RUN: z.string().default("true").transform((val) => val === "true"),
});

export function loadBotConfigFromEnv(): LiquidatorBotConfig {
    const env = envSchema.parse(process.env);
    return {
        env: env.NODE_ENV,
        backendBaseUrl: env.LIQUIDATOR_BACKEND_URL,
        liquidatorApiKey: env.LIQUIDATOR_API_KEY,
        pollIntervalMs: env.LIQUIDATOR_POLL_INTERVAL_MS,
        hfThreshold: env.LIQUIDATOR_HF_THRESHOLD,
        maxPositionsPerCycle: env.LIQUIDATOR_MAX_POSITIONS,
        dryRun: env.LIQUIDATOR_DRY_RUN,
    };
}
