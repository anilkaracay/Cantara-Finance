"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { mockStore } from "./mockStore";

export interface Pool {
    contractId: string;
    admin: string;
    poolId: string;
    railType: "Permissionless";
    assetSymbol: string;
    assetClass: "ClassA" | "ClassAA" | "ClassB" | "ClassR";
    totalDeposits: string;
    totalBorrows: string;
    baseRate: string;
    slope1: string;
    slope2: string;
    kinkUtilization: string;
    riskParams: {
        rpMaxLtv: string;
        rpLiquidationThreshold: string;
        rpLiquidationBonus: string;
        rpMinHealthFactor: string;
        rpRailType: string;
    };
    ownerInstitution?: string;
    visibility?: "Public" | "Private";
    category?: string;
    // Derived metrics
    utilization: number;
    borrowApy: number;
    supplyApy: number;
}

function calculateDerivedMetrics(pool: any): Pool {
    const totalDeposits = Number(pool.totalDeposits);
    const totalBorrows = Number(pool.totalBorrows);
    const baseRate = Number(pool.baseRate);
    const slope1 = Number(pool.slope1);
    const slope2 = Number(pool.slope2);
    const kink = Number(pool.kinkUtilization);

    let utilization = 0;
    if (totalDeposits > 0) {
        utilization = totalBorrows / totalDeposits;
    }

    let borrowRate = baseRate;
    if (utilization <= kink) {
        borrowRate += utilization * slope1;
    } else {
        borrowRate += kink * slope1 + (utilization - kink) * slope2;
    }

    // Supply Rate = Borrow Rate * Utilization (assuming 0 reserve factor)
    const supplyRate = borrowRate * utilization;

    return {
        ...pool,
        utilization,
        borrowApy: borrowRate,
        supplyApy: supplyRate
    };
}

export function usePermissionlessPools() {
    return useQuery<Pool[]>({
        queryKey: ["pools", "permissionless"],
        queryFn: async () => {
            console.log("Fetching pools from API...");
            const data = await api.get<any[]>("/pools/permissionless");
            console.log("Pools data raw:", data);
            const enriched = data.map(calculateDerivedMetrics);
            console.log("Pools data enriched:", enriched);
            return enriched;
        },
        staleTime: 30000,
    });
}

export function usePermissionedPools() {
    return useQuery<{ crypto: Pool[], securities: Pool[] }>({
        queryKey: ["pools", "permissioned"],
        queryFn: async () => {
            const data = await api.get<{ crypto: any[], securities: any[] }>("/permissioned/pools");
            return {
                crypto: data.crypto.map(calculateDerivedMetrics),
                securities: data.securities.map(calculateDerivedMetrics)
            };
        },
        staleTime: 30000,
        retry: false, // Don't retry if 403
    });
}
