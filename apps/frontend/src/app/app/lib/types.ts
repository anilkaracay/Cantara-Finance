export type RailType = "Permissionless" | "Permissioned";
export type AssetClass = "ClassA" | "ClassAA" | "ClassR";

export interface RiskParams {
    rpMaxLtv: string;
    rpLiquidationThreshold: string;
    rpLiquidationBonus: string;
    rpMinHealthFactor: string;
    rpRailType: RailType;
}

export interface Pool {
    admin: string;
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

export interface UserPosition {
    contractId: string;
    user: string;
    admin: string;
    poolId: string;
    railType: RailType;
    assetSymbol: string;
    collateralAmount: string;
    debtAmount: string;
    lastAccrualTime: string;
    riskParams: RiskParams;
}
