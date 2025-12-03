"use client";

import { useUser } from "@/context/UserContext";
import { useInstitutions } from "@/hooks/permissioned/useInstitutions";
import { usePermissionedPools } from "@/hooks/permissioned/usePermissionedPools";
import { useInstitutionalCapital } from "@/hooks/permissioned/useInstitutionalCapital";
import { usePermissionedPositions } from "@/hooks/permissioned/usePermissionedPositions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatUsd, cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CapitalActionSlideOver } from "@/components/institution/CapitalActionSlideOver";
import { PrivacyModeToggle } from "@/components/institution/PrivacyModeToggle";
import { InstitutionPositionsTable } from "@/components/institution/InstitutionPositionsTable";
import { Building2, Shield, Wallet, Users, Lock, Activity, Globe } from "lucide-react";
import { InstitutionSelector } from "@/components/institution/InstitutionSelector";

export default function InstitutionDashboard() {
    const { role, institutionId, setInstitutionId, privacyMode, setPrivacyMode } = useUser();
    const router = useRouter();
    const { data: institutions } = useInstitutions();
    const { data: pools, loading: poolsLoading } = usePermissionedPools(institutionId);
    const { data: capital, isLoading: capitalLoading } = useInstitutionalCapital();
    const { data: positions, loading: positionsLoading } = usePermissionedPositions();

    const [selectedCapitalAction, setSelectedCapitalAction] = useState<{
        mode: "deposit" | "withdraw";
        contractId: string;
        assetSymbol: string;
        currentAmount: string;
    } | null>(null);

    useEffect(() => {
        if (role !== "institution" || institutionId) return;

        if (typeof window !== "undefined") {
            const stored = window.localStorage.getItem("cantara:institutionId_v1");
            if (stored) {
                setInstitutionId(stored);
                return;
            }
        }

        if (institutions && institutions.length > 0) {
            setInstitutionId(institutions[0].institution);
        }
    }, [role, institutionId, institutions, setInstitutionId]);

    if (role !== "institution") {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                <div className="p-6 rounded-full bg-surface-highlight border border-border shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 blur-xl" />
                    <Building2 className="h-12 w-12 text-primary relative z-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-text-primary">Institution Access Required</h2>
                    <p className="text-text-secondary max-w-md mx-auto">
                        Please switch to an Institution role and select an institution from the sidebar to view this dashboard.
                    </p>
                </div>
            </div>
        );
    }

    if (!institutionId) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                <div className="p-6 rounded-full bg-surface-highlight border border-border shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 blur-xl" />
                    <Building2 className="h-12 w-12 text-primary relative z-10" />
                </div>
                <div className="space-y-3 max-w-sm w-full px-4">
                    <h2 className="text-2xl font-bold text-text-primary">Select Institution</h2>
                    <p className="text-text-secondary">
                        Choose an institution to view its dashboard.
                    </p>
                    <div className="max-w-sm mx-auto">
                        <InstitutionSelector
                            institutions={institutions || []}
                            value={institutionId}
                            onChange={(id) => {
                                if (id) setInstitutionId(id);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    const currentInstitution = institutions?.find(i => i.institution === institutionId);

    // Calculate KPIs
    const totalAUM = pools?.reduce((acc, pool) => acc + parseFloat(pool.totalDeposits), 0) || 0;
    const totalBorrows = pools?.reduce((acc, pool) => acc + parseFloat(pool.totalBorrows), 0) || 0;
    const activePoolsCount = pools?.length || 0;
    const totalCapitalDeployed = capital?.reduce((acc, cap) => acc + parseFloat(cap.suppliedAmount), 0) || 0;

    // Calculate Private vs Public Net Worth (Approximation based on positions)
    // Note: This is a frontend approximation. Ideally backend provides this breakdown.
    const privatePositionsValue = positions?.filter(p => p.visibility === "Private")
        .reduce((acc, p) => acc + parseFloat(p.collateralAmount) - parseFloat(p.debtAmount), 0) || 0;

    const publicPositionsValue = positions?.filter(p => p.visibility !== "Private")
        .reduce((acc, p) => acc + parseFloat(p.collateralAmount) - parseFloat(p.debtAmount), 0) || 0;

    return (
        <div className="space-y-10 pb-20 relative">
            {/* Background Ambient Glow */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-surface-highlight to-surface border border-border shadow-lg">
                            <Globe className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary tracking-tight">
                                {currentInstitution?.name || institutionId}
                            </h1>
                                <div className="flex items-center gap-2 text-xs text-text-tertiary font-medium uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_5px_var(--color-success)]" />
                                    Institutional Console
                                </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <PrivacyModeToggle
                        value={privacyMode}
                        onChange={setPrivacyMode}
                    />
                </div>
            </div>

            {/* KPI Cards - Corporate Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <MetricCard
                    title="Total Assets Under Management"
                    value={poolsLoading ? "..." : formatUsd(totalAUM)}
                    icon={<Wallet className="h-5 w-5" />}
                    className="border-t-2 border-t-primary bg-gradient-to-b from-primary/5 to-transparent"
                />
                <MetricCard
                    title="Total Outstanding Borrows"
                    value={poolsLoading ? "..." : formatUsd(totalBorrows)}
                    icon={<Users className="h-5 w-5" />}
                    className="border-t-2 border-t-secondary bg-gradient-to-b from-secondary/5 to-transparent"
                />
                <MetricCard
                    title="Active Lending Pools"
                    value={poolsLoading ? "..." : activePoolsCount.toString()}
                    icon={<Building2 className="h-5 w-5" />}
                    className="border-t-2 border-t-success bg-gradient-to-b from-success/5 to-transparent"
                />
                <MetricCard
                    title="Capital Deployed"
                    value={capitalLoading ? "..." : formatUsd(totalCapitalDeployed)}
                    icon={<Shield className="h-5 w-5" />}
                    className="border-t-2 border-t-warning bg-gradient-to-b from-warning/5 to-transparent"
                />
            </div>

            {/* Risk Summary Breakdown (Visual Only for now) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="p-4 rounded-xl bg-surface/30 border border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Lock className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-xs text-text-tertiary uppercase font-bold">Private Net Worth</div>
                            <div className="text-lg font-mono font-bold text-text-primary">{formatUsd(privatePositionsValue)}</div>
                        </div>
                    </div>
                    <div className="text-xs text-text-tertiary">Visible only to you</div>
                </div>
                <div className="p-4 rounded-xl bg-surface/30 border border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-surface-highlight text-text-secondary">
                            <Globe className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-xs text-text-tertiary uppercase font-bold">Public Net Worth</div>
                            <div className="text-lg font-mono font-bold text-text-primary">{formatUsd(publicPositionsValue)}</div>
                        </div>
                    </div>
                    <div className="text-xs text-text-tertiary">Visible to network</div>
                </div>
            </div>

            {/* Institutional Positions */}
            <section className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
                            <Activity className="h-5 w-5" />
                        </div>
                        Institutional Positions
                    </h2>
                </div>
                <InstitutionPositionsTable positions={positions || []} loading={positionsLoading} />
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
                {/* Capital Management */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                <Shield className="h-5 w-5" />
                            </div>
                            Capital Management
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {capitalLoading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => <div key={i} className="h-28 bg-surface-highlight/50 rounded-2xl animate-pulse" />)}
                            </div>
                        ) : !capital || capital.length === 0 ? (
                            <Card variant="outline" className="p-10 text-center border-dashed bg-surface/20">
                                <p className="text-text-tertiary">No capital deployed yet.</p>
                            </Card>
                        ) : (
                            capital.map((cap) => (
                                <div
                                    key={cap.contractId}
                                    className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-surface-highlight to-surface p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                                >
                                    {/* Card Background Decoration */}
                                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-all duration-500 group-hover:bg-primary/10" />

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            {/* Asset Icon / Placeholder */}
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black/40 border border-border/50 shadow-inner font-bold text-xl text-text-primary">
                                                {cap.assetSymbol}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Available Capital</div>
                                                    {cap.visibility === "Private" ? (
                                                        <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20">
                                                            <Lock className="h-2 w-2 mr-1" /> Private
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-surface/50 text-text-tertiary">
                                                            <Globe className="h-2 w-2 mr-1" /> Public
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className={cn(
                                                    "text-2xl font-mono font-bold text-text-primary tracking-tight transition-all duration-300"
                                                )}>
                                                    {Number(cap.suppliedAmount).toLocaleString()}
                                                    <span className="text-sm text-text-tertiary ml-2 font-normal">{cap.assetSymbol}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 opacity-0 transform translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="w-24"
                                                onClick={() => setSelectedCapitalAction({
                                                    mode: "deposit",
                                                    contractId: cap.contractId,
                                                    assetSymbol: cap.assetSymbol,
                                                    currentAmount: cap.suppliedAmount
                                                })}
                                            >
                                                Deposit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-24"
                                                onClick={() => setSelectedCapitalAction({
                                                    mode: "withdraw",
                                                    contractId: cap.contractId,
                                                    assetSymbol: cap.assetSymbol,
                                                    currentAmount: cap.suppliedAmount
                                                })}
                                            >
                                                Withdraw
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Permissioned Pools List */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-text-primary flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-warning/10 text-warning">
                                <Lock className="h-5 w-5" />
                            </div>
                            Permissioned Pools
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {poolsLoading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => <div key={i} className="h-24 bg-surface-highlight/50 rounded-2xl animate-pulse" />)}
                            </div>
                        ) : pools && pools.length > 0 ? (
                            pools.map(pool => (
                                <div
                                    key={pool.poolId}
                                    className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-surface-highlight to-surface p-6 transition-all duration-300 hover:border-warning/30 hover:shadow-lg hover:shadow-warning/5"
                                >
                                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-warning/5 blur-3xl transition-all duration-500 group-hover:bg-warning/10" />

                                    <div className="relative z-10 flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-lg font-bold text-text-primary">{pool.assetSymbol} Pool</span>
                                                {pool.rwaReference ? (
                                                    <Badge variant="warning" className="shadow-[0_0_10px_-3px_var(--color-warning)] border-warning/30">
                                                        RWA: {pool.rwaReference}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-surface/50">Permissioned</Badge>
                                                )}
                                                {pool.visibility === "Private" ? (
                                                    <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                                                        <Lock className="h-3 w-3 mr-1" /> Private
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-surface/50 text-text-tertiary">
                                                        <Globe className="h-3 w-3 mr-1" /> Public
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-mono text-text-tertiary">
                                                <div className="flex items-center gap-1.5">
                                                    <Activity className="h-3 w-3" />
                                                    Base Rate: <span className="text-text-secondary">{(parseFloat(pool.baseRate) * 100).toFixed(2)}%</span>
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-text-tertiary/30" />
                                                <div className="flex items-center gap-1.5">
                                                    <Shield className="h-3 w-3" />
                                                    KYC Required
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-1">Net Liquidity</div>
                                            <div className={cn(
                                                "text-xl font-mono font-bold text-text-primary transition-all duration-300"
                                            )}>
                                                {formatUsd(parseFloat(pool.totalDeposits) - parseFloat(pool.totalBorrows))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Card variant="outline" className="p-10 text-center border-dashed bg-surface/20">
                                <p className="text-text-tertiary">No permissioned pools active.</p>
                            </Card>
                        )}
                    </div>
                </section>
            </div>

            {selectedCapitalAction && (
                <CapitalActionSlideOver
                    isOpen={!!selectedCapitalAction}
                    onClose={() => setSelectedCapitalAction(null)}
                    mode={selectedCapitalAction.mode}
                    contractId={selectedCapitalAction.contractId}
                    assetSymbol={selectedCapitalAction.assetSymbol}
                    currentAmount={selectedCapitalAction.currentAmount}
                />
            )}
        </div>
    );
}
