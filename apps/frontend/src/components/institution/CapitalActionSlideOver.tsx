"use client";

import { useState } from "react";
import { useInstitutionalCapital } from "@/hooks/permissioned/useInstitutionalCapital";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface CapitalActionSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "deposit" | "withdraw";
    contractId: string;
    assetSymbol: string;
    currentAmount: string;
}

export function CapitalActionSlideOver({
    isOpen,
    onClose,
    mode,
    contractId,
    assetSymbol,
    currentAmount
}: CapitalActionSlideOverProps) {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { deposit, withdraw } = useInstitutionalCapital();

    if (!isOpen) return null;

    const isLoading = deposit.isPending || withdraw.isPending;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!amount) return;

        const val = Number(amount);
        if (val <= 0) {
            setError("Amount must be greater than 0");
            return;
        }

        if (mode === "withdraw" && val > Number(currentAmount)) {
            setError(`Amount exceeds available capital (${currentAmount})`);
            return;
        }

        const options = {
            onSuccess: () => {
                setAmount("");
                setError(null);
                onClose();
            },
            onError: (err: any) => {
                console.error("Transaction error:", err);
                let errorMessage = "Transaction failed";
                if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
            }
        };

        if (mode === "deposit") {
            deposit.mutate({ contractId, amount }, options);
        } else {
            withdraw.mutate({ contractId, amount }, options);
        }
    };

    return (
        <SlideOver
            isOpen={isOpen}
            onClose={onClose}
            title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Capital - ${assetSymbol}`}
            className="w-full max-w-md"
        >
            <div className="space-y-6">
                <Card variant="glass" className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-text-secondary">Asset</span>
                        <span className="font-semibold text-text-primary">{assetSymbol}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                        <span className="text-sm text-text-secondary">Current Capital</span>
                        <span className="font-mono text-text-primary">
                            {Number(currentAmount).toLocaleString()}
                        </span>
                    </div>
                </Card>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Amount</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError(null);
                                }}
                                placeholder="0.00"
                                className="w-full bg-surface-highlight border border-border rounded-lg pl-4 pr-4 py-3 text-text-primary focus:outline-none focus:border-primary/50 transition-colors placeholder:text-text-tertiary"
                                required
                                min="0"
                                step="any"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                            className="flex-1 capitalize"
                        >
                            {mode}
                        </Button>
                    </div>
                </form>
            </div>
        </SlideOver>
    );
}
