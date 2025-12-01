export interface RiskAssetMeta {
    symbol: string;
    decimals: number;
    price: number; // normalized USD value
    maxLtv: number;
    liqThreshold: number;
    liqBonus: number;
    class: "ClassA" | "ClassAA" | "ClassR";
}

export interface UserCollateralEntry {
    symbol: string;
    amount: number;
    usdValue: number;
}

export interface UserBorrowEntry {
    symbol: string;
    amount: number;
    usdValue: number;
}

export interface RiskSummary {
    totalCollateralUsd: number;
    totalBorrowUsd: number;
    netWorthUsd: number;
    borrowCapacityUsd: number;
    healthFactor: number | null; // null if no borrows
    weightedAvgLtv: number;
    weightedAvgLiqThreshold: number;

    collaterals: UserCollateralEntry[];
    borrows: UserBorrowEntry[];
}

export interface LiquidatablePosition {
    contractId: string;
    userParty: string;
    assetSymbol: string;
    collateralAmount: string;
    debtAmount: string;
    healthFactor: number;
    hfThreshold: number;
    price: string;
}
