export * from './config';
export * from './damlClient';
export * from './types';
export * from './queries';
export * from './commands';

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
