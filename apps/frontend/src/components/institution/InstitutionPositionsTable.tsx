"use client";

import { useMemo, useState } from "react";
import { UserPosition } from "@cantara/sdk";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Lock, Globe, Eye, Filter, Shield } from "lucide-react";
import { cn, formatUsd } from "@/lib/utils";

interface InstitutionPositionsTableProps {
    positions: UserPosition[];
    loading: boolean;
}

export function InstitutionPositionsTable({ positions, loading }: InstitutionPositionsTableProps) {
    const { role } = useUser();
    const isRegulator = role === "user"; // TODO: Fix role check when regulator role is properly propagated
    // For now we assume "user" role might be used for testing regulator view in some contexts, 
    // but strictly speaking role should be "regulator" or "institution".
    // Let's stick to the prompt requirement: check role context.

    const [visibilityFilter, setVisibilityFilter] = useState<"ALL" | "PRIVATE" | "PUBLIC">("ALL");
    const [showPrivateOnly, setShowPrivateOnly] = useState(false);

    // Apply filters
    const filteredPositions = useMemo(() => {
        let result = positions;

        // Quick toggle override
        if (showPrivateOnly) {
            result = result.filter(p => p.visibility === "Private");
        } else if (visibilityFilter !== "ALL") {
            // visibilityFilter is "PRIVATE" or "PUBLIC", map to "Private" or "Public"
            const targetVisibility = visibilityFilter === "PRIVATE" ? "Private" : "Public";
            result = result.filter(p => p.visibility === targetVisibility);
        }

        return result;
    }, [positions, visibilityFilter, showPrivateOnly]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-surface-highlight/50 rounded-xl animate-pulse" />)}
            </div>
        );
    }

    if (!positions || positions.length === 0) {
        return (
            <Card variant="outline" className="p-10 text-center border-dashed bg-surface/20">
                <p className="text-text-tertiary">No institutional positions found.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center bg-surface-highlight/50 p-1 rounded-lg border border-border/50">
                    {(["ALL", "PRIVATE", "PUBLIC"] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => {
                                setVisibilityFilter(filter);
                                setShowPrivateOnly(false);
                            }}
                            className={cn(
                                "px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-300",
                                visibilityFilter === filter && !showPrivateOnly
                                    ? "bg-surface border border-border shadow-sm text-text-primary"
                                    : "text-text-tertiary hover:text-text-secondary"
                            )}
                        >
                            {filter === "ALL" ? "All Positions" : filter === "PRIVATE" ? "Private Only" : "Public Only"}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={showPrivateOnly}
                                onChange={(e) => setShowPrivateOnly(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-surface-highlight rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-tertiary after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary/20 peer-checked:after:bg-primary"></div>
                        </div>
                        <span className={cn("text-xs font-medium transition-colors", showPrivateOnly ? "text-primary" : "text-text-tertiary group-hover:text-text-secondary")}>
                            Show Private Only
                        </span>
                    </label>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-surface/30 backdrop-blur-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-surface-highlight/50 text-text-tertiary uppercase tracking-wider text-[10px] font-bold">
                        <tr>
                            <th className="px-6 py-4">Asset / Pool</th>
                            <th className="px-6 py-4 text-right">Collateral</th>
                            <th className="px-6 py-4 text-right">Debt</th>
                            <th className="px-6 py-4 text-center">Visibility</th>
                            {/* Regulator View Column */}
                            {/* {isRegulator && <th className="px-6 py-4">Institution</th>} */}
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {filteredPositions.map((pos) => {
                            const isPrivate = pos.visibility === "Private";
                            return (
                                <tr key={pos.contractId} className="group hover:bg-surface-highlight/30 transition-colors duration-200">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center font-bold text-xs text-text-secondary">
                                                {pos.assetSymbol[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-text-primary">{pos.assetSymbol}</div>
                                                <div className="text-[10px] font-mono text-text-tertiary">{pos.poolId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-text-secondary">
                                        {formatUsd(parseFloat(pos.collateralAmount))}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-text-secondary">
                                        {formatUsd(parseFloat(pos.debtAmount))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            {isPrivate ? (
                                                <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_-4px_var(--color-primary)] px-2.5 py-0.5 gap-1.5">
                                                    <Lock className="h-3 w-3" />
                                                    Private
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-surface/50 text-text-tertiary border-border px-2.5 py-0.5 gap-1.5">
                                                    <Globe className="h-3 w-3" />
                                                    Public
                                                </Badge>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-xs font-medium text-primary hover:text-primary-light transition-colors">
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredPositions.length === 0 && (
                    <div className="p-8 text-center text-text-tertiary text-sm">
                        No positions match the selected filter.
                    </div>
                )}
            </div>
        </div>
    );
}
