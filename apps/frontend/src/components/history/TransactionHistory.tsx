"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/Skeleton";

interface HistoryEntry {
    id: string;
    type: "DEPOSIT" | "WITHDRAW" | "BORROW" | "REPAY";
    asset: string;
    amount: string;
    timestamp: string;
    txId?: string;
}

export function TransactionHistory() {
    const { data: history, isLoading } = useQuery<HistoryEntry[]>({
        queryKey: ["history"],
        queryFn: async () => {
            return api.get<HistoryEntry[]>("/history");
        },
        refetchInterval: 10000, // Refresh every 10s
    });

    const [limit, setLimit] = useState(5);
    const displayedHistory = history?.slice(0, limit) || [];
    const hasMore = (history?.length || 0) > limit;

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Transaction History</h3>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                            <div className="flex gap-4">
                                <Skeleton className="w-12 h-4" />
                                <Skeleton className="w-8 h-4" />
                            </div>
                            <Skeleton className="w-24 h-4" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Transaction History</h3>
                <div className="p-8 text-center rounded-xl border border-dashed border-slate-800 text-slate-500">
                    No transactions yet
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Transaction History</h3>
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/20">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900/50 text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-medium">Type</th>
                            <th className="px-4 py-3 font-medium">Asset</th>
                            <th className="px-4 py-3 font-medium text-right">Amount</th>
                            <th className="px-4 py-3 font-medium text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {displayedHistory.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${entry.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-400' :
                                        entry.type === 'WITHDRAW' ? 'bg-red-500/10 text-red-400' :
                                            entry.type === 'BORROW' ? 'bg-purple-500/10 text-purple-400' :
                                                'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        {entry.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-white font-medium">{entry.asset}</td>
                                <td className="px-4 py-3 text-right font-mono text-slate-200">
                                    {Number(entry.amount).toFixed(4)}
                                </td>
                                <td className="px-4 py-3 text-right text-slate-500 text-xs">
                                    {new Date(entry.timestamp).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {hasMore && (
                    <div className="p-2 border-t border-slate-800 text-center">
                        <button
                            onClick={() => setLimit(prev => prev + 5)}
                            className="text-xs text-slate-400 hover:text-white transition-colors py-2 w-full"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
