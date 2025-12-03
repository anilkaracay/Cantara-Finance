"use client";

import { useState } from "react";
import { usePermissionlessPools } from "@/hooks/usePools";
import { useOracles, usePortfolio } from "@/hooks/usePortfolio";
import { useUser } from "@/context/UserContext";
import { AssetActionSlideOver } from "./AssetActionSlideOver";
import { getAssetMetadata } from "@/utils/assetMetadata";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AssetIcon } from "@/components/ui/AssetIcon";
import { cn } from "@/lib/utils";

export function PortfolioOverview() {
    const { partyId } = useUser();
    const { data: portfolio, isLoading } = usePortfolio();
    const { data: pools } = usePermissionlessPools();
    const { data: oracles } = useOracles();
    const [selectedAction, setSelectedAction] = useState<{ mode: "withdraw" | "repay"; symbol: string } | null>(null);

    if (!partyId) {
        return (
            <Card variant="outline" className="p-8 text-center border-dashed">
                <p className="text-text-secondary">Set your Party ID in the sidebar to view your portfolio.</p>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-64 rounded-xl bg-surface-highlight/50 animate-pulse" />
                    <div className="h-64 rounded-xl bg-surface-highlight/50 animate-pulse" />
                </div>
            </div>
        );
    }

    if (!portfolio) {
        return <div className="text-sm text-text-tertiary">No portfolio found. Deposit assets to start.</div>;
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

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Deposits */}
                <Card variant="glass" className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-border/50 bg-surface/30">
                        <h3 className="font-semibold text-text-primary">My Deposits</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-surface-highlight/50 text-text-secondary">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Asset</th>
                                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {deposits.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-text-tertiary">No deposits</td>
                                    </tr>
                                ) : (
                                    deposits.map(([symbol, amount]) => {
                                        const metadata = getAssetMetadata(symbol);
                                        return (
                                            <tr key={symbol} className="hover:bg-surface-highlight/30 transition-colors">
                                                <td className="px-4 py-3 font-medium text-text-primary flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center overflow-hidden",
                                                        metadata.color.split(" ")[0]
                                                    )}>
                                                        <AssetIcon icon={metadata.icon} symbol={metadata.symbol} className="w-full h-full" />
                                                    </div>
                                                    <span>{metadata.name}</span>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-text-secondary text-right">{amount}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setSelectedAction({ mode: "withdraw", symbol })}
                                                        className="text-error hover:text-error hover:bg-error/10 h-8"
                                                    >
                                                        Withdraw
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Borrows */}
                <Card variant="glass" className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-border/50 bg-surface/30">
                        <h3 className="font-semibold text-text-primary">My Borrows</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-surface-highlight/50 text-text-secondary">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Asset</th>
                                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {borrows.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-text-tertiary">No borrows</td>
                                    </tr>
                                ) : (
                                    borrows.map(([symbol, amount]) => {
                                        const metadata = getAssetMetadata(symbol);
                                        return (
                                            <tr key={symbol} className="hover:bg-surface-highlight/30 transition-colors">
                                                <td className="px-4 py-3 font-medium text-text-primary flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center overflow-hidden",
                                                        metadata.color.split(" ")[0]
                                                    )}>
                                                        <AssetIcon icon={metadata.icon} symbol={metadata.symbol} className="w-full h-full" />
                                                    </div>
                                                    <span>{metadata.name}</span>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-text-secondary text-right">{amount}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setSelectedAction({ mode: "repay", symbol })}
                                                        className="text-primary hover:text-primary hover:bg-primary/10 h-8"
                                                    >
                                                        Repay
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
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
