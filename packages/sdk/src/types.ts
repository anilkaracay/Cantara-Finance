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
    ownerInstitution?: string;
    rwaReference?: string;
    maturityDate?: string;
    visibility?: Visibility;
    category?: string;
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
export const PACKAGE_ID = "8940a9fd6a414732665a9c7ad3e19c5a67e47f109b665c04e8ac3a0a60873aac";

export const TemplateIds = {
    SupportedAsset: `${PACKAGE_ID}:Cantara.Asset:SupportedAsset`,
    LendingPool: `${PACKAGE_ID}:Cantara.Pool:LendingPool`,
    Portfolio: `${PACKAGE_ID}:Cantara.Position:Portfolio`,
    UserPosition: `${PACKAGE_ID}:Cantara.Position:UserPosition`,
    PositionFactory: `${PACKAGE_ID}:Cantara.Position:PositionFactory`,
    AssetHolding: `${PACKAGE_ID}:Cantara.Wallet:AssetHolding`,
    OraclePrice: `${PACKAGE_ID}:Cantara.Oracle:OraclePrice`,
    LiquidationRight: `${PACKAGE_ID}:Cantara.Liquidation:LiquidationRight`,
    KycVerifiedUser: `${PACKAGE_ID}:Cantara.Permissioned:KycVerifiedUser`,
    Institution: `${PACKAGE_ID}:Cantara.Permissioned:Institution`,
    InstitutionalCapital: `${PACKAGE_ID}:Cantara.Permissioned:InstitutionalCapital`,
    PermissionedPosition: `${PACKAGE_ID}:Cantara.Position:UserPosition`, // Reusing UserPosition template
} as const;

export type Visibility = "Public" | "Private";

export interface Institution {
    institution: string;
    name: string;
    country: string;
    riskProfile: string;
    visibility: Visibility;
    contractId: string;
}

export interface InstitutionalCapital {
    admin: string;
    institution: string;
    poolId: string;
    railType: RailType;
    visibility: Visibility;
    assetSymbol: string;
    suppliedAmount: string;
    createdAt: string;
    contractId: string;
}

export interface PermissionedPosition {
    user: string;
    admin: string;
    institution: string;
    poolId: string;
    railType: RailType;
    visibility: Visibility;
    assetSymbol: string;
    collateralAmount: string;
    debtAmount: string;
    lastAccrualTime: string;
    riskParams: RiskParams;
    contractId: string;
}

export interface KycVerifiedUser {
    contractId: string;
    admin: string;
    institution: string;
    user: string;
    railType: RailType;
    createdAt: string;
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
    ownerInstitution?: string;
    kycVerified: boolean;
    visibility?: Visibility;
}

export interface PositionFactory {
    contractId: string;
    admin: string;
}
