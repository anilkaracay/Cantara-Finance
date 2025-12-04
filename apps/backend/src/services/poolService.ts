import { getPermissionlessPools } from "@cantara/sdk";
import { BackendConfig } from "../config.js";
import { makeDamlConfigFromBackend } from "./damlUtils.js";

export class PoolService {
    static async listPermissionlessPools(config: BackendConfig) {
        const damlConfig = makeDamlConfigFromBackend(config, config.damlAdminToken);
        return getPermissionlessPools(damlConfig);
    }

    static async listPermissionedPools(
        config: BackendConfig,
        ownerFilter?: string,
        privacyMode: "Public" | "Private" = "Public"
    ) {
        // Use admin token for public visibility so we can surface network-wide pools.
        // Switch to institution token for private mode, since those contracts are scoped.
        const token = privacyMode === "Private"
            ? (config.damlInstitutionToken || config.damlAdminToken)
            : config.damlAdminToken;
        const damlConfig = makeDamlConfigFromBackend(config, token);

        // Import dynamically to avoid circular deps if any, or just use standard import
        const { getPermissionedPools } = await import("@cantara/sdk");

        const pools = await getPermissionedPools(
            damlConfig,
            ownerFilter
        );

        const filteredPools = pools.filter(pool => {
            const poolVisibility = pool.visibility ?? "Public";
            if (privacyMode === "Private") {
                if (poolVisibility !== "Private") return false;
                if (ownerFilter) {
                    return pool.ownerInstitution === ownerFilter;
                }
                return true;
            }
            // Public mode should hide private pools by default
            if (poolVisibility === "Private") {
                return false;
            }
            if (ownerFilter) {
                return pool.ownerInstitution === ownerFilter;
            }
            return true;
        });

        // Group by category
        const crypto = filteredPools.filter(p => p.category === "Crypto" || !p.category); // Default to Crypto if null
        const securities = filteredPools.filter(p => p.category === "Securities");

        return {
            crypto,
            securities
        };
    }

    static async getHistory(config: BackendConfig, userParty: string) {
        const damlConfig = makeDamlConfigFromBackend(config, userParty);
        const { createDamlClient, CantaraPosition } = await import("@cantara/sdk");

        const client = createDamlClient(damlConfig);

        // Query all UserActions for this user (the user can see their own actions)
        const results = await client.query({
            templateIds: [CantaraPosition.UserAction.templateId],
            query: { user: userParty },
        });

        // Map to cleaner structure if needed, or return raw payload
        // Also sort by timestamp descending
        return results.map((r: any) => ({
            ...r.payload,
            contractId: r.contractId
        })).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
}
