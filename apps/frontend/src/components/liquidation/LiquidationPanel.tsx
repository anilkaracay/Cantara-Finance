"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { useUser } from "@/context/UserContext";

interface HealthResponse {
    healthFactor: number;
    isLiquidatable: boolean;
    portfolio: {
        deposits: [string, string][];
        borrows: [string, string][];
    } | null;
}

export function LiquidationPanel() {
    const { partyId } = useUser();

    const { data: health, isLoading } = useQuery<HealthResponse>({
        queryKey: ["liquidation", "health"],
        queryFn: async () => {
            return api.get("/liquidation/health", partyId ?? undefined);
        },
        refetchInterval: 5000, // Refresh every 5 seconds
        enabled: !!partyId,
    });

    if (isLoading) {
        return <Skeleton className="w-full h-32 rounded-xl" />;
    }

    if (!health || !health.portfolio) {
        return null;
    }

    const getHealthColor = (hf: number) => {
        if (hf >= 2.0) return "text-green-400";
        if (hf >= 1.5) return "text-yellow-400";
        if (hf >= 1.0) return "text-orange-400";
        return "text-red-400";
    };

    const getHealthLabel = (hf: number) => {
        if (hf >= 2.0) return "Healthy";
        if (hf >= 1.5) return "Safe";
        if (hf >= 1.0) return "At Risk";
        return "LIQUIDATABLE";
    };

    const healthFactor = health.healthFactor > 1000 ? "∞" : health.healthFactor.toFixed(2);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Liquidation Risk</h3>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm text-slate-400">Health Factor</p>
                        <p className={`text-3xl font-bold ${getHealthColor(health.healthFactor)}`}>
                            {healthFactor}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${health.isLiquidatable
                        ? "bg-red-500/20 text-red-400 border border-red-500/50"
                        : "bg-green-500/20 text-green-400 border border-green-500/50"
                        }`}>
                        {getHealthLabel(health.healthFactor)}
                    </div>
                </div>

                {health.isLiquidatable && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                        <div className="flex items-start gap-2">
                            <span className="text-red-500 text-xl">⚠️</span>
                            <div>
                                <p className="text-red-400 font-semibold">Warning: Your position can be liquidated!</p>
                                <p className="text-sm text-slate-400 mt-1">
                                    Your health factor has dropped below 1.0. Liquidators can now seize your collateral.
                                    Repay some debt or add more collateral to avoid liquidation.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-400 mb-2">Info</p>
                        <ul className="text-xs text-slate-500 space-y-1">
                            <li>• HF ≥ 2.0: Very healthy</li>
                            <li>• HF ≥ 1.5: Safe range</li>
                            <li>• HF ≥ 1.0: At risk</li>
                            <li>• HF &lt; 1.0: Liquidatable</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-slate-400 mb-2">Protection</p>
                        <ul className="text-xs text-slate-500 space-y-1">
                            <li>• Keep HF above 1.5</li>
                            <li>• Monitor price changes</li>
                            <li>• Repay debt when risky</li>
                            <li>• Add collateral if needed</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
