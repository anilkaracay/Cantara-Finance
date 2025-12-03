"use client";

import { usePools } from "../hooks/usePools";
import PoolCard from "../components/PoolCard";
import { Loader2 } from "lucide-react";
import { PermissionedMarkets } from "@/components/dashboard/PermissionedMarkets";

export default function PoolsPage() {
    const { pools, isLoading } = usePools();

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Lending Pools</h1>
                <p className="mt-2 text-white/60">Explore available permissionless pools.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {pools?.map((pool) => (
                    <PoolCard key={pool.poolId} pool={pool} />
                ))}
                {pools?.length === 0 && (
                    <div className="col-span-full py-12 text-center text-white/40">
                        No pools found.
                    </div>
                )}
            </div>

            <div className="pt-8 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">Permissioned Markets</h2>
                <PermissionedMarkets mode="supply" />
            </div>
        </div>
    );
}
