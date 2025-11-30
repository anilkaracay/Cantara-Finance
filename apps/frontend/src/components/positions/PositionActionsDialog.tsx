"use client";

import { useState } from "react";
import { Position, useDeposit, useWithdraw, useBorrow, useRepay } from "@/hooks/usePositions";

interface PositionActionsDialogProps {
    position: Position;
    isOpen: boolean;
    onClose: () => void;
}

type ActionType = "deposit" | "withdraw" | "borrow" | "repay";

export function PositionActionsDialog({ position, isOpen, onClose }: PositionActionsDialogProps) {
    const [activeTab, setActiveTab] = useState<ActionType>("deposit");
    const [amount, setAmount] = useState("");
    const [price, setPrice] = useState("2000.0"); // Mock price for now

    const deposit = useDeposit();
    const withdraw = useWithdraw();
    const borrow = useBorrow();
    const repay = useRepay();

    if (!isOpen) return null;

    const isLoading = deposit.isPending || withdraw.isPending || borrow.isPending || repay.isPending;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;

        const options = {
            onSuccess: () => {
                setAmount("");
                onClose();
            },
        };

        switch (activeTab) {
            case "deposit":
                deposit.mutate({ contractId: position.contractId, amount }, options);
                break;
            case "withdraw":
                withdraw.mutate({ contractId: position.contractId, amount, price }, options);
                break;
            case "borrow":
                borrow.mutate({ contractId: position.contractId, amount, price }, options);
                break;
            case "repay":
                repay.mutate({ contractId: position.contractId, amount }, options);
                break;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="flex border-b border-slate-800">
                    {(["deposit", "withdraw", "borrow", "repay"] as ActionType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab
                                    ? "bg-slate-800 text-white border-b-2 border-emerald-500"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1 capitalize">
                            {activeTab} {position.assetSymbol}
                        </h3>
                        <p className="text-sm text-slate-400">
                            Contract: <span className="font-mono text-xs">{position.contractId.slice(0, 8)}...</span>
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-300">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                            required
                        />
                    </div>

                    {(activeTab === "withdraw" || activeTab === "borrow") && (
                        <div className="space-y-2">
                            <label className="text-sm text-slate-300">
                                Oracle Price <span className="text-xs text-amber-500">(Dev Only)</span>
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                            <p className="text-xs text-slate-500">
                                In production, this will be fetched from an Oracle.
                            </p>
                        </div>
                    )}

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Processing..." : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
