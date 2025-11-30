"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { LiquidateDialog } from "./LiquidateDialog";
import { useUser } from "@/context/UserContext";

interface LiquidatablePosition {
    user: string;
    portfolioContractId: string;
    healthFactor: number;
    totalCollateralValue: number;
    totalDebtValue: number;
    deposits: [string, string][];
    borrows: [string, string][];
}

export function PublicLiquidationsBoard() {
    const [selectedPosition, setSelectedPosition] = useState<LiquidatablePosition | null>(null);
    const { partyId } = useUser();

    const { data, isLoading } = useQuery<{ positions: LiquidatablePosition[] }>({
        queryKey: ["liquidation", "positions"],
        queryFn: async () => {
            return api.get("/liquidation/positions");
        },
        refetchInterval: 10000, // Refresh every 10 seconds
    });

    if (isLoading) {
        return <Skeleton className="w-full h-64 rounded-xl" />;
    }

    // Filter out current user's own position (can't liquidate yourself)
    const allPositions = data?.positions || [];
    const positions = allPositions.filter(p => p.user !== partyId);

    if (positions.length === 0) {
        return (
            <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 text-center">
                <div className="text-slate-400 mb-2">🎯 No Liquidatable Positions</div>
                <p className="text-sm text-slate-500">
                    All positions are healthy. Check back later for liquidation opportunities.
                </p>
                {allPositions.length > 0 && partyId && (
                    <p className="text-xs text-slate-400 mt-2">
                        (Your own position is liquidatable but you cannot liquidate yourself)
                    </p>
                )}
            </div>
        );
    }

    return (
        <>
            <LiquidateDialog
                isOpen={selectedPosition !== null}
                onClose={() => setSelectedPosition(null)}
                position={selectedPosition || {
                    user: "",
                    portfolioContractId: "",
                    healthFactor: 0,
                    totalCollateralValue: 0,
                    totalDebtValue: 0,
                    deposits: [],
                    borrows: [],
                }}
            />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                        🔍 Liquidation Opportunities
                    </h3>
                    <span className="text-sm text-emerald-400">
                        {positions.length} position{positions.length !== 1 ? 's' : ''} available
                    </span>
                </div>

                <div className="grid gap-4">
                    {positions.map((position, idx) => {
                        const profit = position.totalCollateralValue * 0.05; // 5% liquidation bonus

                        return (
                            <div
                                key={position.portfolioContractId || idx}
                                className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                                    {/* User */}
                                    <div>
                                        <div className="text-xs text-slate-500">User</div>
                                        <div className="text-sm text-white font-mono">
                                            {position.user.slice(0, 12)}...
                                        </div>
                                    </div>

                                    {/* Health Factor */}
                                    <div>
                                        <div className="text-xs text-slate-500">Health Factor</div>
                                        <div className="text-sm font-bold text-red-400">
                                            {position.healthFactor.toFixed(3)}
                                        </div>
                                    </div>

                                    {/* Collateral */}
                                    <div>
                                        <div className="text-xs text-slate-500">Collateral</div>
                                        <div className="text-sm text-white">
                                            ${position.totalCollateralValue.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Debt */}
                                    <div>
                                        <div className="text-xs text-slate-500">Debt</div>
                                        <div className="text-sm text-white">
                                            ${position.totalDebtValue.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Potential Profit */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-slate-500">Potential Profit</div>
                                            <div className="text-sm font-bold text-emerald-400">
                                                ${profit.toLocaleString()}
                                            </div>
                                        </div>
                                        <button
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                            onClick={() => setSelectedPosition(position)}
                                        >
                                            Liquidate
                                        </button>
                                    </div>
                                </div>

                                {/* Detailed breakdown */}
                                <details className="mt-3 text-xs text-slate-400">
                                    <summary className="cursor-pointer hover:text-slate-300">View Details</summary>
                                    <div className="mt-2 grid grid-cols-2 gap-4 p-3 bg-slate-950 rounded-lg">
                                        <div>
                                            <div className="font-semibold text-slate-300 mb-1">Deposits:</div>
                                            {position.deposits.map(([symbol, amount]) => (
                                                <div key={symbol} className="flex justify-between">
                                                    <span>{symbol}:</span>
                                                    <span>{parseFloat(amount).toFixed(4)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-300 mb-1">Borrows:</div>
                                            {position.borrows.map(([symbol, amount]) => (
                                                <div key={symbol} className="flex justify-between">
                                                    <span>{symbol}:</span>
                                                    <span>{parseFloat(amount).toFixed(4)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </details>
                            </div>
                        );
                    })}
                </div>

                <div className="text-xs text-slate-500 p-3 bg-slate-900/30 rounded-lg">
                    💡 <strong>Tip:</strong> Liquidation bonus is 5%. You must have liquidation rights and sufficient assets to repay the debt.
                </div>
            </div>
        </>
    );
}
