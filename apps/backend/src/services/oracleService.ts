import { getAllOracles, updateOraclePrice as sdkUpdateOraclePrice, OraclePrice } from "@cantara/sdk";
import { BackendConfig } from "../config.js";
import { makeDamlConfigFromBackend } from "./damlUtils.js";
import { internalError, badRequest } from "../errors.js";

export class OracleService {
    static async getClientOracles(config: BackendConfig, requestingParty?: string | null) {
        // Use Admin token to ensure we can see all oracles, then filter by visibility
        const damlConfig = makeDamlConfigFromBackend(config, config.damlAdminToken);
        const oracles = await getAllOracles(damlConfig);

        if (!requestingParty) {
            return oracles;
        }

        const normalizedParty = requestingParty.trim();
        return oracles.filter((oracle: OraclePrice) => {
            const observers = Array.isArray(oracle.observers) ? oracle.observers : [];
            return (
                observers.includes(normalizedParty) ||
                oracle.admin === normalizedParty ||
                oracle.oracleUpdater === normalizedParty
            );
        });
    }

    static async updateOraclePrice(config: BackendConfig, symbol: string, newPrice: string) {
        if (!config.damlOracleToken) {
            throw internalError("Oracle token not configured");
        }
        const damlConfig = makeDamlConfigFromBackend(config, config.damlOracleToken);

        // 1. Find the OraclePrice contract
        const oracles = await getAllOracles(damlConfig);
        const oracle = oracles.find(o => o.symbol === symbol);

        if (!oracle) {
            throw badRequest(`Oracle not found for symbol: ${symbol}`);
        }

        // 2. Exercise UpdatePrice using SDK
        try {
            await sdkUpdateOraclePrice(damlConfig, {
                oracleContractId: oracle.contractId,
                newPrice: parseFloat(newPrice).toFixed(2),
                now: new Date().toISOString()
            });
            return { status: 200, result: "Price updated" };
        } catch (e: unknown) {
            console.error("SDK UpdatePrice failed:", e);
            throw internalError(`Failed to update price: ${(e as Error).message || e}`);
        }
    }
}
