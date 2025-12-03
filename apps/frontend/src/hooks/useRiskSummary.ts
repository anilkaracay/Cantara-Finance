import { useQuery } from "@tanstack/react-query";
import type { RiskSummary } from "@cantara/types";
import { useUser } from "../context/UserContext";
import { api } from "@/utils/api";

interface UseRiskSummaryState {
    data: RiskSummary | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useRiskSummary(): UseRiskSummaryState {
    const { partyId } = useUser();
    const query = useQuery<RiskSummary>({
        queryKey: ["risk-summary", partyId],
        enabled: !!partyId,
        queryFn: async () => {
            if (!partyId) {
                throw new Error("Missing user party id");
            }
            return api.get<RiskSummary>("/risk/summary", partyId);
        },
        refetchOnWindowFocus: false,
    });

    return {
        data: query.data ?? null,
        loading: query.isLoading,
        error: query.error ? (query.error as Error).message : null,
        refetch: query.refetch,
    };
}
