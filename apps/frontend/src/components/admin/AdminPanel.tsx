"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useOracles } from "@/hooks/usePortfolio";
import { Skeleton } from "@/components/ui/Skeleton";

export function AdminPanel() {
    const { data: oracles, isLoading } = useOracles();
    const queryClient = useQueryClient();
    const [prices, setPrices] = useState<Record<string, string>>({});
    const [updating, setUpdating] = useState<string | null>(null);

    const updatePrice = useMutation({
        mutationFn: async (params: { symbol: string; price: string }) => {
            return api.post("/admin/oracle/update", params);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["oracles"] });
            queryClient.invalidateQueries({ queryKey: ["portfolio"] }); // Health factor changes
            setUpdating(null);
        },
        onError: () => {
            setUpdating(null);
            alert("Failed to update price");
        }
    });

    const handleUpdate = (symbol: string) => {
        const price = prices[symbol];
        if (!price) return;
        setUpdating(symbol);
        updatePrice.mutate({ symbol, price });
    };

    if (isLoading) {
        return <Skeleton className="w-full h-48 rounded-xl" />;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="text-red-500">⚠️</span> Admin Price Control
                </h3>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    Demo Mode
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {oracles?.map((oracle: any) => (
                    <div key={oracle.contractId || oracle.symbol} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-white">{oracle.payload?.symbol || oracle.symbol}</span>
                            <span className="text-sm text-slate-400">
                                Current: ${Number(oracle.payload?.price || oracle.price).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="New Price"
                                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                value={prices[oracle.payload?.symbol || oracle.symbol] || ""}
                                onChange={(e) => setPrices({ ...prices, [oracle.payload?.symbol || oracle.symbol]: e.target.value })}
                            />
                            <button
                                onClick={() => handleUpdate(oracle.payload?.symbol || oracle.symbol)}
                                disabled={updating === (oracle.payload?.symbol || oracle.symbol) || !prices[oracle.payload?.symbol || oracle.symbol]}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                            >
                                {updating === (oracle.payload?.symbol || oracle.symbol) ? "..." : "Set"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-slate-500">
                Use this panel to simulate market crashes. Lowering the price of your collateral (e.g. ETH) will reduce your Health Factor and potentially trigger liquidation.
            </p>
        </div>
    );
}
