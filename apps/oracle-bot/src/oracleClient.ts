import {
    CantaraDamlConfig,
    TemplateIds,
    updateOraclePrice as sdkUpdateOraclePrice,
    createDamlClient,
} from "@cantara/sdk";
import { OracleBotConfig } from "./config.js";
import { logger } from "./logger.js";

export function makeDamlConfig(config: OracleBotConfig): CantaraDamlConfig {
    return {
        baseUrl: config.damlBaseUrl,
        ledgerId: config.damlLedgerId,
        apiToken: config.damlOracleToken,
        timeoutMs: 10_000,
    };
}

async function getOracleContractId(
    config: OracleBotConfig,
    symbol: string
): Promise<string | null> {
    const damlConfig = makeDamlConfig(config);
    const client = createDamlClient(damlConfig);
    console.log("DEBUG: getOracleContractId VERSION 3");

    try {
        const results = await client.query<any>({
            templateIds: [TemplateIds.OraclePrice],
            query: { symbol },
        });

        // logger.info({ results }, "Query results"); // Commented out to avoid noise, but useful for debugging
        if (!results || results.length === 0) {
            return null;
        }

        // DAML JSON API query returns objects with `contractId` and `payload`
        // The SDK `query` returns `T[]`. If T is the payload, we might miss the contractId.
        // Let's check SDK implementation of `query`.
        // It returns `response.data.result`.
        // Standard DAML JSON API /v1/query returns:
        // [ { contractId: "...", payload: { ... } }, ... ]
        // So `results[0]` should have `contractId`.
        const contract = results[0] as unknown as { contractId: string };
        return contract.contractId;
    } catch (err) {
        logger.error({ err, symbol }, "Failed to query OraclePrice contract");
        return null;
    }
}

export async function pushPriceToLedger(
    config: OracleBotConfig,
    symbol: string,
    price: number,
    timestamp: Date
): Promise<void> {
    const cid = await getOracleContractId(config, symbol);
    if (!cid) {
        logger.warn({ symbol }, "OraclePrice contract not found, skipping update");
        return;
    }

    const damlConfig = makeDamlConfig(config);
    await sdkUpdateOraclePrice(damlConfig, {
        oracleContractId: cid,
        newPrice: price.toString(),
        now: timestamp.toISOString(),
    });
}
