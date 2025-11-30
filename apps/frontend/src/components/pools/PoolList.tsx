"use client";

import { useState } from "react";
import { usePermissionlessPools } from "@/hooks/usePools";
import { AssetActionDialog } from "@/components/positions/AssetActionDialog";

import { Skeleton } from "@/components/ui/Skeleton";
import { AssetIcon } from "@/components/ui/AssetIcon";

import { getAssetMetadata } from "@/utils/assetMetadata";

interface PoolListProps {
    mode: "supply" | "borrow";
}

export function PoolList({ mode }: PoolListProps) {
    const { data: pools, isLoading } = usePermissionlessPools();
    console.log("PoolList render:", { pools, isLoading, length: pools?.length });
    const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="space-y-2 text-right">
                                <Skeleton className="h-3 w-20 ml-auto" />
                                <Skeleton className="h-4 w-24 ml-auto" />
                            </div>
                            <Skeleton className="h-9 w-20 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!pools || pools.length === 0) {
        return <div className="text-sm text-slate-400">No pools found.</div>;
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4">
                {pools.map((pool) => {
                    const metadata = getAssetMetadata(pool.assetSymbol);

                    return (
                        <div
                            key={pool.poolId}
                            className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-slate-700 transition-colors flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl overflow-hidden ${metadata.color.split(" ")[0]}`}>
                                    <AssetIcon icon={metadata.icon} symbol={metadata.symbol} className="w-full h-full" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{metadata.name}</h3>
                                    <div className="text-xs text-slate-500 font-mono">
                                        {pool.assetSymbol} • {mode === "supply" ? `APY: ${(pool.supplyApy * 100).toFixed(2)}%` : `APR: ${(pool.borrowApy * 100).toFixed(2)}%`}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <div className="text-xs text-slate-500">{mode === "supply" ? "Total Supplied" : "Available Liquidity"}</div>
                                    <div className="font-mono text-sm text-slate-200">
                                        {mode === "supply" ? pool.totalDeposits : (Number(pool.totalDeposits) - Number(pool.totalBorrows)).toFixed(2)}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedAsset(pool.assetSymbol)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "supply"
                                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                        : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                        }`}
                                >
                                    {mode === "supply" ? "Supply" : "Borrow"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedAsset && (
                <AssetActionDialog
                    isOpen={!!selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                    mode={mode === "supply" ? "deposit" : "borrow"}
                    assetSymbol={selectedAsset}
                />
            )}
        </>
    );
}
