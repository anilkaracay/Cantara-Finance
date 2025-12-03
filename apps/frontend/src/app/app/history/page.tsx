"use client";

import { useHistory } from "@/hooks/useHistory";
import { Loader2 } from "lucide-react";

export default function HistoryPage() {
    const { data: history, isLoading } = useHistory();

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
                <h1 className="text-3xl font-bold text-white">Transaction History</h1>
                <p className="mt-2 text-white/60">View your past actions on the protocol.</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-left text-sm text-white/80">
                    <thead className="bg-white/10 text-white font-semibold">
                        <tr>
                            <th className="p-4">Action</th>
                            <th className="p-4">Asset</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Time</th>
                            <th className="p-4">Tx ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {history?.map((item) => (
                            <tr key={item.contractId} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white">{item.actionType}</td>
                                <td className="p-4">{item.assetSymbol}</td>
                                <td className="p-4 font-mono">{Number(item.amount).toFixed(4)}</td>
                                <td className="p-4 text-white/60">
                                    {new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    }).format(new Date(item.timestamp))}
                                </td>
                                <td className="p-4 font-mono text-xs text-white/40 truncate max-w-[100px]">
                                    {item.contractId}
                                </td>
                            </tr>
                        ))}
                        {history?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-white/40">
                                    No history found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
