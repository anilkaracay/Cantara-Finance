import { AssetHolding, Portfolio } from "@cantara/sdk";

// Initial Constants
const INITIAL_WALLET_AMOUNT = "1000.00";

// Initial Wallet State
let mockWallet: AssetHolding[] = [
    { contractId: "mock-usdc-holding", owner: "User", symbol: "USDC", amount: INITIAL_WALLET_AMOUNT },
    { contractId: "mock-btc-holding", owner: "User", symbol: "BTC", amount: INITIAL_WALLET_AMOUNT },
    { contractId: "mock-eth-holding", owner: "User", symbol: "ETH", amount: INITIAL_WALLET_AMOUNT },
    { contractId: "mock-cc-holding", owner: "User", symbol: "CC", amount: INITIAL_WALLET_AMOUNT }
];

// Initial Portfolio State
let mockPortfolio: Portfolio = {
    contractId: "mock-portfolio-1",
    user: "User",
    admin: "Admin",
    deposits: {}, // Map<Symbol, Amount>
    borrows: {},  // Map<Symbol, Amount>
    lastAccrualTime: new Date().toISOString()
};

// Initial Oracle Prices
const mockOracles = [
    { contractId: "mock-oracle-usdc", symbol: "USDC", price: "1.00", updater: "Oracle", lastUpdateTime: new Date().toISOString() },
    { contractId: "mock-oracle-btc", symbol: "BTC", price: "90000.00", updater: "Oracle", lastUpdateTime: new Date().toISOString() },
    { contractId: "mock-oracle-eth", symbol: "ETH", price: "3000.00", updater: "Oracle", lastUpdateTime: new Date().toISOString() },
    { contractId: "mock-oracle-cc", symbol: "CC", price: "0.10", updater: "Oracle", lastUpdateTime: new Date().toISOString() }
];

