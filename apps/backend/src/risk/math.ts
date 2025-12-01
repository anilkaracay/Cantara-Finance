import { RiskAssetMeta, UserCollateralEntry } from "./types.js";

export function toDecimal(amount: string, decimals: number = 0): number {
    // Assuming amount is already a string representation of a decimal number from DAML
    // If DAML returns "1000.0", parseFloat handles it correctly.
    // If DAML returns scaled integers, we would need to divide by 10^decimals.
    // Based on previous interactions, DAML seems to return stringified decimals like "1000.0".
    return parseFloat(amount);
}

export function usdValue(amount: number, price: number): number {
    return amount * price;
}

export function computeWeightedAverage(values: number[], weights: number[]): number {
    if (values.length !== weights.length || values.length === 0) return 0;

    let totalWeight = 0;
    let weightedSum = 0;

    for (let i = 0; i < values.length; i++) {
        weightedSum += values[i] * weights[i];
        totalWeight += weights[i];
    }

    return totalWeight === 0 ? 0 : weightedSum / totalWeight;
}

export function computeBorrowCapacity(collaterals: UserCollateralEntry[], assets: Record<string, RiskAssetMeta>): number {
    return collaterals.reduce((acc, col) => {
        const asset = assets[col.symbol];
        if (!asset) return acc;
        return acc + (col.usdValue * asset.maxLtv);
    }, 0);
}

export function computeHealthFactor(totalCollateralUsd: number, totalBorrowUsd: number, weightedLiqThreshold: number): number | null {
    if (totalBorrowUsd === 0) return null;
    // HF = (Total Collateral USD * Weighted Liquidation Threshold) / Total Borrow USD
    // Wait, the standard formula is usually:
    // HF = (Sum(Collateral_i * LiqThreshold_i)) / Total Borrows
    // Which is equivalent to (Total Collateral * Weighted Avg Liq Threshold) / Total Borrows
    // IF the weighted avg is calculated based on collateral value weights.

    // Let's stick to the direct sum formula for precision and clarity in the aggregator, 
    // but if we are passed the weighted threshold, we can use it.
    // However, to be safe and precise, let's calculate the liquidation value directly.

    // If we assume weightedLiqThreshold is correctly calculated as (Sum(Col_i * LT_i) / TotalCollateral),
    // Then Numerator = TotalCollateral * (Sum(Col_i * LT_i) / TotalCollateral) = Sum(Col_i * LT_i).

    return (totalCollateralUsd * weightedLiqThreshold) / totalBorrowUsd;
}
