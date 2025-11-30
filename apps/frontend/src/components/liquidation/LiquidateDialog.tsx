"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useUser } from "@/context/UserContext";
import { useOracles } from "@/hooks/usePortfolio";

interface LiquidateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    position: {
        user: string;
        portfolioContractId: string;
        healthFactor: number;
        totalCollateralValue: number;
        totalDebtValue: number;
        deposits: [string, string][];
        borrows: [string, string][];
    };
}

export function LiquidateDialog({ isOpen, onClose, position }: LiquidateDialogProps) {
    const { partyId } = useUser();
    const { data: oracles } = useOracles();
    const queryClient = useQueryClient();

    const [selectedCollateralAsset, setSelectedCollateralAsset] = useState<string>("");
    const [selectedDebtAsset, setSelectedDebtAsset] = useState<string>("");
    const [repayAmount, setRepayAmount] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    // Set defaults when dialog opens
    if (isOpen && !selectedCollateralAsset && position.deposits.length > 0) {
        setSelectedCollateralAsset(position.deposits[0][0]);
    }
    if (isOpen && !selectedDebtAsset && position.borrows.length > 0) {
        setSelectedDebtAsset(position.borrows[0][0]);
    }

    const liquidateMutation = useMutation({
        mutationFn: async (data: {
            targetUser: string;
            collateralAsset: string;
            debtAsset: string;
            repayAmount: number;
        }) => {
            return api.post("/liquidation/execute", data, partyId ?? undefined);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["liquidation", "positions"] });
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            onClose();
            setRepayAmount("");
            setError(null);
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || err.message || "Liquidation failed";
            setError(msg);
        },
    });

    if (!isOpen) return null;

    // Calculate profit
    const getPrice = (symbol: string) => {
        const oracle = oracles?.find(o => o.symbol === symbol);
        return oracle ? parseFloat(oracle.price) : 0;
    };

    const repayValue = parseFloat(repayAmount || "0") * getPrice(selectedDebtAsset);
    const seizeAmount = (repayValue * 1.05) / getPrice(selectedCollateralAsset); // 5% bonus
    const seizeValue = seizeAmount * getPrice(selectedCollateralAsset);
    const profit = seizeValue - repayValue;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!partyId) {
            setError("Please set your party ID first");
            return;
        }

        const amount = parseFloat(repayAmount);
        if (!amount || amount <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        if (!selectedCollateralAsset || !selectedDebtAsset) {
            setError("Please select collateral and debt assets");
            return;
        }

        liquidateMutation.mutate({
            targetUser: position.user,
            collateralAsset: selectedCollateralAsset,
            debtAsset: selectedDebtAsset,
            repayAmount: amount,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-white">Liquidate Position</h2>
                    <p className="text-sm text-slate-400 mt-1">
                        User: {position.user.slice(0, 20)}... (HF: {position.healthFactor.toFixed(3)})
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Collateral Asset Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Collateral to Seize
                        </label>
                        <select
                            value={selectedCollateralAsset}
                            onChange={(e) => setSelectedCollateralAsset(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        >
                            {position.deposits.map(([symbol, amount]) => (
                                <option key={symbol} value={symbol}>
                                    {symbol} (Available: {parseFloat(amount).toFixed(4)})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Debt Asset Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Debt to Repay
                        </label>
                        <select
                            value={selectedDebtAsset}
                            onChange={(e) => setSelectedDebtAsset(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        >
                            {position.borrows.map(([symbol, amount]) => (
                                <option key={symbol} value={symbol}>
                                    {symbol} (Debt: {parseFloat(amount).toFixed(4)})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Repay Amount */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Amount to Repay
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.0001"
                                value={repayAmount}
                                onChange={(e) => setRepayAmount(e.target.value)}
                                placeholder="0.0000"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                            <span className="absolute right-4 top-3 text-slate-400">{selectedDebtAsset}</span>
                        </div>
                        {selectedDebtAsset && (
                            <p className="text-xs text-slate-500 mt-1">
                                Value: ${repayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        )}
                    </div>

                    {/* Profit Preview */}
                    {parseFloat(repayAmount || "0") > 0 && (
                        <div className="bg-slate-800/50 rounded-lg p-4 space-y-3 border border-slate-700">
                            <h3 className="font-semibold text-white">Liquidation Preview</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-slate-400">You Pay:</div>
                                    <div className="text-white font-medium">
                                        {parseFloat(repayAmount).toFixed(4)} {selectedDebtAsset}
                                    </div>
                                    <div className="text-slate-500 text-xs">
                                        ${repayValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-400">You Receive:</div>
                                    <div className="text-white font-medium">
                                        {seizeAmount.toFixed(4)} {selectedCollateralAsset}
                                    </div>
                                    <div className="text-slate-500 text-xs">
                                        ${seizeValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-slate-700">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Your Profit (5% bonus):</span>
                                    <span className="text-emerald-400 font-bold text-lg">
                                        ${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={liquidateMutation.isPending || !repayAmount}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {liquidateMutation.isPending ? "Liquidating..." : "Execute Liquidation"}
                        </button>
                    </div>

                    <p className="text-xs text-slate-500 text-center">
                        ⚠️ Note: You must have sufficient {selectedDebtAsset} in your wallet and liquidation rights for this user.
                    </p>
                </form>
            </div>
        </div>
    );
}
