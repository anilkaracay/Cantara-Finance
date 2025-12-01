import { LiquidatorBotConfig } from "./config.js";
import { logger } from "./logger.js";
import { fetchLiquidatablePositions, sendLiquidation, computeRepayAmount } from "./client.js";

export async function runOnce(config: LiquidatorBotConfig): Promise<void> {
    try {
        const positions = await fetchLiquidatablePositions(config);
        if (positions.length === 0) {
            logger.debug("No liquidatable positions found in this cycle");
            return;
        }

        logger.info({ count: positions.length }, "Found liquidatable positions");

        for (const pos of positions) {
            const repayAmount = computeRepayAmount(pos);
            if (Number(repayAmount) <= 0) {
                logger.warn({ pos }, "Computed repayAmount <= 0, skipping");
                continue;
            }

            if (config.dryRun) {
                logger.info({ pos, repayAmount }, "[DRY RUN] Would liquidate position");
                continue;
            }

            try {
                logger.info(
                    { contractId: pos.contractId, user: pos.userParty, repayAmount, hf: pos.healthFactor },
                    "Sending liquidation",
                );
                await sendLiquidation(config, pos, repayAmount);
                logger.info({ contractId: pos.contractId }, "Liquidation tx sent successfully");
            } catch (err: any) {
                logger.error({ err: err.message || err, contractId: pos.contractId }, "Failed to liquidate position");
            }
        }
    } catch (err: any) {
        logger.error({ err: err.message || err }, "Failed to fetch positions");
    }
}

export async function startPolling(config: LiquidatorBotConfig): Promise<void> {
    logger.info(
        {
            backend: config.backendBaseUrl,
            intervalMs: config.pollIntervalMs,
            hfThreshold: config.hfThreshold,
            dryRun: config.dryRun,
        },
        "Starting Cantara Liquidator Bot",
    );

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    while (true) {
        try {
            await runOnce(config);
        } catch (err) {
            logger.error({ err }, "Error in liquidation cycle");
        }
        await sleep(config.pollIntervalMs);
    }
}
