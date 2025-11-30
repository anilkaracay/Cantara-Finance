import { z } from 'zod';

export interface CantaraDamlConfig {
    baseUrl: string;
    ledgerId: string;
    apiToken?: string;
    timeoutMs?: number;
}

const envSchema = z.object({
    CANTARA_DAML_BASE_URL: z.string().url(),
    CANTARA_DAML_LEDGER_ID: z.string(),
    CANTARA_DAML_API_TOKEN: z.string().optional(),
});

export function loadConfigFromEnv(): CantaraDamlConfig {
    const env = envSchema.parse(process.env);
    return {
        baseUrl: env.CANTARA_DAML_BASE_URL,
        ledgerId: env.CANTARA_DAML_LEDGER_ID,
        apiToken: env.CANTARA_DAML_API_TOKEN,
    };
}
