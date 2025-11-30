import axios from "axios";
import { z } from "zod";
import { OracleBotConfig } from "./config.js";
import { logger } from "./logger.js";

export interface AssetPrice {
    symbol: string;
    price: number;
    timestamp: Date;
}

export interface PriceSource {
    getPrices(symbols: string[]): Promise<AssetPrice[]>;
}

// --- Dummy Source ---

class DummyPriceSource implements PriceSource {
    private basePrices: Record<string, number> = {
        ETH: 2000.0,
        BTC: 35000.0,
        USDC: 1.0,
        PAXG: 2000.0,
        USTB: 100.0,
        CC: 1.0, // Canton Coin
    };

    async getPrices(symbols: string[]): Promise<AssetPrice[]> {
        const now = new Date();
        return symbols.map((symbol) => {
            const base = this.basePrices[symbol] || 100.0;
            // Random walk: +/- 0.5%
            const variance = (Math.random() - 0.5) * 0.01;
            const price = base * (1 + variance);
            return {
                symbol,
                price: parseFloat(price.toFixed(4)),
                timestamp: now,
            };
        });
    }
}

// --- Coingecko Source ---

const CoingeckoResponseSchema = z.record(
    z.string(),
    z.object({
        usd: z.number(),
    })
);

class CoingeckoPriceSource implements PriceSource {
    private baseUrl: string;
    private symbolMap: Record<string, string> = {
        ETH: "ethereum",
        BTC: "bitcoin",
        USDC: "usd-coin",
        PAXG: "pax-gold",
        USTB: "tether-gold",
        CC: "canton-network", // Canton Coin
    };
    private dummyFallback = new DummyPriceSource();

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getPrices(symbols: string[]): Promise<AssetPrice[]> {
        const ids = symbols
            .map((s) => this.symbolMap[s])
            .filter((id) => !!id)
            .join(",");

        if (!ids) return [];

        try {
            const url = `${this.baseUrl}/simple/price?ids=${ids}&vs_currencies=usd`;
            const res = await axios.get(url);
            const data = CoingeckoResponseSchema.parse(res.data);
            const now = new Date();

            const results: AssetPrice[] = [];
            for (const symbol of symbols) {
                const id = this.symbolMap[symbol];
                if (id && data[id]) {
                    results.push({
                        symbol,
                        price: data[id].usd,
                        timestamp: now,
                    });
                } else {
                    logger.warn({ symbol }, "Symbol not found in Coingecko, using fallback");
                    // Fallback for specific missing symbol
                    const fallback = await this.dummyFallback.getPrices([symbol]);
                    if (fallback.length > 0) results.push(fallback[0]);
                }
            }
            return results;
        } catch (err) {
            logger.warn({ err }, "Coingecko fetch failed (Rate Limit?), using full fallback");
            return this.dummyFallback.getPrices(symbols);
        }
    }
}

export function makePriceSource(config: OracleBotConfig): PriceSource {
    if (config.priceSource === "dummy") {
        return new DummyPriceSource();
    } else {
        return new CoingeckoPriceSource(config.coingeckoBaseUrl);
    }
}
