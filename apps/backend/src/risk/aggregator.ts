import { CantaraDamlConfig } from "@cantara/sdk";
import { getPermissionlessPools, getPortfolio, getAllOracles, getAllPortfolios, Portfolio } from "@cantara/sdk";
import { RiskAssetMeta, RiskSummary, UserCollateralEntry, UserBorrowEntry, LiquidatablePosition } from "./types.js";
import { toDecimal, usdValue, computeWeightedAverage, computeHealthFactor } from "./math.js";

export class RiskAggregator {
    private config: CantaraDamlConfig;

    constructor(config: CantaraDamlConfig) {
        this.config = config;
    }

    private async loadAssets(): Promise<Record<string, RiskAssetMeta>> {
        const [pools, oracles] = await Promise.all([
            getPermissionlessPools(this.config),
            getAllOracles(this.config)
        ]);

        const assets: Record<string, RiskAssetMeta> = {};
        const priceMap: Record<string, number> = {};

        oracles.forEach(o => {
            priceMap[o.symbol] = parseFloat(o.price);
        });

        pools.forEach(pool => {
            const price = priceMap[pool.assetSymbol] || 0;
            if (price === 0) {
                console.warn(`Missing price for asset ${pool.assetSymbol}, treating as 0 value.`);
            }

            assets[pool.assetSymbol] = {
                symbol: pool.assetSymbol,
                decimals: 0,
                price: price,
                maxLtv: parseFloat(pool.riskParams.rpMaxLtv),
                liqThreshold: parseFloat(pool.riskParams.rpLiquidationThreshold),
                liqBonus: parseFloat(pool.riskParams.rpLiquidationBonus),
                class: pool.assetClass as "ClassA" | "ClassAA" | "ClassR"
            };
        });

        return assets;
    }

    private calculateRisk(portfolio: Portfolio, assets: Record<string, RiskAssetMeta>): RiskSummary {
        const collaterals: UserCollateralEntry[] = [];
        const borrows: UserBorrowEntry[] = [];

        let totalCollateralUsd = 0;
        let totalBorrowUsd = 0;

        // Process Deposits (Collateral)
        if (portfolio.deposits) {
            const deposits = portfolio.deposits as unknown as Record<string, string> | Map<string, string>;
            const entries = deposits instanceof Map ? Array.from(deposits.entries()) : Object.entries(deposits || {});

            for (const [symbol, amountStr] of entries) {
                const amount = parseFloat(amountStr);
                const asset = assets[symbol];
                if (!asset) continue;

                const usd = usdValue(amount, asset.price);
                totalCollateralUsd += usd;

                collaterals.push({
                    symbol,
                    amount,
                    usdValue: usd
                });
            }
        }

        // Process Borrows (Debt)
        if (portfolio.borrows) {
            const borrowsMap = portfolio.borrows as unknown as Record<string, string> | Map<string, string>;
            const entries = borrowsMap instanceof Map ? Array.from(borrowsMap.entries()) : Object.entries(borrowsMap || {});

            for (const [symbol, amountStr] of entries) {
                const amount = parseFloat(amountStr);
                const asset = assets[symbol];
                if (!asset) continue;

                const usd = usdValue(amount, asset.price);
                totalBorrowUsd += usd;

                borrows.push({
                    symbol,
                    amount,
                    usdValue: usd
                });
            }
        }

        const collateralUsdValues = collaterals.map(c => c.usdValue);
        const ltvWeights = collaterals.map(c => assets[c.symbol]?.maxLtv || 0);
        const liqThresholdWeights = collaterals.map(c => assets[c.symbol]?.liqThreshold || 0);

        const weightedAvgLtv = computeWeightedAverage(ltvWeights, collateralUsdValues);
        const weightedAvgLiqThreshold = computeWeightedAverage(liqThresholdWeights, collateralUsdValues);

        const borrowCapacityUsd = totalCollateralUsd * weightedAvgLtv;
        const netWorthUsd = totalCollateralUsd - totalBorrowUsd;

        const healthFactor = computeHealthFactor(totalCollateralUsd, totalBorrowUsd, weightedAvgLiqThreshold);

        return {
            totalCollateralUsd,
            totalBorrowUsd,
            netWorthUsd,
            borrowCapacityUsd,
            healthFactor,
            weightedAvgLtv,
            weightedAvgLiqThreshold,
            collaterals,
            borrows
        };
    }

    async getRiskSummary(userParty: string): Promise<RiskSummary> {
        const [assets, portfolio] = await Promise.all([
            this.loadAssets(),
            getPortfolio(this.config, userParty)
        ]);

        if (!portfolio) {
            // Return empty summary if no portfolio
            return {
                totalCollateralUsd: 0,
                totalBorrowUsd: 0,
                netWorthUsd: 0,
                borrowCapacityUsd: 0,
                healthFactor: null,
                weightedAvgLtv: 0,
                weightedAvgLiqThreshold: 0,
                collaterals: [],
                borrows: []
            };
        }

        return this.calculateRisk(portfolio, assets);
    }

    async findLiquidatablePositions(maxHf: number = 1.0, limit: number = 50): Promise<LiquidatablePosition[]> {
        const [assets, portfolios] = await Promise.all([
            this.loadAssets(),
            getAllPortfolios(this.config)
        ]);

        const liquidatable: LiquidatablePosition[] = [];

        for (const portfolio of portfolios) {
            if (liquidatable.length >= limit) break;

            const risk = this.calculateRisk(portfolio, assets);

            if (risk.healthFactor !== null && risk.healthFactor < maxHf) {
                // Found a liquidatable position
                // We need to pick an asset to liquidate. 
                // For simplicity, we pick the largest debt and largest collateral.
                // Or just return the position info and let the bot decide.
                // The LiquidatablePosition type expects single asset fields, which implies a specific pair.
                // But a user might have multiple debts/collaterals.
                // Let's pick the largest debt asset to repay.

                const largestDebt = risk.borrows.reduce((prev, current) => (prev.usdValue > current.usdValue) ? prev : current, risk.borrows[0]);
                const largestCollateral = risk.collaterals.reduce((prev, current) => (prev.usdValue > current.usdValue) ? prev : current, risk.collaterals[0]);

                if (largestDebt && largestCollateral) {
                    liquidatable.push({
                        contractId: portfolio.contractId,
                        userParty: portfolio.user,
                        assetSymbol: largestDebt.symbol, // The asset to repay
                        collateralAmount: largestCollateral.amount.toString(), // Just for info
                        debtAmount: largestDebt.amount.toString(),
                        healthFactor: risk.healthFactor,
                        hfThreshold: maxHf,
                        price: assets[largestDebt.symbol].price.toString()
                    });
                }
            }
        }

        return liquidatable;
    }
}
