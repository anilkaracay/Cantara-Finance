"use client";

import { useState } from "react";
import { usePortfolioActions, useOracles, useWallet, usePortfolio } from "@/hooks/usePortfolio";
import { usePermissionlessPools } from "@/hooks/usePools";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface AssetActionSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "deposit" | "withdraw" | "borrow" | "repay";
    assetSymbol: string;
}

export function AssetActionSlideOver({ isOpen, onClose, mode, assetSymbol }: AssetActionSlideOverProps) {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { deposit, withdraw, borrow, repay } = usePortfolioActions();
    const { data: oracles } = useOracles();
    const { data: pools, isLoading: isPoolsLoading } = usePermissionlessPools();
    const { data: wallet } = useWallet();
    const { data: portfolio } = usePortfolio();

    if (!isOpen) return null;

    const isLoading = deposit.isPending || withdraw.isPending || borrow.isPending || repay.isPending;

    // Calculate Max Amount
    let maxAmount = 0;
    const pool = pools?.find(p => p.assetSymbol === assetSymbol);
    const holding = wallet?.find(h => h.symbol === assetSymbol);

    // Handle DAML Map
    let depositAmount = "0";
    if (portfolio?.deposits) {
        if (Array.isArray(portfolio.deposits)) {
            const entry = (portfolio.deposits as any[]).find(([k, v]) => k === assetSymbol);
            if (entry) depositAmount = entry[1];
        } else {
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

    // Helper: Calculate available borrow capacity
    const calculateAvailableToBorrow = (): number => {
        if (!portfolio || !pools || !oracles) return 0;

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
    };

    if (mode === "deposit") {
        maxAmount = holding ? Number(holding.amount) : 0;
    } else if (mode === "withdraw") {
        maxAmount = Number(depositAmount);
    } else if (mode === "repay") {
        const walletBal = holding ? Number(holding.amount) : 0;
        const debt = Number(borrowAmount);
        maxAmount = Math.min(walletBal, debt);
    } else if (mode === "borrow") {
        const availableBorrowCapacity = portfolio ? calculateAvailableToBorrow() : 0;
        const poolLiquidity = pool ? Number(pool.totalDeposits) - Number(pool.totalBorrows) : 0;
        maxAmount = Math.min(availableBorrowCapacity, poolLiquidity);
    }

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
        if (!pool) {
            setError(`Pool not found for ${assetSymbol}`);
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
                let errorMessage = "Transaction failed";
                if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
            }
        };

        if (mode === "deposit") {
            const holding = wallet?.find(h => h.symbol === assetSymbol);
            if (!holding) {
                setError("No wallet balance for " + assetSymbol);
                return;
            }
            if (!portfolio) {
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
        <SlideOver
            isOpen={isOpen}
            onClose={onClose}
            title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} ${assetSymbol}`}
            className="w-full max-w-md"
        >
            <div className="space-y-6">
                {/* Asset Info Card */}
                <Card variant="glass" className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-text-secondary">Asset</span>
                        <span className="font-semibold text-text-primary">{assetSymbol}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-text-secondary">Oracle Price</span>
                        <span className="font-mono text-text-primary">
                            ${oracles?.find(o => o.symbol === assetSymbol)?.price || "..."}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                        <span className="text-sm text-text-secondary">Wallet Balance</span>
                        <span className="font-mono text-text-primary">
                            {wallet?.find(h => h.symbol === assetSymbol)?.amount || "0.00"}
                        </span>
                    </div>
                </Card>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-text-secondary">Amount</label>
                            <div className="text-xs text-text-tertiary">
                                Max: <span className="font-mono text-text-primary">{maxAmount.toFixed(4)}</span>
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
                                className="w-full bg-surface-highlight border border-border rounded-lg pl-4 pr-16 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors placeholder:text-text-tertiary"
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
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded hover:bg-primary/20 transition-colors"
                            >
                                MAX
                            </button>
                        </div>

                        {/* Percentage Chips */}
                        <div className="flex gap-2 mt-2">
                            {[25, 50, 75, 100].map((pct) => (
                                <button
                                    key={pct}
                                    type="button"
                                    onClick={() => {
                                        setAmount((maxAmount * (pct / 100)).toString());
                                        setError(null);
                                    }}
                                    className="flex-1 py-1 text-xs rounded-md bg-surface border border-border text-text-secondary hover:bg-surface-highlight hover:text-text-primary transition-colors"
                                >
                                    {pct}%
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                            className="flex-1 capitalize"
                        >
                            {mode}
                        </Button>
                    </div>
                </form>
            </div>
        </SlideOver>
    );
}
