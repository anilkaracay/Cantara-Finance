"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

interface HealthResponse {
    healthFactor: number;
    isLiquidatable: boolean;
}

export function NotificationBanner() {
    const { partyId } = useUser();
    const [dismissed, setDismissed] = useState(false);

    const { data: health } = useQuery<HealthResponse>({
        queryKey: ["liquidation", "health"],
        queryFn: async () => {
            return api.get("/liquidation/health", partyId ?? undefined);
        },
        refetchInterval: 5000,
        enabled: !!partyId,
    });

    if (!health || !partyId || dismissed) return null;

    const hf = health.healthFactor;

    // Don't show if healthy
    if (hf >= 1.5) return null;

    // Determine severity
    const isCritical = hf < 1.2;
    const isLiquidatable = hf < 1.0;

    let bgColor = "bg-yellow-500/10";
    let borderColor = "border-yellow-500/50";
    let textColor = "text-yellow-400";
    let icon = "⚠️";
    let title = "Warning: Health Factor at Risk";
    let message = "Your health factor is below 1.5. Consider adding collateral or repaying debt.";

    if (isLiquidatable) {
        bgColor = "bg-red-500/10";
        borderColor = "border-red-500/50";
        textColor = "text-red-400";
        icon = "🚨";
        title = "CRITICAL: Position Liquidatable";
        message = "Your health factor is below 1.0! Your position can be liquidated at any time. Take immediate action!";
    } else if (isCritical) {
        bgColor = "bg-orange-500/10";
        borderColor = "border-orange-500/50";
        textColor = "text-orange-400";
        icon = "⚠️";
        title = "Critical: Liquidation Imminent";
        message = "Your health factor is below 1.2. You are at high risk of liquidation. Act now!";
    }

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 ${bgColor} border-b ${borderColor} p-4`}>
            <div className="container mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                        <div className={`font-bold ${textColor}`}>{title}</div>
                        <div className="text-sm text-slate-300">{message}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isLiquidatable && (
                        <div className={`text-sm font-mono ${textColor} px-3 py-1 bg-slate-950 rounded`}>
                            HF: {hf.toFixed(3)}
                        </div>
                    )}
                    <button
                        onClick={() => setDismissed(true)}
                        className="text-slate-400 hover:text-white px-3 py-1 rounded hover:bg-slate-800 transition-colors text-sm"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
