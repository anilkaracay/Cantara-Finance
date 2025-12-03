import { useApiClient } from "@/lib/api-client";
import { LendingPool } from "@cantara/sdk";
import { useEffect, useState } from "react";

export interface PermissionedPoolsData {
    crypto: LendingPool[];
    securities: LendingPool[];
}

export function usePermissionedPools(institutionId?: string | null) {
    const api = useApiClient();
    const [data, setData] = useState<PermissionedPoolsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isInstitutional, setIsInstitutional] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function run() {
            try {
                setLoading(true);
                const query = institutionId ? `?institutionParty=${institutionId}` : "";
                const res = await api.get<PermissionedPoolsData>(`/permissioned/pools${query}`);
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
    }, [api, institutionId]);

    return { data, loading, error, isInstitutional };
}
