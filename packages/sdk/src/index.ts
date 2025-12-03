export * from './config';
export * from './damlClient';
export * from './types';
export * from './queries';
export * from './queries-permissioned';
export * from './commands';

// Export generated DAML types
export * as CantaraPool from './daml-types/cantara-daml-model-0.0.1/lib/Cantara/Pool/module';
export * as CantaraAsset from './daml-types/cantara-daml-model-0.0.1/lib/Cantara/Asset/module';
export * as CantaraOracle from './daml-types/cantara-daml-model-0.0.1/lib/Cantara/Oracle/module';
export * as CantaraPermissioned from './daml-types/cantara-daml-model-0.0.1/lib/Cantara/Permissioned/module';
export * as CantaraTypes from './daml-types/cantara-daml-model-0.0.1/lib/Cantara/Types/module';
export * as CantaraPosition from './daml-types/cantara-daml-model-0.0.1/lib/Cantara/Position/module';

import { loadConfigFromEnv } from './config';
import { getPermissionlessPools, getPortfolio, getAllOracles, getAllPortfolios } from './queries';
import { split, merge } from './commands';

export { split, merge };

// Minimal usage example
async function example() {
    try {
        const config = loadConfigFromEnv();
        const pools = await getPermissionlessPools(config);
        console.log("Pools:", pools);

        const user = "SomeUserParty";
        const portfolio = await getPortfolio(config, user);
        console.log("User portfolio:", portfolio);
    } catch (e) {
        console.error("Example failed:", e);
    }
}
