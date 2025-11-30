"use client";

import { useState } from "react";
import { usePermissionlessPools } from "@/hooks/usePools";
import { useOracles, usePortfolio } from "@/hooks/usePortfolio";
import { useUser } from "@/context/UserContext";
import { AssetActionDialog } from "./AssetActionDialog";
import { getAssetMetadata } from "@/utils/assetMetadata";

import { Skeleton } from "@/components/ui/Skeleton";

export function PortfolioOverview() {
    const { partyId } = useUser();
    const { data: portfolio, isLoading } = usePortfolio();
    const { data: pools } = usePermissionlessPools();
    const { data: oracles } = useOracles();
    const [selectedAction, setSelectedAction] = useState<{ mode: "withdraw" | "repay"; symbol: string } | null>(null);

    if (!partyId) {
        return (
            <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center">
                <p className="text-slate-400">Set your Party ID in the sidebar to view your portfolio.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className={`h-24 rounded-xl ${i === 4 ? "col-span-2 md:col-span-1" : ""}`} />
                    ))}
                </div>
                <Skeleton className="h-32 rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-48 rounded-xl" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-48 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!portfolio) {
        return <div className="text-sm text-slate-400">No portfolio found. Deposit assets to start.</div>;
    }

    // Convert maps to arrays for rendering
    const parseMap = (data: any): [string, string][] => {
        if (!data) return [];
        if (Array.isArray(data)) {
            return data as [string, string][];
        }
        return Object.entries(data);
    };

    const deposits = parseMap(portfolio.deposits).filter(([_, amount]) => Number(amount) > 0);
    const borrows = parseMap(portfolio.borrows).filter(([_, amount]) => Number(amount) > 0);

    // Calculate Totals
    let totalCollateralUSD = 0;
    let totalBorrowCapacityUSD = 0;
    let totalCollateralWithLTV = 0; // For health factor calculation (uses LTV, not liquidation threshold)
    let totalDebtUSD = 0;
    let totalAnnualInterestEarned = 0;
    let totalAnnualInterestPaid = 0;

    deposits.forEach(([symbol, amount]) => {
        const amt = Number(amount);
        const pool = pools?.find(p => p.assetSymbol === symbol);
        const oracle = oracles?.find(o => o.symbol === symbol);
        const price = Number(oracle?.price || 0);

        if (amt > 0 && price > 0) {
            const value = amt * price;
            totalCollateralUSD += value;
            if (pool) {
                const ltv = Number(pool.riskParams.rpMaxLtv);
                totalBorrowCapacityUSD += value * ltv;
                totalCollateralWithLTV += value * ltv; // Use LTV for health factor, not liquidation threshold
                // Use calculated supplyApy if available, else fallback to baseRate (though usePools ensures it's there)
                const supplyApy = pool.supplyApy ?? Number(pool.baseRate);
                totalAnnualInterestEarned += value * supplyApy;
            }
        }
    });

    borrows.forEach(([symbol, amount]) => {
        const amt = Number(amount);
        const pool = pools?.find(p => p.assetSymbol === symbol);
        const oracle = oracles?.find(o => o.symbol === symbol);
        const price = Number(oracle?.price || 0);
        if (amt > 0 && price > 0) {
            const value = amt * price;
            totalDebtUSD += value;
            if (pool) {
                const borrowApy = pool.borrowApy ?? Number(pool.baseRate);
                totalAnnualInterestPaid += value * borrowApy;
            }
        }
    });

    const healthFactor = totalDebtUSD > 0 ? totalCollateralWithLTV / totalDebtUSD : Infinity;
    const netWorth = totalCollateralUSD - totalDebtUSD;
    const borrowUsage = totalBorrowCapacityUSD > 0 ? (totalDebtUSD / totalBorrowCapacityUSD) * 100 : 0;
    const availableToBorrow = Math.max(0, totalBorrowCapacityUSD - totalDebtUSD);

    let netApy = 0;
    if (netWorth > 0) {
        netApy = (totalAnnualInterestEarned - totalAnnualInterestPaid) / netWorth;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-xs uppercase">Net APY</div>
                    <div className={`text-2xl font-bold mt-1 ${netApy >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {(netApy * 100).toFixed(2)}%
                    </div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-xs uppercase">Net Worth</div>
                    <div className="text-2xl font-bold text-white mt-1">${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-xs uppercase">Health Factor</div>
                    <div className={`text-2xl font-bold mt-1 ${healthFactor < 1.1 ? "text-red-500" : healthFactor < 1.5 ? "text-yellow-500" : "text-emerald-400"}`}>
                        {healthFactor === Infinity ? "∞" : healthFactor.toFixed(2)}
                    </div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 col-span-2">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-slate-500 text-xs uppercase">Borrow Capacity</div>
                        <div className="text-xs text-slate-400">
                            <span className="text-white font-medium">${totalDebtUSD.toFixed(2)}</span> used of <span className="text-white font-medium">${totalBorrowCapacityUSD.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 mb-1">
                        <div
                            className={`h-2.5 rounded-full ${borrowUsage > 90 ? "bg-red-500" : borrowUsage > 75 ? "bg-yellow-500" : "bg-blue-500"}`}
                            style={{ width: `${Math.min(borrowUsage, 100)}%` }}
                        ></div>
                    </div>
                    <div className="text-right text-xs text-emerald-400">
                        Available to Borrow: ${availableToBorrow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            {/* Wallet Balance Section */}
            <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-6 rounded-2xl border border-indigo-500/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Wallet Balance (Available to Deposit)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* We need to fetch wallet balance here or pass it down. For now, relying on the top-right wallet display, but adding a hint. */}
                    <div className="text-sm text-slate-400">
                        Check your wallet balance in the top right corner. Use &quot;Supply&quot; below to move funds from Wallet to Deposits.
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Deposits */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">My Deposits</h3>
                    <div className="overflow-hidden rounded-xl border border-slate-800">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-900/50 text-slate-400">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Asset</th>
                                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 bg-slate-900/20">
                                {deposits.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">No deposits</td>
                                    </tr>
                                ) : (
                                    deposits.map(([symbol, amount]) => {
                                        const metadata = getAssetMetadata(symbol);
                                        return (
                                            <tr key={symbol} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                                    <span>{metadata.icon}</span>
                                                    <span>{metadata.name}</span>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-slate-200 text-right">{amount}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => setSelectedAction({ mode: "withdraw", symbol })}
                                                        className="text-xs text-red-400 hover:text-red-300"
                                                    >
                                                        Withdraw
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Borrows */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">My Borrows</h3>
                    <div className="overflow-hidden rounded-xl border border-slate-800">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-900/50 text-slate-400">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Asset</th>
                                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 bg-slate-900/20">
                                {borrows.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">No borrows</td>
                                    </tr>
                                ) : (
                                    borrows.map(([symbol, amount]) => {
                                        const metadata = getAssetMetadata(symbol);
                                        return (
                                            <tr key={symbol} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                                    <span>{metadata.icon}</span>
                                                    <span>{metadata.name}</span>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-slate-200 text-right">{amount}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => setSelectedAction({ mode: "repay", symbol })}
                                                        className="text-xs text-blue-400 hover:text-blue-300"
                                                    >
                                                        Repay
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedAction && (
                <AssetActionDialog
                    isOpen={!!selectedAction}
                    onClose={() => setSelectedAction(null)}
                    mode={selectedAction.mode}
                    assetSymbol={selectedAction.symbol}
                />
            )}
        </div>
    );
}
