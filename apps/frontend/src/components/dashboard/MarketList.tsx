"use client";

import { useState } from "react";
import { usePermissionlessPools } from "@/hooks/usePools";
import { AssetActionSlideOver } from "@/components/positions/AssetActionSlideOver";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AssetIcon } from "@/components/ui/AssetIcon";
import { Sparkline } from "@/components/ui/Sparkline";
import { getAssetMetadata } from "@/utils/assetMetadata";
import { cn } from "@/lib/utils";

interface MarketListProps {
    mode: "supply" | "borrow";
}

// Deterministic pseudo-random data generator for sparklines
const generateSparklineData = (seed: string) => {
    const data = [];
    let val = 50;
    for (let i = 0; i < 20; i++) {
        // Simple hash-like effect
        const change = (seed.charCodeAt(i % seed.length) % 10) - 4;
        val = Math.max(10, Math.min(90, val + change));
        data.push(val);
    }
    return data;
};

export function MarketList({ mode }: MarketListProps) {
    const { data: pools, isLoading, error } = usePermissionlessPools();
    const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 rounded-2xl bg-surface-highlight/50 animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-sm text-error bg-error/10 p-4 rounded-xl border border-error/20">Error loading markets</div>;
    }

    if (!pools || pools.length === 0) {
        return <div className="text-sm text-text-tertiary p-4 text-center border border-dashed border-border rounded-xl">No markets available.</div>;
    }

    return (
        <>
            <div className="space-y-3">
                {[...pools].sort((a, b) => {
                    const priority: Record<string, number> = { "BTC": 1, "CC": 2, "ETH": 3 };
                    const pA = priority[a.assetSymbol] || 99;
                    const pB = priority[b.assetSymbol] || 99;
                    return pA - pB;
                }).map((pool) => {
                    const metadata = getAssetMetadata(pool.assetSymbol);
                    const apy = mode === "supply" ? pool.supplyApy : pool.borrowApy;
                    const liquidity = mode === "supply"
                        ? Number(pool.totalDeposits)
                        : Number(pool.totalDeposits) - Number(pool.totalBorrows);

                    const sparklineData = generateSparklineData(pool.assetSymbol + mode);

                    return (
                        <Card
                            key={pool.poolId}
                            variant="glass"
                            hoverEffect
                            className="p-4 flex items-center justify-between group cursor-pointer border-border/50 hover:border-primary/30 relative overflow-hidden"
                            onClick={() => setSelectedAsset(pool.assetSymbol)}
                        >
                            <div className="flex items-center gap-4 min-w-[180px]">
                                <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
                                    <AssetIcon icon={metadata.icon} symbol={metadata.symbol} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary text-lg group-hover:text-primary transition-colors">{metadata.name}</h3>
                                    <div className="text-xs text-text-tertiary font-mono flex items-center gap-1">
                                        {pool.assetSymbol}
                                        <span className="w-1 h-1 rounded-full bg-text-tertiary/50" />
                                        {pool.railType}
                                    </div>
                                </div>
                            </div>

                            {/* Sparkline - Hidden on small screens */}
                            <div className="hidden lg:block w-32 h-10 opacity-50 group-hover:opacity-100 transition-opacity">
                                <Sparkline data={sparklineData} width={120} height={40} />
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right min-w-[100px]">
                                    <div className="text-xs text-text-secondary mb-1 font-medium">
                                        {mode === "supply" ? "APY" : "APR"}
                                    </div>
                                    <div className={cn(
                                        "font-mono text-lg font-bold",
                                        mode === "supply" ? "text-success" : "text-warning"
                                    )}>
                                        {(apy * 100).toFixed(2)}%
                                    </div>
                                </div>

                                <div className="text-right hidden sm:block min-w-[120px]">
                                    <div className="text-xs text-text-secondary mb-1 font-medium">
                                        {mode === "supply" ? "Total Supplied" : "Liquidity"}
                                    </div>
                                    <div className="font-mono text-base text-text-primary font-medium">
                                        {liquidity.toLocaleString(undefined, { maximumFractionDigits: 0, style: 'currency', currency: 'USD' }).split('.')[0]}
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    variant={mode === "supply" ? "primary" : "secondary"}
                                    className="min-w-[90px] shadow-none group-hover:shadow-lg transition-all"
                                >
                                    {mode === "supply" ? "Supply" : "Borrow"}
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {selectedAsset && (
                <AssetActionSlideOver
                    isOpen={!!selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                    mode={mode === "supply" ? "deposit" : "borrow"}
                    assetSymbol={selectedAsset}
                />
            )}
        </>
    );
}
