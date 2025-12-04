import { useApiClient } from "@/lib/api-client";
import { LendingPool } from "@cantara/sdk";
import { useEffect, useState } from "react";

export interface PermissionedPoolsData {
    crypto: LendingPool[];
    securities: LendingPool[];
}

interface PermissionedPoolsOptions {
    institutionId?: string | null;
    filterByOwner?: boolean;
    privacyOverride?: "Public" | "Private";
}

export function usePermissionedPools(options?: PermissionedPoolsOptions) {
    const api = useApiClient();
    const [data, setData] = useState<PermissionedPoolsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isInstitutional, setIsInstitutional] = useState(false);

    const { institutionId, filterByOwner, privacyOverride } = options || {};

    useEffect(() => {
        let cancelled = false;
        async function run() {
            try {
                setLoading(true);
                const shouldFilter = filterByOwner && institutionId;
                const params = new URLSearchParams();
                if (shouldFilter) {
                    params.set("institutionParty", institutionId as string);
                }
                if (privacyOverride) {
                    params.set("privacy", privacyOverride.toLowerCase());
                }
                const queryString = params.toString() ? `?${params.toString()}` : "";
                const res = await api.get<PermissionedPoolsData>(`/permissioned/pools${queryString}`);
                if (!cancelled) {
                    setData(res);
                    setIsInstitutional(true);
                }
            } catch (err: any) {
                if (!cancelled) {
                    if (err.response?.status === 403) {
                        setIsInstitutional(false);
                        setError(new Error("FORBIDDEN"));
                    } else {
                        setError(err as Error);
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        run();
        return () => {
            cancelled = true;
        };
    }, [api, institutionId, filterByOwner, privacyOverride]);

    return { data, loading, error, isInstitutional };
}
