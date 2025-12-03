import { useApiClient } from "@/lib/api-client";
import { Institution } from "@cantara/sdk";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

export function useInstitutions() {
    const api = useApiClient();
    const { role } = useUser();
    const [data, setData] = useState<Institution[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (role !== "institution") {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        let cancelled = false;
        async function run() {
            try {
                setLoading(true);
                const res = await api.get<Institution[]>("/permissioned/institutions");
                if (!cancelled) {
                    setData(res);
                }
            } catch (err) {
                if (!cancelled) setError(err as Error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        if (role === "institution") {
            run();
        }
        return () => {
            cancelled = true;
        };
    }, [api, role]);

    return { data, loading, error };
}
