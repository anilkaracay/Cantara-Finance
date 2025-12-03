"use client";

import { useState } from "react";
import { usePortfolio, useOracles } from "@/hooks/usePortfolio";
import { useUser } from "@/context/UserContext";
import { AssetActionSlideOver } from "@/components/positions/AssetActionSlideOver";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { AssetIcon } from "@/components/ui/AssetIcon";
import { Sparkline } from "@/components/ui/Sparkline";
import { getAssetMetadata } from "@/utils/assetMetadata";
import { cn, formatUsd } from "@/lib/utils";
import { Wallet, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownLeft } from "lucide-react";

// Deterministic pseudo-random data generator for sparklines
const generateSparklineData = (seed: string) => {
    const data = [];
    let val = 50;
    for (let i = 0; i < 20; i++) {
        const change = (seed.charCodeAt(i % seed.length) % 10) - 4;
        val = Math.max(10, Math.min(90, val + change));
        data.push(val);
    }
    return data;
};

export default function PositionsPage() {
    const { partyId } = useUser();
    const { data: portfolio, isLoading } = usePortfolio();
    const { data: oracles } = useOracles();
    const [activeTab, setActiveTab] = useState("deposits");
    const [selectedAction, setSelectedAction] = useState<{ mode: "deposit" | "withdraw" | "borrow" | "repay"; symbol: string } | null>(null);

    if (!partyId) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                <div className="p-6 rounded-full bg-surface-highlight border border-border shadow-2xl">
                    <Wallet className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-text-primary">Connect Wallet</h2>
                    <p className="text-text-secondary max-w-md mx-auto">
                        Please set your Party ID in the sidebar to view and manage your positions.
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="h-32 rounded-2xl bg-surface-highlight/50 animate-pulse" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-2xl bg-surface-highlight/50 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    // Parse Portfolio Data
    const parseMap = (data: any): [string, string][] => {
        if (!data) return [];
        if (Array.isArray(data)) return data as [string, string][];
        return Object.entries(data);
    };

    const deposits = parseMap(portfolio?.deposits).filter(([_, amount]) => Number(amount) > 0);
    const borrows = parseMap(portfolio?.borrows).filter(([_, amount]) => Number(amount) > 0);

    const positions = activeTab === "deposits" ? deposits : borrows;

    // Calculate Total Value
    const totalValue = positions.reduce((acc, [symbol, amount]) => {
        const oracle = oracles?.find(o => o.symbol === symbol);
        const price = Number(oracle?.price || 0);
        return acc + (Number(amount) * price);
    }, 0);

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">My Positions</h1>
                    <p className="text-text-secondary mt-1">Manage your supplied assets and borrowed positions.</p>
                </div>
                <Tabs
                    tabs={[
                        { id: "deposits", label: `Deposits (${deposits.length})` },
                        { id: "borrows", label: `Borrows (${borrows.length})` }
                    ]}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    className="w-full md:w-auto min-w-[300px]"
                />
            </div>

            {/* Portfolio Summary Card */}
            <Card variant="gradient" className="p-8 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="text-sm text-text-secondary mb-2 font-medium uppercase tracking-wider">
                        Total {activeTab === "deposits" ? "Supplied" : "Borrowed"} Value
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight flex items-baseline gap-2">
                        {formatUsd(totalValue)}
                        <span className="text-lg font-medium text-success flex items-center gap-1">
                            <ArrowUpRight className="h-4 w-4" /> +2.4%
                        </span>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            </Card>

            {/* Positions List */}
            <div className="space-y-4">
                {positions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl bg-surface/30">
                        <div className="p-4 rounded-full bg-surface-highlight mb-4">
                            {activeTab === "deposits" ? (
                                <Wallet className="h-8 w-8 text-text-tertiary" />
                            ) : (
                                <AlertTriangle className="h-8 w-8 text-text-tertiary" />
                            )}
                        </div>
                        <h3 className="text-lg font-medium text-text-primary">No {activeTab} found</h3>
                        <p className="text-text-secondary mt-1 max-w-sm">
                            {activeTab === "deposits"
                                ? "Supply assets from the Pools page to start earning interest."
                                : "You haven't borrowed any assets yet. Visit the Pools page to borrow."}
                        </p>
                    </div>
                ) : (
                    positions.map(([symbol, amount]) => {
                        const metadata = getAssetMetadata(symbol);
                        const oracle = oracles?.find(o => o.symbol === symbol);
                        const price = Number(oracle?.price || 0);
                        const value = Number(amount) * price;
                        const sparklineData = generateSparklineData(symbol + activeTab);

                        return (
                            <Card
                                key={symbol}
                                variant="glass"
                                hoverEffect
                                className="p-5 flex flex-col md:flex-row items-center justify-between gap-6 group border-border/50 hover:border-primary/30 transition-all"
                            >
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center shadow-lg ring-2 ring-border/50 group-hover:ring-primary/50 transition-all bg-surface",
                                        metadata.color.split(" ")[0]
                                    )}>
                                        <AssetIcon icon={metadata.icon} symbol={metadata.symbol} className="w-full h-full p-2.5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-primary text-lg">{metadata.name}</h3>
                                        <div className="text-xs text-text-tertiary font-mono">{symbol}</div>
                                    </div>
                                </div>

                                {/* Sparkline - Hidden on small screens */}
                                <div className="hidden lg:block w-32 h-10 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <Sparkline data={sparklineData} width={120} height={40} />
                                </div>

                                <div className="flex items-center justify-between w-full md:w-auto gap-8 md:gap-12">
                                    <div className="text-right">
                                        <div className="text-xs text-text-secondary mb-1">Balance</div>
                                        <div className="font-mono text-lg font-medium text-text-primary">
                                            {Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs text-text-secondary mb-1">Value</div>
                                        <div className="font-mono text-lg font-bold text-text-primary">
                                            {formatUsd(value)}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {activeTab === "deposits" ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => setSelectedAction({ mode: "deposit", symbol })}
                                                >
                                                    Deposit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setSelectedAction({ mode: "withdraw", symbol })}
                                                    className="text-error border-error/20 hover:bg-error/10 hover:border-error/50"
                                                >
                                                    Withdraw
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => setSelectedAction({ mode: "borrow", symbol })}
                                                >
                                                    Borrow
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => setSelectedAction({ mode: "repay", symbol })}
                                                >
                                                    Repay
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>

            {selectedAction && (
                <AssetActionSlideOver
                    isOpen={!!selectedAction}
                    onClose={() => setSelectedAction(null)}
                    mode={selectedAction.mode}
                    assetSymbol={selectedAction.symbol}
                />
            )}
        </div>
    );
}
