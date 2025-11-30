import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/api";
import { useUser } from "../context/UserContext";
import { Portfolio, AssetHolding } from "@cantara/sdk";

export function usePortfolio() {
    const { partyId } = useUser();

    return useQuery({
        queryKey: ["portfolio", partyId],
        queryFn: async () => {
            if (!partyId) return null;
            return api.get<Portfolio | null>("/portfolio", partyId);
        },
        enabled: !!partyId,
    });
}

export function useWallet() {
    const { partyId } = useUser();

    return useQuery({
        queryKey: ["wallet", partyId],
        queryFn: async () => {
            if (!partyId) return [];
            return api.get<AssetHolding[]>("/portfolio/wallet", partyId);
        },
        enabled: !!partyId,
    });
}

export function useOracles() {
    const { partyId } = useUser();

    return useQuery({
        queryKey: ["oracles"],
        queryFn: async () => {
            if (!partyId) return [];
            // Assuming OraclePrice type is available or inferred
            return api.get<any[]>("/portfolio/oracles", partyId);
        },
        enabled: !!partyId,
    });
}

export function usePortfolioActions() {
    const queryClient = useQueryClient();
    const { partyId } = useUser();

    const deposit = useMutation({
        mutationFn: async (params: { portfolioCid: string; assetCid: string; poolCid: string; amount: string }) => {
            if (!partyId) throw new Error("Not logged in");
            return api.post("/portfolio/deposit", params, partyId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["pools"] });
            queryClient.invalidateQueries({ queryKey: ["history"] });
        },
        onError: () => {
            // Invalidate queries on error too, in case of stale state (e.g. 404)
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
        },
    });

    const withdraw = useMutation({
        mutationFn: async (params: { portfolioCid: string; symbol: string; amount: string; poolCid: string; oracleCids: string[] }) => {
            if (!partyId) throw new Error("Not logged in");
            return api.post("/portfolio/withdraw", params, partyId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["pools"] });
            queryClient.invalidateQueries({ queryKey: ["history"] });
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
        },
    });

    const borrow = useMutation({
        mutationFn: async (params: { portfolioCid: string; symbol: string; amount: string; poolCid: string; oracleCids: string[] }) => {
            if (!partyId) throw new Error("Not logged in");
            return api.post("/portfolio/borrow", params, partyId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["pools"] });
            queryClient.invalidateQueries({ queryKey: ["history"] });
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
        },
    });

    const repay = useMutation({
        mutationFn: async (params: { portfolioCid: string; assetCid: string; poolCid: string; amount: string }) => {
            if (!partyId) throw new Error("Not logged in");
            return api.post("/portfolio/repay", params, partyId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["pools"] });
            queryClient.invalidateQueries({ queryKey: ["history"] });
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
        },
    });

    return { deposit, withdraw, borrow, repay };
}
