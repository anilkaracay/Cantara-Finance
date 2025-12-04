import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/api";
import { useUser } from "../context/UserContext";
import { Portfolio, AssetHolding } from "@cantara/sdk";
// import { mockStore } from "./mockStore";

export function usePortfolio() {
    const { partyId } = useUser();

    return useQuery({
        queryKey: ["portfolio", partyId],
        queryFn: async () => {
            if (!partyId) return null;
            return api.get<Portfolio | null>("/portfolio", partyId);
            // return mockStore.getPortfolio();
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
        queryKey: ["oracles", partyId],
        queryFn: async () => {
            if (!partyId) return [];
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

            // Use mock store to update state
            // const assetSymbol = params.assetCid.split("-")[1].toUpperCase(); // Extract symbol from mock id
            // return mockStore.deposit(assetSymbol, params.amount);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["pools"] });
            queryClient.invalidateQueries({ queryKey: ["history"] });
            queryClient.invalidateQueries({ queryKey: ["risk-summary"] });
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
        },
    });

    const withdraw = useMutation({
        mutationFn: async (params: { portfolioCid: string; symbol: string; amount: string; poolCid: string; oracleCids: string[] }) => {
            if (!partyId) throw new Error("Not logged in");
            return api.post("/portfolio/withdraw", params, partyId);

            // return mockStore.withdraw(params.symbol, params.amount);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["pools"] });
            queryClient.invalidateQueries({ queryKey: ["history"] });
            queryClient.invalidateQueries({ queryKey: ["risk-summary"] });
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

            // return mockStore.borrow(params.symbol, params.amount);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["pools"] });
            queryClient.invalidateQueries({ queryKey: ["history"] });
            queryClient.invalidateQueries({ queryKey: ["risk-summary"] });
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
        },
    });

    const repay = useMutation({
        mutationFn: async (params: { portfolioCid: string; assetCid: string; poolCid: string; amount: string }) => {
            if (!partyId) throw new Error("Not logged in");

            // Extract symbol from mock id or infer from context (simplified for mock)
            // In real app, assetCid would map to a symbol. Here we assume we can get it.
            // But wait, the params don't have symbol directly for repay/deposit sometimes.
            // Let's look at how it's called.
            // Actually, for mock purposes, we might need to cheat a bit if symbol isn't passed.
            // But usually assetCid in our mock is like "mock-usdc-holding".

            // let symbol = "USDC"; // Default fallback
            // if (params.assetCid.includes("usdc")) symbol = "USDC";
            // else if (params.assetCid.includes("btc")) symbol = "BTC";
            // else if (params.assetCid.includes("eth")) symbol = "ETH";
            // else if (params.assetCid.includes("cc")) symbol = "CC";

            return api.post("/portfolio/repay", params, partyId);
            // return mockStore.repay(symbol, params.amount);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            queryClient.invalidateQueries({ queryKey: ["pools"] });
            queryClient.invalidateQueries({ queryKey: ["history"] });
            queryClient.invalidateQueries({ queryKey: ["risk-summary"] });
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
        },
    });

    return { deposit, withdraw, borrow, repay };
}
