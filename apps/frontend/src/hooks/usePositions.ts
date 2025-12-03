import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { UserPosition } from "@cantara/sdk";
import { useUser } from "@/context/UserContext";

export type Position = UserPosition;

export function useUserPositions() {
    const api = useApiClient();
    const { partyId } = useUser();

    return useQuery({
        queryKey: ["positions", partyId],
        queryFn: async () => {
            if (!partyId) return [];
            return api.get<UserPosition[]>("/positions");
        },
        enabled: !!partyId,
    });
}

export function useDeposit() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: { contractId: string; amount: string }) => {
            return api.post(`/positions/${params.contractId}/deposit`, { amount: params.amount });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] });
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
        },
    });
}

export function useWithdraw() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: { contractId: string; amount: string; price?: string }) => {
            return api.post(`/positions/${params.contractId}/withdraw`, { amount: params.amount });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] });
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
        },
    });
}

export function useBorrow() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: { contractId: string; amount: string; price?: string }) => {
            return api.post(`/positions/${params.contractId}/borrow`, { amount: params.amount });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] });
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
        },
    });
}

export function useRepay() {
    const api = useApiClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: { contractId: string; amount: string }) => {
            return api.post(`/positions/${params.contractId}/repay`, { amount: params.amount });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] });
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
        },
    });
}
