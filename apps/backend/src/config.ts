import 'dotenv/config';
import { z } from 'zod';

export interface BackendConfig {
    env: "development" | "production" | "test";
    port: number;
    damlBaseUrl: string;
    damlLedgerId: string;
    damlUserToken: string;
    damlAdminToken: string;
    damlLiquidatorToken?: string;
    damlOracleToken?: string;
    liquidatorApiKey: string;
    corsOrigin: string;
}

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    BACKEND_PORT: z.string().default("4000").transform(Number),
    CANTARA_DAML_BASE_URL: z.string().url(),
    CANTARA_DAML_LEDGER_ID: z.string(),
    CANTARA_DAML_USER_TOKEN: z.string(),
    CANTARA_DAML_ADMIN_TOKEN: z.string(),
    CANTARA_DAML_LIQUIDATOR_TOKEN: z.string().optional(),
    CANTARA_DAML_ORACLE_TOKEN: z.string().optional(),
    LIQUIDATOR_API_KEY: z.string().default("dev-liquidator-secret"),
    BACKEND_CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

export function loadBackendConfigFromEnv(): BackendConfig {
    const env = envSchema.parse(process.env);
    return {
        env: env.NODE_ENV,
        port: env.BACKEND_PORT,
        damlBaseUrl: env.CANTARA_DAML_BASE_URL,
        damlLedgerId: env.CANTARA_DAML_LEDGER_ID,
        damlUserToken: env.CANTARA_DAML_USER_TOKEN,
        damlAdminToken: env.CANTARA_DAML_ADMIN_TOKEN,
        damlLiquidatorToken: env.CANTARA_DAML_LIQUIDATOR_TOKEN,
        damlOracleToken: env.CANTARA_DAML_ORACLE_TOKEN,
        liquidatorApiKey: env.LIQUIDATOR_API_KEY,
        corsOrigin: env.BACKEND_CORS_ORIGIN,
    };
}
