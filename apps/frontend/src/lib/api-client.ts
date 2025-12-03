import { useUser } from "@/context/UserContext";
import { useMemo } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export function useApiClient() {
    const { partyId, role, institutionId, privacyMode } = useUser();

    const client = useMemo(() => {
        const defaultHeaders: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (partyId) {
            defaultHeaders["x-cantara-user"] = partyId;
        }

        defaultHeaders["x-cantara-role"] = role;

        if (role === "institution" && institutionId) {
            defaultHeaders["x-cantara-institution"] = institutionId;
        }

        if (privacyMode) {
            defaultHeaders["x-cantara-privacy-mode"] = privacyMode;
        }

        const request = async <T>(method: string, path: string, body?: unknown): Promise<T> => {
            const res = await fetch(`${BACKEND_URL}${path}`, {
                method,
                headers: defaultHeaders,
                body: body ? JSON.stringify(body) : undefined,
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error(`API ${method} ${path} failed with status ${res.status}`);
            }

            return res.json() as Promise<T>;
        };

        return {
            get: <T>(path: string) => request<T>("GET", path),
            post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
        };
    }, [partyId, role, institutionId, privacyMode]);

    return client;
}

// Keep the standalone function for legacy calls if needed, but prefer the hook
export async function apiGet<T>(path: string, options?: { partyId?: string }): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (options?.partyId) {
        headers["x-cantara-user"] = options.partyId;
    }

    const res = await fetch(`${BACKEND_URL}${path}`, {
        method: "GET",
        headers,
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`API GET ${path} failed with status ${res.status}`);
    }

    return res.json() as Promise<T>;
}
