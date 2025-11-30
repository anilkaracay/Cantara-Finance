export type RailType = "Permissionless" | "Permissioned";
export type AssetClass = "ClassA" | "ClassAA" | "ClassR";

export interface RiskParams {
    rpMaxLtv: string;                 // Decimal as string
    rpLiquidationThreshold: string;
    rpLiquidationBonus: string;
    rpMinHealthFactor: string;
    rpRailType: RailType;
}

export interface SupportedAsset {
    admin: string;
    symbol: string;
    assetClass: AssetClass;
    decimals: number;
    riskParams: RiskParams;
}

export interface LendingPool {
    contractId: string;
    admin: string;
    observers: string[];
    poolId: string;
    railType: RailType;
    assetSymbol: string;
    assetClass: AssetClass;
    totalDeposits: string;
    totalBorrows: string;
    baseRate: string;
    slope1: string;
    slope2: string;
    kinkUtilization: string;
    riskParams: RiskParams;
}

export interface Portfolio {
    contractId: string;
    user: string;
    admin: string;
    deposits: Record<string, string>; // Map Text Amount
    borrows: Record<string, string>; // Map Text Amount
    lastAccrualTime: string;
}

export interface AssetHolding {
    contractId: string;
    owner: string;
    symbol: string;
    amount: string;
}

export interface OraclePrice {
    contractId: string;
    oracleUpdater: string;
    admin: string;
    observers: string[];
    symbol: string;
    price: string;
    lastUpdatedAt: string;
}

// Package ID from the compiled DAR (cantara-daml-model-0.0.1.dar)
// This should match the Main-Dalf hash in META-INF/MANIFEST.MF
const PACKAGE_ID = "015064c8bfa936039d8e04e5d370ef00ede4fe76e304d7940a53ad3e4071090d";

export const TemplateIds = {
    SupportedAsset: `${PACKAGE_ID}:Cantara.Asset:SupportedAsset`,
    LendingPool: `${PACKAGE_ID}:Cantara.Pool:LendingPool`,
    Portfolio: `${PACKAGE_ID}:Cantara.Position:Portfolio`,
    AssetHolding: `${PACKAGE_ID}:Cantara.Wallet:AssetHolding`,
    OraclePrice: `${PACKAGE_ID}:Cantara.Oracle:OraclePrice`,
    LiquidationRight: `${PACKAGE_ID}:Cantara.Liquidation:LiquidationRight`,
} as const;
