"use client";

import { MarketList } from "../../../components/dashboard/MarketList";
import { PortfolioOverview } from "../../../components/positions/PortfolioOverview";
import { MetricCard } from "../../../components/dashboard/MetricCard";
import { TransactionHistory } from "../../../components/history/TransactionHistory";
import { useRiskSummary } from "../../../hooks/useRiskSummary";
import { useWallet, useOracles } from "../../../hooks/usePortfolio";
import { formatUsd, cn } from "../../../lib/utils";
import { Activity, Wallet, TrendingUp, AlertTriangle, Coins } from "lucide-react";
import { getAssetMetadata } from "../../../utils/assetMetadata";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { Card } from "../../../components/ui/Card";
import { AssetIcon } from "../../../components/ui/AssetIcon";

export default function DashboardPage() {
    const { data, loading } = useRiskSummary();
    const { data: wallet, isLoading: walletLoading } = useWallet();
    const { data: oracles } = useOracles();

    const netWorth = data?.netWorthUsd ?? 0;
    const netApy = data?.netApyPercent ?? 0;
    const hf = data?.healthFactor;

    // Calculate total wallet value
    const totalWalletValue = (wallet || []).reduce((acc, holding) => {
        const oracle = oracles?.find(o => o.symbol === holding.symbol);
        const price = Number(oracle?.price || 0);
        return acc + (Number(holding.amount) * price);
    }, 0);

    let hfDisplay = "∞";
    let hfTrend: 'up' | 'down' | 'neutral' = 'neutral';

    if (hf !== undefined && hf !== null && Number.isFinite(hf)) {
        const value = Number(hf);
        hfDisplay = value.toFixed(2);
        if (value < 1.1) hfTrend = 'down';
        else if (value > 2) hfTrend = 'up';
    }

    const totalCapacity = data?.borrowCapacityUsd ?? 0;
    const used = data?.totalBorrowUsd ?? 0;
    const usedPct = totalCapacity > 0 ? (used / totalCapacity) * 100 : 0;

    return (
        <div className="space-y-10 pb-20">
            {/* Wallet Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                        <Coins className="h-6 w-6 text-primary" />
                        My Wallet
                    </h2>
                    <span className="text-lg font-bold text-text-primary">
                        {walletLoading ? "..." : formatUsd(totalWalletValue)}
                    </span>
                </div>
                {walletLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-24 rounded-xl bg-surface-highlight/50 animate-pulse" />
                        ))}
                    </div>
                ) : wallet && wallet.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {wallet.map((holding) => {
                            const metadata = getAssetMetadata(holding.symbol);
                            const oracle = oracles?.find(o => o.symbol === holding.symbol);
                            const price = Number(oracle?.price || 0);
                            const value = Number(holding.amount) * price;
                            return (
                                <Card key={holding.contractId} className="p-4 hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <AssetIcon symbol={holding.symbol} icon={metadata.icon} size="md" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-bold text-text-primary truncate">{holding.symbol}</span>
                                            <span className="text-xs text-text-secondary truncate">
                                                {Number(holding.amount).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-right">
                                        <span className="text-sm font-mono text-text-primary">{formatUsd(value)}</span>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="p-8 text-center">
                        <Wallet className="h-12 w-12 mx-auto text-text-tertiary mb-4" />
                        <p className="text-text-secondary">No assets in wallet</p>
                    </Card>
                )}
            </section>

            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-text-primary tracking-tight">Dashboard</h1>
                <p className="text-text-secondary">Overview of your DeFi portfolio and risk metrics.</p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Net Worth"
                    value={loading ? "..." : formatUsd(netWorth)}
                    icon={<Wallet className="h-5 w-5" />}
                    loading={loading}
                    tooltip="Total value of your deposits minus borrows"
                />
                <MetricCard
                    title="Net APY"
                    value={loading ? "..." : `${netApy.toFixed(2)}%`}
                    trend={netApy > 0 ? 'up' : 'neutral'}
                    trendValue={netApy > 0 ? "Earning" : ""}
                    icon={<TrendingUp className="h-5 w-5" />}
                    loading={loading}
                    tooltip="Weighted average APY of your portfolio"
                />
                <MetricCard
                    title="Health Factor"
                    value={loading ? "..." : hfDisplay}
                    trend={hfTrend}
                    trendValue={hfTrend === 'down' ? "Risk High" : "Healthy"}
                    icon={<Activity className="h-5 w-5" />}
                    loading={loading}
                    className={hfTrend === 'down' ? "border-error/50 bg-error/5" : ""}
                    tooltip="Safety score of your positions. Keep above 1.0 to avoid liquidation."
                />
                <MetricCard
                    title="Borrow Capacity"
                    value={loading ? "..." : `${usedPct.toFixed(1)}%`}
                    subValue={`of ${formatUsd(totalCapacity)}`}
                    icon={<AlertTriangle className="h-5 w-5" />}
                    loading={loading}
                    tooltip="Percentage of your collateral used for borrowing"
                    footer={
                        <ProgressBar
                            value={usedPct}
                            variant={usedPct > 80 ? 'error' : usedPct > 50 ? 'warning' : 'success'}
                            className="h-2"
                        />
                    }
                />
            </div>

            {/* Markets Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_10px_var(--color-success)]" />
                            Supply Markets
                        </h2>
                    </div>
                    <MarketList mode="supply" />
                </section>

                <section className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-warning shadow-[0_0_10px_var(--color-warning)]" />
                            Borrow Markets
                        </h2>
                    </div>
                    <MarketList mode="borrow" />
                </section>
            </div>

            {/* Portfolio Section */}
            <section className="space-y-6 pt-8 border-t border-border/30">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text-primary">My Portfolio</h2>
                </div>
                <PortfolioOverview />
            </section>

            {/* History Section */}
            <section className="space-y-6 pt-8 border-t border-border/30">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text-primary">Transaction History</h2>
                </div>
                <TransactionHistory />
            </section>
        </div>
    );
}
