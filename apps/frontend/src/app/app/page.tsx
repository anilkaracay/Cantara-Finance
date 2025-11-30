"use client";

import { usePools } from "./hooks/usePools";
import { usePositions } from "./hooks/usePositions";
import StatBadge from "./components/StatBadge";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { pools, isLoading: poolsLoading } = usePools();
    const { positions, isLoading: positionsLoading } = usePositions();

    if (poolsLoading || positionsLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const totalCollateral = positions?.reduce((acc, p) => acc + Number(p.collateralAmount), 0) || 0;
    const totalDebt = positions?.reduce((acc, p) => acc + Number(p.debtAmount), 0) || 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="mt-2 text-white/60">Welcome back to Cantara Finance.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <StatBadge label="Active Pools" value={pools?.length || 0} />
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <StatBadge label="Total Collateral" value={totalCollateral.toFixed(2)} />
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <StatBadge label="Total Debt" value={totalDebt.toFixed(2)} />
                </div>
            </div>
        </div>
    );
}
