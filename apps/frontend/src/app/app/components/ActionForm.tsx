"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "../hooks/useAction";
import { Loader2 } from "lucide-react";

interface ActionFormProps {
    title: string;
    submitText: string;
    onSubmit: (amount: string, price: string) => Promise<any>;
    requiresPrice?: boolean;
}

export default function ActionForm({ title, submitText, onSubmit, requiresPrice }: ActionFormProps) {
    const [amount, setAmount] = useState("");
    const [price, setPrice] = useState("2000"); // Mock default price
    const router = useRouter();
    const { execute, isLoading, error } = useAction(onSubmit);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await execute(amount, price);
            router.push("/app/positions");
            router.refresh();
        } catch (e) {
            // Error handled by hook
        }
    };

    return (
        <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">{title}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-white/60">Amount</label>
                    <input
                        type="number"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-white/20 focus:border-blue-500 focus:outline-none"
                        placeholder="0.00"
                        required
                    />
                </div>

                {requiresPrice && (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white/60">Oracle Price (Mock)</label>
                        <input
                            type="number"
                            step="any"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-white/20 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                )}

                {error && (
                    <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-500 hover:to-purple-500 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {submitText}
                </button>
            </form>
        </div>
    );
}