// Initial Pools State
const mockPools = [
    {
        contractId: "mock-usdc-pool",
        admin: "Admin",
        poolId: "USDC-Pool",
        railType: "Permissionless",
        assetSymbol: "USDC",
        assetClass: "ClassAA",
        totalDeposits: "1000000",
        totalBorrows: "450000",
        baseRate: "0.02",
        slope1: "0.04",
        slope2: "0.75",
        kinkUtilization: "0.8",
        riskParams: { rpMaxLtv: "0.85", rpLiquidationThreshold: "0.90", rpLiquidationBonus: "0.05", rpMinHealthFactor: "1.1", rpRailType: "Permissionless" }
    },
    {
        contractId: "mock-btc-pool",
        admin: "Admin",
        poolId: "BTC-Pool",
        railType: "Permissionless",
        assetSymbol: "BTC",
        assetClass: "ClassA",
        totalDeposits: "150",
        totalBorrows: "50",
        baseRate: "0.01",
        slope1: "0.03",
        slope2: "0.50",
        kinkUtilization: "0.75",
        riskParams: { rpMaxLtv: "0.70", rpLiquidationThreshold: "0.80", rpLiquidationBonus: "0.10", rpMinHealthFactor: "1.2", rpRailType: "Permissionless" }
    },
    {
        contractId: "mock-eth-pool",
        admin: "Admin",
        poolId: "ETH-Pool",
        railType: "Permissionless",
        assetSymbol: "ETH",
        assetClass: "ClassA",
        totalDeposits: "5000",
        totalBorrows: "2500",
        baseRate: "0.015",
        slope1: "0.03",
        slope2: "0.60",
        kinkUtilization: "0.75",
        riskParams: { rpMaxLtv: "0.75", rpLiquidationThreshold: "0.85", rpLiquidationBonus: "0.08", rpMinHealthFactor: "1.15", rpRailType: "Permissionless" }
    },
    {
        contractId: "mock-cc-pool",
        admin: "Admin",
        poolId: "CC-Pool",
        railType: "Permissionless",
        assetSymbol: "CC",
        assetClass: "ClassB",
        totalDeposits: "10000000",
        totalBorrows: "3000000",
        baseRate: "0.03",
        slope1: "0.05",
        slope2: "1.00",
        kinkUtilization: "0.70",
        riskParams: { rpMaxLtv: "0.60", rpLiquidationThreshold: "0.70", rpLiquidationBonus: "0.15", rpMinHealthFactor: "1.3", rpRailType: "Permissionless" }
    }
];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockStore = {
    getWallet: () => {
        console.log("MockStore: getWallet", mockWallet);
        return [...mockWallet];
    },
    getPortfolio: () => {
        console.log("MockStore: getPortfolio", mockPortfolio);
        return { ...mockPortfolio };
    },
    getOracles: () => [...mockOracles],
    getPools: () => [...mockPools],

    deposit: async (symbol: string, amount: string) => {
        console.log(`MockStore: Depositing ${amount} ${symbol}`);
        await delay(500);
        const val = parseFloat(amount);

        // Update Wallet
        const holding = mockWallet.find(h => h.symbol === symbol);
        if (!holding) throw new Error("Asset not found in wallet");
        const currentWalletBal = parseFloat(holding.amount);
        if (currentWalletBal < val) throw new Error("Insufficient balance");
        holding.amount = (currentWalletBal - val).toFixed(2);

        // Update Portfolio
        const currentDeposit = parseFloat(mockPortfolio.deposits[symbol] || "0");
        mockPortfolio.deposits = {
            ...mockPortfolio.deposits,
            [symbol]: (currentDeposit + val).toFixed(2)
        };

        // Update Pool (Increase Deposits)
        const pool = mockPools.find(p => p.assetSymbol === symbol);
        if (pool) {
            pool.totalDeposits = (parseFloat(pool.totalDeposits) + val).toFixed(2);
        }

        console.log("MockStore: Deposit complete", { wallet: holding.amount, portfolio: mockPortfolio.deposits[symbol] });
        return { success: true };
    },

    withdraw: async (symbol: string, amount: string) => {
        console.log(`MockStore: Withdrawing ${amount} ${symbol}`);
        await delay(500);
        const val = parseFloat(amount);

        // Update Portfolio
        const currentDeposit = parseFloat(mockPortfolio.deposits[symbol] || "0");
        if (currentDeposit < val) throw new Error("Insufficient deposit");
        mockPortfolio.deposits = {
            ...mockPortfolio.deposits,
            [symbol]: (currentDeposit - val).toFixed(2)
        };

        // Update Wallet
        const holding = mockWallet.find(h => h.symbol === symbol);
        if (holding) {
            holding.amount = (parseFloat(holding.amount) + val).toFixed(2);
        } else {
            mockWallet.push({
                contractId: `mock-${symbol.toLowerCase()}-holding`,
                owner: "User",
                symbol: symbol,
                amount: val.toFixed(2)
            });
        }

        // Update Pool (Decrease Deposits)
        const pool = mockPools.find(p => p.assetSymbol === symbol);
        if (pool) {
            pool.totalDeposits = (parseFloat(pool.totalDeposits) - val).toFixed(2);
        }

        return { success: true };
    },

    borrow: async (symbol: string, amount: string) => {
        console.log(`MockStore: Borrowing ${amount} ${symbol}`);
        await delay(500);
        const val = parseFloat(amount);

        // Update Portfolio (Increase Borrow)
        const currentBorrow = parseFloat(mockPortfolio.borrows[symbol] || "0");
        mockPortfolio.borrows = {
            ...mockPortfolio.borrows,
            [symbol]: (currentBorrow + val).toFixed(2)
        };

        // Update Wallet (Receive Funds)
        const holding = mockWallet.find(h => h.symbol === symbol);
        if (holding) {
            holding.amount = (parseFloat(holding.amount) + val).toFixed(2);
        }

        // Update Pool (Increase Borrows)
        const pool = mockPools.find(p => p.assetSymbol === symbol);
        if (pool) {
            pool.totalBorrows = (parseFloat(pool.totalBorrows) + val).toFixed(2);
        }

        return { success: true };
    },

    repay: async (symbol: string, amount: string) => {
        console.log(`MockStore: Repaying ${amount} ${symbol}`);
        await delay(500);
        const val = parseFloat(amount);

        // Update Wallet (Pay Funds)
        const holding = mockWallet.find(h => h.symbol === symbol);
        if (!holding) throw new Error("Asset not found in wallet");
        const currentWalletBal = parseFloat(holding.amount);
        if (currentWalletBal < val) throw new Error("Insufficient balance");
        holding.amount = (currentWalletBal - val).toFixed(2);

        // Update Portfolio (Decrease Borrow)
        const currentBorrow = parseFloat(mockPortfolio.borrows[symbol] || "0");
        // Allow repaying more than borrow (just set to 0) or exact
        const newBorrow = Math.max(0, currentBorrow - val);
        mockPortfolio.borrows = {
            ...mockPortfolio.borrows,
            [symbol]: newBorrow.toFixed(2)
        };

        // Update Pool (Decrease Borrows)
        const pool = mockPools.find(p => p.assetSymbol === symbol);
        if (pool) {
            pool.totalBorrows = (parseFloat(pool.totalBorrows) - val).toFixed(2);
        }

        return { success: true };
    }
};
