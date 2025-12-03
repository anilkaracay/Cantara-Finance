import { useApiClient } from "@/lib/api-client";
import { UserPosition } from "@cantara/sdk";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

export function usePermissionedPositions() {
    const api = useApiClient();
    const { role } = useUser();
    const [data, setData] = useState<UserPosition[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (role !== "user") {
            setLoading(false);
            return;
        }

        let cancelled = false;
        async function run() {
            try {
                setLoading(true);
                const res = await api.get<UserPosition[]>("/permissioned/positions");
                if (!cancelled) {
                    setData(res);
                }
            } catch (err) {
                if (!cancelled) setError(err as Error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        run();
        return () => {
            cancelled = true;
        };
    }, [api, role]);

    return { data, loading, error };
}
