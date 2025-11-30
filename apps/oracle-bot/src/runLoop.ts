import { OracleBotConfig } from "./config.js";
import { PriceSource, makePriceSource } from "./priceSources.js";
import { pushPriceToLedger } from "./oracleClient.js";
import { logger } from "./logger.js";

interface LastPriceCache {
    [symbol: string]: {
        price: number;
        timestamp: Date;
    };
}

export async function runOracleLoop(config: OracleBotConfig): Promise<void> {
    const source: PriceSource = makePriceSource(config);
    const cache: LastPriceCache = {};

    logger.info({ symbols: config.allowedSymbols }, "Starting Oracle Price Bot");

    async function tick() {
        try {
            const prices = await source.getPrices(config.allowedSymbols);
            const now = new Date();

            for (const p of prices) {
                const prev = cache[p.symbol];
                const ageMs = prev ? now.getTime() - prev.timestamp.getTime() : Infinity;
                const changePct = prev
                    ? Math.abs((p.price - prev.price) / prev.price) * 100
                    : Infinity;

                const isStale = ageMs > config.staleAfterMs;
                const isBigMove = changePct >= 0.5; // 0.5% threshold

                if (!prev || isStale || isBigMove) {
                    logger.info(
                        {
                            symbol: p.symbol,
                            newPrice: p.price,
                            changePct: prev ? changePct.toFixed(2) : "N/A",
                            ageMs: prev ? ageMs : "N/A",
                        },
                        "Pushing oracle price"
                    );
                    await pushPriceToLedger(config, p.symbol, p.price, p.timestamp);
                    cache[p.symbol] = p;
                } else {
                    logger.debug(
                        { symbol: p.symbol, price: p.price, changePct: changePct.toFixed(2) },
                        "Skipping update (not stale & small change)"
                    );
                }
            }
        } catch (err) {
            logger.error({ err }, "Oracle tick failed");
        }
    }

    // First immediate tick, then interval
    await tick();
    setInterval(tick, config.pollIntervalMs);
}
