"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";

export interface HistoryItem {
    contractId: string;
    actor: string;
    user: string;
    actionType: string;
    assetSymbol: string;
    amount: string;
    timestamp: string;
}

export function useHistory() {
    return useQuery<HistoryItem[]>({
        queryKey: ["history"],
        queryFn: async () => {
            const data = await api.get<HistoryItem[]>("/history");
            return data;
        },
        staleTime: 10000,
    });
}
