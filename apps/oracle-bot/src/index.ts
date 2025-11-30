import { loadOracleBotConfigFromEnv } from "./config.js";
import { runOracleLoop } from "./runLoop.js";
import { logger } from "./logger.js";

async function main() {
    logger.info("Starting Oracle Bot... VERSION FINAL");
    try {
        const config = loadOracleBotConfigFromEnv();
        logger.info({ env: config.env }, "Starting Cantara Oracle Bot");
        await runOracleLoop(config);
    } catch (err) {
        logger.fatal({ err }, "Oracle Bot crashed on startup");
        process.exit(1);
    }
}

main();
