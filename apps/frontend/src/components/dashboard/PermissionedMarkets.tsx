"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissionedPools, Pool } from "@/hooks/usePools";
import { AssetActionSlideOver } from "@/components/positions/AssetActionSlideOver";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AssetIcon } from "@/components/ui/AssetIcon";
import { Sparkline } from "@/components/ui/Sparkline";
import { getAssetMetadata } from "@/utils/assetMetadata";
import { cn } from "@/lib/utils";
import { Lock, ShieldCheck } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { InstitutionGuardModal } from "@/components/auth/InstitutionGuardModal";

interface MarketListProps {
    mode: "supply" | "borrow";
    privacyOverride?: "Public" | "Private";
}

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

function PermissionedPoolCard({ pool, mode, onClick }: { pool: Pool, mode: "supply" | "borrow", onClick: () => void }) {
    const metadata = getAssetMetadata(pool.assetSymbol);
    const { supplyApy, borrowApy } = deriveRates(pool);
    const apy = mode === "supply" ? supplyApy : borrowApy;
    const liquidity = mode === "supply"
        ? Number(pool.totalDeposits)
        : Number(pool.totalDeposits) - Number(pool.totalBorrows);

    const sparklineData = generateSparklineData(pool.assetSymbol + mode);

    return (
        <Card
            variant="glass"
            hoverEffect
            className="p-4 flex items-center justify-between group cursor-pointer border-border/50 hover:border-primary/30 relative overflow-hidden"
            onClick={onClick}
        >
            {/* Permissioned Badge */}
            <div className={cn(
                "absolute top-0 right-0 text-[10px] px-2 py-0.5 rounded-bl-lg flex items-center gap-1",
                pool.visibility === "Private"
                    ? "bg-primary/30 text-primary"
                    : "bg-primary/20 text-primary"
            )}>
                {pool.visibility === "Private" ? <Lock size={10} /> : <ShieldCheck size={10} />}
                {pool.visibility === "Private" ? "Private" : "Permissioned"}
            </div>

            <div className="flex items-center gap-4 min-w-[180px]">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-xl overflow-hidden shadow-lg ring-2 ring-border/50 group-hover:ring-primary/50 transition-all",
                    metadata.color.split(" ")[0]
                )}>
                    <AssetIcon icon={metadata.icon} symbol={metadata.symbol} className="w-full h-full p-2" />
                </div>
                <div>
                    <h3 className="font-bold text-text-primary text-lg group-hover:text-primary transition-colors">{metadata.name}</h3>
                    <div className="text-xs text-text-tertiary font-mono flex items-center gap-1">
                        {pool.assetSymbol}
                        <span className="w-1 h-1 rounded-full bg-text-tertiary/50" />
                        {pool.category || "Crypto"}
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
}

function deriveRates(pool: Pool) {
    const totalDeposits = Number(pool.totalDeposits);
    const totalBorrows = Number(pool.totalBorrows);
    const baseRate = Number(pool.baseRate);
    const slope1 = Number(pool.slope1);
    const slope2 = Number(pool.slope2);
    const kink = Number(pool.kinkUtilization);

    const utilization = totalDeposits > 0 ? totalBorrows / totalDeposits : 0;
    let borrowRate = baseRate;
    if (utilization <= kink) {
        borrowRate += utilization * slope1;
    } else {
        borrowRate += kink * slope1 + (utilization - kink) * slope2;
    }
    const supplyRate = borrowRate * utilization;
    return { utilization, borrowApy: borrowRate, supplyApy: supplyRate };
}

export function PermissionedMarkets({ mode, privacyOverride }: MarketListProps) {
    const router = useRouter();
    const { data, loading, error } = usePermissionedPools({ privacyOverride });
    const { isInstitution } = useRole();
    const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);

    const handlePoolClick = (pool: Pool) => {
        if (!isInstitution) {
            setShowRestrictionModal(true);
            return;
        }
        setSelectedPool(pool);
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <div key={i} className="h-20 rounded-2xl bg-surface-highlight/50 animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        // Assume 403 means not an institution
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl bg-surface-base/30">
                <Lock className="w-8 h-8 text-text-tertiary mb-2" />
                <h3 className="text-text-secondary font-medium">Institutional Access Only</h3>
                <p className="text-sm text-text-tertiary text-center mt-1">
                    These markets are restricted to KYC-verified institutions.
                </p>
            </div>
        );
    }

    if (!data || (data.crypto.length === 0 && data.securities.length === 0)) {
        return <div className="text-sm text-text-tertiary p-4 text-center border border-dashed border-border rounded-xl">No permissioned markets available.</div>;
    }

    return (
        <div className="space-y-8">
            {/* Crypto Section */}
            {data.crypto.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Permissioned Crypto
                    </h3>
                    <div className="space-y-3">
                        {data.crypto.map((pool) => (
                            <PermissionedPoolCard
                                key={pool.poolId}
                                pool={pool}
                                mode={mode}
                                onClick={() => handlePoolClick(pool)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Securities Section */}
            {data.securities.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        Permissioned Securities (RWA)
                    </h3>
                    <div className="space-y-3">
                        {data.securities.map((pool) => (
                            <PermissionedPoolCard
                                key={pool.poolId}
                                pool={pool}
                                mode={mode}
                                onClick={() => handlePoolClick(pool)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {selectedPool && (
                <AssetActionSlideOver
                    isOpen={!!selectedPool}
                    onClose={() => setSelectedPool(null)}
                    mode={mode === "supply" ? "deposit" : "borrow"}
                    assetSymbol={selectedPool.assetSymbol}
                    pool={selectedPool}
                />
            )}
            <InstitutionGuardModal
                open={showRestrictionModal}
                onClose={() => setShowRestrictionModal(false)}
                onRedirect={() => router.push("/auth?tab=institution")}
            />
        </div>
    );
}
