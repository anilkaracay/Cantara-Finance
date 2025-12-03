"use client";

import { useState } from "react";
import { usePermissionlessPools } from "@/hooks/usePools";
import { usePermissionedPools } from "@/hooks/permissioned/usePermissionedPools";
import { AssetActionSlideOver } from "@/components/positions/AssetActionSlideOver";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { AssetIcon } from "@/components/ui/AssetIcon";
import { getAssetMetadata } from "@/utils/assetMetadata";
import { cn, formatUsd } from "@/lib/utils";
import { Search, Filter, ChevronRight, Info, AlertCircle, Lock } from "lucide-react";

export default function PoolsPage() {
    const [filter, setFilter] = useState("all");
    const [selectedAsset, setSelectedAsset] = useState<{ symbol: string, mode: "deposit" | "borrow" } | null>(null);
    const [permissionedCategory, setPermissionedCategory] = useState<"crypto" | "securities" | null>(null);

    const { data: permissionlessPools, isLoading: isLoadingPermissionless } = usePermissionlessPools();
    const { data: permissionedPools, loading: isLoadingPermissioned, isInstitutional } = usePermissionedPools();

    const isLoading = isLoadingPermissionless || isLoadingPermissioned;

    // Calculate derived metrics for permissioned pools
    const calculateDerivedMetrics = (pool: any) => {
        const totalDeposits = Number(pool.totalDeposits);
        const totalBorrows = Number(pool.totalBorrows);
        const baseRate = Number(pool.baseRate);
        const slope1 = Number(pool.slope1);
        const slope2 = Number(pool.slope2);
        const kink = Number(pool.kinkUtilization);

        let utilization = 0;
        if (totalDeposits > 0) {
            utilization = totalBorrows / totalDeposits;
        }

        let borrowRate = baseRate;
        if (utilization <= kink) {
            borrowRate += utilization * slope1;
        } else {
            borrowRate += kink * slope1 + (utilization - kink) * slope2;
        }

        const supplyRate = borrowRate * utilization;

        return {
            ...pool,
            utilization,
            borrowApy: borrowRate,
            supplyApy: supplyRate
        };
    };

    const allPools = [
        ...(permissionlessPools || []).map(p => ({
            ...p,
            type: 'permissionless',
            supplyApy: p.supplyApy,
            borrowApy: p.borrowApy
        })),
        ...(permissionedPools?.crypto || []).map(p => ({
            ...calculateDerivedMetrics(p),
            type: 'permissioned',
            category: 'crypto'
        })),
        ...(permissionedPools?.securities || []).map(p => ({
            ...calculateDerivedMetrics(p),
            type: 'permissioned',
            category: 'securities'
        }))
    ];

    const filteredPools = allPools.filter(pool => {
        if (filter === "all") return true;
        if (filter === "permissionless") return pool.type === "permissionless";
        if (filter === "permissioned") {
            if (permissionedCategory === null) return pool.type === "permissioned";
            return pool.type === "permissioned" && pool.category === permissionedCategory;
        }
        return false;
    });

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">Lending Pools</h1>
                    <p className="text-text-secondary max-w-xl">
                        Access high-yield lending markets and borrow against your collateral with competitive rates.
                    </p>
                </div>
                <div className="w-full md:w-auto">
                    <Tabs
                        tabs={[
                            { id: "all", label: "All Pools" },
                            { id: "permissionless", label: "Permissionless" },
                            { id: "permissioned", label: "Permissioned" }
                        ]}
                        activeTab={filter}
                        onChange={(tab) => {
                            setFilter(tab);
                            if (tab !== "permissioned") setPermissionedCategory(null);
                        }}
                        className="w-full md:w-auto"
                    />
                </div>
            </div>

            {/* Permissioned Category Filter */}
            {filter === "permissioned" && (
                <div className="flex gap-3">
                    <Button
                        variant={permissionedCategory === null ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setPermissionedCategory(null)}
                    >
                        All Categories
                    </Button>
                    <Button
                        variant={permissionedCategory === "crypto" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setPermissionedCategory("crypto")}
                    >
                        Cryptocurrencies
                    </Button>
                    <Button
                        variant={permissionedCategory === "securities" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setPermissionedCategory("securities")}
                    >
                        Securities
                    </Button>
                </div>
            )}

            {/* Institutional Access Warning */}
            {filter === "permissioned" && !isInstitutional && !isLoadingPermissioned && (
                <Card variant="glass" className="border-warning/50 bg-warning/5">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-warning/20">
                            <Lock className="h-5 w-5 text-warning" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-text-primary mb-1 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-warning" />
                                Institutional Access Required
                            </h3>
                            <p className="text-sm text-text-secondary">
                                Permissioned markets are only accessible to verified institutions. 
                                Please contact us at <a href="mailto:contact@cantara.finance" className="text-primary hover:underline">contact@cantara.finance</a> to request institutional access.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Pools Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-[280px] rounded-2xl bg-surface-highlight/50 animate-pulse" />
                    ))}
                </div>
            ) : filteredPools.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl bg-surface/30">
                    <div className="p-4 rounded-full bg-surface-highlight mb-4">
                        <Search className="h-6 w-6 text-text-tertiary" />
                    </div>
                    <h3 className="text-lg font-medium text-text-primary">No pools found</h3>
                    <p className="text-text-secondary mt-1">Try adjusting your filters or check back later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPools.map((pool) => {
                        const metadata = getAssetMetadata(pool.assetSymbol);
                        const liquidity = Number(pool.totalDeposits);
                        const borrows = Number(pool.totalBorrows);
                        const utilization = liquidity > 0 ? (borrows / liquidity) * 100 : 0;

                        return (
                            <Card
                                key={pool.poolId}
                                variant="glass"
                                hoverEffect
                                className="relative overflow-hidden group flex flex-col h-full border-border/50 hover:border-primary/30"
                            >
                                {/* Gradient Overlay */}
                                <div className={cn(
                                    "absolute top-0 right-0 w-64 h-64 bg-gradient-to-br opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none",
                                    pool.type === 'permissioned' ? "from-warning to-transparent" : "from-primary to-transparent"
                                )} />

                                {/* Header */}
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center shadow-lg ring-2 ring-border/50 group-hover:ring-primary/50 transition-all bg-surface",
                                            metadata.color.split(" ")[0]
                                        )}>
                                            <AssetIcon icon={metadata.icon} symbol={metadata.symbol} className="w-full h-full p-2.5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-primary text-lg">{metadata.name}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono">
                                                    {pool.assetSymbol}
                                                </Badge>
                                                {pool.type === 'permissioned' && (
                                                    <Badge variant="warning" className="text-[10px] h-5 px-1.5">
                                                        Permissioned
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-text-secondary mb-1">Deposit APY</div>
                                        <div className="text-xl font-bold text-success font-mono">
                                            {(pool.supplyApy * 100).toFixed(2)}%
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="space-y-4 mb-6 relative z-10 flex-1">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm text-text-secondary">Total Liquidity</span>
                                        <span className="font-mono font-medium text-text-primary">
                                            {formatUsd(liquidity)}
                                        </span>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-text-tertiary">Utilization</span>
                                            <span className={cn(
                                                "font-mono",
                                                utilization > 80 ? "text-error" : "text-text-secondary"
                                            )}>
                                                {utilization.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-surface-highlight rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-500", utilization > 80 ? "bg-error" : "bg-primary")}
                                                style={{ width: `${Math.min(utilization, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-sm text-text-secondary">Borrow APR</span>
                                        <span className="font-mono font-medium text-warning">
                                            {(pool.borrowApy * 100).toFixed(2)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => {
                                            if (pool.type === "permissioned" && !isInstitutional) {
                                                // Show warning instead
                                                return;
                                            }
                                            setSelectedAsset({ symbol: pool.assetSymbol, mode: "deposit" });
                                        }}
                                        disabled={pool.type === "permissioned" && !isInstitutional}
                                    >
                                        Supply
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            if (pool.type === "permissioned" && !isInstitutional) {
                                                // Show warning instead
                                                return;
                                            }
                                            setSelectedAsset({ symbol: pool.assetSymbol, mode: "borrow" });
                                        }}
                                        disabled={pool.type === "permissioned" && !isInstitutional}
                                    >
                                        Borrow
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {selectedAsset && (
                <AssetActionSlideOver
                    isOpen={!!selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                    mode={selectedAsset.mode}
                    assetSymbol={selectedAsset.symbol}
                />
            )}
        </div>
    );
}
