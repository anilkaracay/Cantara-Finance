import { loadBotConfigFromEnv } from "./config.js";
import { startPolling } from "./runner.js";
import { logger } from "./logger.js";

async function main() {
    const config = loadBotConfigFromEnv();
    await startPolling(config);
}

main().catch((err) => {
    logger.fatal({ err }, "Liquidator bot crashed");
    process.exit(1);
});
