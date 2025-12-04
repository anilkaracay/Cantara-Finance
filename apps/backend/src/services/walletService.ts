import { getAssetHoldings, AssetHolding } from "@cantara/sdk";
import { BackendConfig } from "../config.js";
import { makeDamlConfigFromBackend } from "./damlUtils.js";
import { createDamlClient } from "@cantara/sdk";
import { TemplateIds } from "@cantara/sdk";

const PERMISSIONED_SYMBOLS = ["HOME", "REPO", "NOTE"] as const;
const TARGET_BALANCE = 1000;

export class WalletService {
    static async ensurePermissionedBalances(config: BackendConfig, party: string) {
        if (!party) return;
        try {
            const damlConfig = makeDamlConfigFromBackend(config, party);
            const holdings = await getAssetHoldings(damlConfig, party);
            const client = createDamlClient(damlConfig);

            for (const symbol of PERMISSIONED_SYMBOLS) {
                const current = holdings
                    .filter((h: AssetHolding) => h.symbol === symbol)
                    .reduce((sum, h) => sum + Number(h.amount), 0);

                if (current >= TARGET_BALANCE) {
                    continue;
                }

                const missing = TARGET_BALANCE - current;
                await client.create({
                    templateId: TemplateIds.AssetHolding,
                    payload: {
                        owner: party,
                        symbol,
                        amount: Number(missing.toFixed(4)),
                    },
                });
            }
        } catch (err) {
            console.error("Failed to ensure permissioned balances", err);
        }
    }
}


