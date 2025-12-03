import { getPermissionlessPools } from "@cantara/sdk";
import { BackendConfig } from "../config.js";
import { makeDamlConfigFromBackend } from "./damlUtils.js";

export class PoolService {
    static async listPermissionlessPools(config: BackendConfig) {
        const damlConfig = makeDamlConfigFromBackend(config, config.damlAdminToken);
        return getPermissionlessPools(damlConfig);
    }

    static async listPermissionedPools(config: BackendConfig, institutionParty?: string) {
        // Use Institution token if available, otherwise Admin
        const token = config.damlInstitutionToken || config.damlAdminToken;
        const damlConfig = makeDamlConfigFromBackend(config, token);

        // Import dynamically to avoid circular deps if any, or just use standard import
        const { getPermissionedPools } = await import("@cantara/sdk");

        const pools = await getPermissionedPools(damlConfig, institutionParty);

        // Group by category
        const crypto = pools.filter(p => p.category === "Crypto" || !p.category); // Default to Crypto if null
        const securities = pools.filter(p => p.category === "Securities");

        return {
            crypto,
            securities
        };
    }

    static async getHistory(config: BackendConfig, userParty: string) {
        const damlConfig = makeDamlConfigFromBackend(config, config.damlUserToken);
        const { createDamlClient, CantaraPosition } = await import("@cantara/sdk");

        const client = createDamlClient(damlConfig);

        // Query all UserActions for this user (the user can see their own actions)
        const results = await client.query({
            templateIds: [CantaraPosition.UserAction.templateId],
        });

        // Map to cleaner structure if needed, or return raw payload
        // Also sort by timestamp descending
        return results.map((r: any) => ({
            ...r.payload,
            contractId: r.contractId
        })).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
}
