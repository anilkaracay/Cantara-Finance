
import { getPermissionlessPools } from "@cantara/sdk";
import { loadBackendConfigFromEnv } from "./src/config";
import { makeDamlConfigFromBackend } from "./src/services/damlUtils";

async function main() {
    try {
        console.log("Loading config...");
        const config = loadBackendConfigFromEnv();
        console.log("Config loaded. Ledger ID:", config.damlLedgerId);
        console.log("Base URL:", config.damlBaseUrl);

        console.log("Creating Daml config with Admin token...");
        const damlConfig = makeDamlConfigFromBackend(config, config.damlAdminToken);

        console.log("Querying permissionless pools...");
        const pools = await getPermissionlessPools(damlConfig);
        console.log("Success! Found pools:", pools.length);
        console.log(JSON.stringify(pools, null, 2));
    } catch (e) {
        console.error("ERROR:", e);
    }
}

main();
