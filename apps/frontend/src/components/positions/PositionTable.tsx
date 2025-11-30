"use client";

import { useState } from "react";
import { useUserPositions, Position } from "@/hooks/usePositions";
import { useUser } from "@/context/UserContext";
import { PositionActionsDialog } from "./PositionActionsDialog";

export function PositionTable() {
    const { partyId } = useUser();
    const { data: positions, isLoading } = useUserPositions();
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

    if (!partyId) {
        return (
            <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center">
                <p className="text-slate-400">Set your Party ID in the sidebar to view your positions.</p>
            </div>
        );
    }

    if (isLoading) {
        return <div className="text-sm text-slate-400">Loading positions...</div>;
    }

    if (!positions || positions.length === 0) {
        return <div className="text-sm text-slate-400">No positions found.</div>;
    }

    return (
        <>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900/50 text-slate-400">
                        <tr>
                            <th className="px-6 py-3 font-medium">Asset</th>
                            <th className="px-6 py-3 font-medium">Collateral</th>
                            <th className="px-6 py-3 font-medium">Debt</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/20">
                        {positions.map((pos) => (
                            <tr key={pos.contractId} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">
                                    {pos.assetSymbol}
                                    <div className="text-xs text-slate-500 font-normal font-mono mt-0.5">
                                        {pos.poolId}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-200">{pos.collateralAmount}</td>
                                <td className="px-6 py-4 font-mono text-slate-200">{pos.debtAmount}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedPosition(pos)}
                                        className="text-xs font-medium bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded border border-slate-700 transition-colors"
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedPosition && (
                <PositionActionsDialog
                    position={selectedPosition}
                    isOpen={!!selectedPosition}
                    onClose={() => setSelectedPosition(null)}
                />
            )}
        </>
    );
}
