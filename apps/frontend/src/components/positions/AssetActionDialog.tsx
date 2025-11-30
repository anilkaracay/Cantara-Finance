"use client";

import { useState } from "react";
import { usePortfolioActions, useOracles, useWallet, usePortfolio } from "@/hooks/usePortfolio";
import { usePermissionlessPools } from "@/hooks/usePools";

interface AssetActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "deposit" | "withdraw" | "borrow" | "repay";
    assetSymbol: string;
}

export function AssetActionDialog({ isOpen, onClose, mode, assetSymbol }: AssetActionDialogProps) {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { deposit, withdraw, borrow, repay } = usePortfolioActions();
    const { data: oracles } = useOracles();
    const { data: pools, isLoading: isPoolsLoading } = usePermissionlessPools();
    const { data: wallet } = useWallet();
    const { data: portfolio } = usePortfolio();
    console.log("AssetActionDialog render:", { isOpen, mode, assetSymbol, poolsCount: pools?.length, isPoolsLoading });

    if (!isOpen) return null;

    const isLoading = deposit.isPending || withdraw.isPending || borrow.isPending || repay.isPending;

    // Calculate Max Amount
    let maxAmount = 0;
    const pool = pools?.find(p => p.assetSymbol === assetSymbol);
    const holding = wallet?.find(h => h.symbol === assetSymbol);

    // Handle DAML Map (which might be an array of tuples or an object)
    let depositAmount = "0";
    if (portfolio?.deposits) {
        if (Array.isArray(portfolio.deposits)) {
            // It's a DAML Map represented as [[key, value], ...]
            const entry = (portfolio.deposits as any[]).find(([k, v]) => k === assetSymbol);
            if (entry) depositAmount = entry[1];
        } else {
            // It's a plain object
            depositAmount = (portfolio.deposits as any)[assetSymbol] || "0";
        }
    }

    let borrowAmount = "0";
    if (portfolio?.borrows) {
        if (Array.isArray(portfolio.borrows)) {
            const entry = (portfolio.borrows as any[]).find(([k, v]) => k === assetSymbol);
            if (entry) borrowAmount = entry[1];
        } else {
            borrowAmount = (portfolio.borrows as any)[assetSymbol] || "0";
        }
    }

    if (mode === "deposit") {
        maxAmount = holding ? Number(holding.amount) : 0;
    } else if (mode === "withdraw") {
        maxAmount = Number(depositAmount);
        // TODO: Check if withdrawal would cause liquidation and cap it? 
        // For now, let backend handle the strict check, but we could warn.
    } else if (mode === "repay") {
        const walletBal = holding ? Number(holding.amount) : 0;
        const debt = Number(borrowAmount);
        maxAmount = Math.min(walletBal, debt);
    } else if (mode === "borrow") {
        // Calculate available borrow capacity based on collateral
        const availableBorrowCapacity = portfolio && pools && oracles ? (() => {
            let totalCollateralWithLTV = 0;
            const parseMap = (data: any): [string, string][] => {
                if (!data) return [];
                if (Array.isArray(data)) return data as [string, string][];
                return Object.entries(data);
            };

            parseMap(portfolio.deposits).forEach(([symbol, amount]) => {
                const amt = Number(amount);
                const pool = pools.find(p => p.assetSymbol === symbol);
                const oracle = oracles.find(o => o.symbol === symbol);
                const price = Number(oracle?.price || 0);

                if (amt > 0 && price > 0 && pool) {
                    const ltv = Number(pool.riskParams.rpMaxLtv);
                    totalCollateralWithLTV += amt * price * ltv;
                }
            });

            let totalDebtValue = 0;
            parseMap(portfolio.borrows).forEach(([symbol, amount]) => {
                const amt = Number(amount);
                const oracle = oracles.find(o => o.symbol === symbol);
                const price = Number(oracle?.price || 0);
                if (amt > 0 && price > 0) {
                    totalDebtValue += amt * price;
                }
            });

            const availableUSD = Math.max(0, totalCollateralWithLTV - totalDebtValue);
            const oracle = oracles.find(o => o.symbol === assetSymbol);
            const assetPrice = Number(oracle?.price || 1);

            return availableUSD / assetPrice;
        })() : 0;

        const poolLiquidity = pool ? Number(pool.totalDeposits) - Number(pool.totalBorrows) : 0;
        maxAmount = Math.min(availableBorrowCapacity, poolLiquidity);
    }

    // Helper: Calculate available borrow capacity
    const calculateAvailableToBorrow = (): number => {
        if (!portfolio || !pools || !oracles) return 0;

        // Calculate total collateral value with LTV
        let totalCollateralWithLTV = 0;
        const parseMap = (data: any): [string, string][] => {
            if (!data) return [];
            if (Array.isArray(data)) return data as [string, string][];
            return Object.entries(data);
        };

        parseMap(portfolio.deposits).forEach(([symbol, amount]) => {
            const amt = Number(amount);
            const pool = pools.find(p => p.assetSymbol === symbol);
            const oracle = oracles.find(o => o.symbol === symbol);
            const price = Number(oracle?.price || 0);

            if (amt > 0 && price > 0 && pool) {
                const ltv = Number(pool.riskParams.rpMaxLtv);
                totalCollateralWithLTV += amt * price * ltv;
            }
        });

        // Calculate total debt value
        let totalDebtValue = 0;
        parseMap(portfolio.borrows).forEach(([symbol, amount]) => {
            const amt = Number(amount);
            const oracle = oracles.find(o => o.symbol === symbol);
            const price = Number(oracle?.price || 0);
            if (amt > 0 && price > 0) {
                totalDebtValue += amt * price;
            }
        });

        // Available borrow capacity in USD
        const availableUSD = Math.max(0, totalCollateralWithLTV - totalDebtValue);

        // Convert to asset amount
        const oracle = oracles.find(o => o.symbol === assetSymbol);
        const assetPrice = Number(oracle?.price || 1);

        return availableUSD / assetPrice;
    };

    // Helper: Get current deposit amount
    const getCurrentDeposit = (): number => {
        return Number(depositAmount);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!amount) return;

        const val = Number(amount);
        if (val <= 0) {
            setError("Amount must be greater than 0");
            return;
        }
        if (val > maxAmount) {
            setError(`Amount exceeds maximum available (${maxAmount.toFixed(4)})`);
            return;
        }

        if (isPoolsLoading) {
            setError("Please wait, loading pools...");
            return;
        }

        const pool = pools?.find(p => p.assetSymbol === assetSymbol);
        console.log("AssetActionDialog Submit:", { mode, assetSymbol, poolsCount: pools?.length, poolFound: !!pool });

        if (!pool) {
            const available = pools?.map(p => p.assetSymbol).join(", ") || "None";
            console.error("Pool not found for symbol:", assetSymbol, "Available pools:", available);
            setError(`Pool not found for ${assetSymbol}. Available pools: ${available}`);
            return;
        }

        const options = {
            onSuccess: () => {
                setAmount("");
                setError(null);
                onClose();
            },
            onError: (err: any) => {
                console.error("Transaction error:", err);

                // Extract error message from backend response
                let errorMessage = "Transaction failed";

                if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }

                // Make error messages more user-friendly
                if (errorMessage.includes("Insufficient collateral")) {
                    if (mode === "borrow") {
                        // Calculate available borrow capacity
                        const availableToBorrow = portfolio ? calculateAvailableToBorrow() : 0;
                        errorMessage = `Insufficient collateral to borrow ${amount} ${assetSymbol}. Maximum you can borrow: ${availableToBorrow.toFixed(4)} ${assetSymbol}`;
                    } else if (mode === "withdraw") {
                        errorMessage = `Cannot withdraw ${amount} ${assetSymbol}. This would lower your Health Factor below 1.0. Try repaying some debt first.`;
                    }
                } else if (errorMessage.includes("Insufficient deposit")) {
                    const currentDeposit = getCurrentDeposit();
                    errorMessage = `Insufficient deposit. You have ${currentDeposit.toFixed(4)} ${assetSymbol} deposited.`;
                }

                setError(errorMessage);
            }
        };

        if (mode === "deposit") {
            // Find asset holding in wallet
            const holding = wallet?.find(h => h.symbol === assetSymbol); // Naive: takes first holding
            // In reality, user might have multiple holdings or we need to split.
            // For now, assume one holding per asset or take the first one.
            if (!holding) {
                setError("No wallet balance for " + assetSymbol);
                return;
            }
            if (!portfolio) {
                // If no portfolio, we can't deposit? 
                // Wait, Setup script creates portfolio. 
                // If user is new, they need to create portfolio first?
                // For now assume portfolio exists.
                setError("Portfolio not found");
                return;
            }
            deposit.mutate({
                portfolioCid: portfolio.contractId,
                assetCid: holding.contractId,
                poolCid: pool.contractId,
                amount: amount
            }, options);

        } else if (mode === "borrow") {
            if (!portfolio) {
                setError("Portfolio not found");
                return;
            }
            const oracleCids = oracles?.map(o => o.contractId) || [];
            borrow.mutate({
                portfolioCid: portfolio.contractId,
                symbol: assetSymbol,
                amount: amount,
                poolCid: pool.contractId,
                oracleCids: oracleCids
            }, options);

        } else if (mode === "repay") {
            if (!portfolio) {
                setError("Portfolio not found");
                return;
            }
            // Find asset holding to repay with
            const holding = wallet?.find(h => h.symbol === assetSymbol);
            if (!holding) {
                setError("No wallet balance to repay " + assetSymbol);
                return;
            }
            repay.mutate({
                portfolioCid: portfolio.contractId,
                assetCid: holding.contractId,
                poolCid: pool.contractId,
                amount: amount
            }, options);

        } else if (mode === "withdraw") {
            if (!portfolio) {
                setError("Portfolio not found");
                return;
            }
            const oracleCids = oracles?.map(o => o.contractId) || [];
            withdraw.mutate({
                portfolioCid: portfolio.contractId,
                symbol: assetSymbol,
                amount: amount,
                poolCid: pool.contractId,
                oracleCids: oracleCids
            }, options);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-lg font-semibold text-white capitalize">
                        {mode} {assetSymbol}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-slate-300">Amount</label>
                            <div className="text-xs text-slate-400">
                                Max: <span className="font-mono text-slate-200">{maxAmount.toFixed(4)}</span>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError(null);
                                }}
                                placeholder="0.00"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-16 py-2 text-white focus:outline-none focus:border-emerald-500"
                                required
                                min="0"
                                step="any"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setAmount(maxAmount.toString());
                                    setError(null);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded hover:bg-emerald-500/20 transition-colors"
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed capitalize"
                        >
                            {isLoading ? "Processing..." : mode}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
