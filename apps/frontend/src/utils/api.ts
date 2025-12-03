const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

async function request<T>(
    path: string,
    options: RequestInit & { partyId?: string } = {}
): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}),
    };

    if (options.partyId) {
        headers["x-cantara-user"] = options.partyId;
    }

    const res = await fetch(url, {
        ...options,
        headers,
    });

    if (!res.ok) {
        // Try to parse error body
        let body: any = null;
        try {
            body = await res.json();
        } catch {
            // ignore
        }
        const message = body?.message ?? `Request failed with status ${res.status}`;
        throw new Error(message);
    }

    if (res.status === 204) {
        return undefined as T;
    }

    return (await res.json()) as T;
}

export const api = {
    get: <T>(path: string, partyId?: string) => request<T>(path, { method: "GET", partyId }),
    post: <T>(path: string, body?: any, partyId?: string) =>
        request<T>(path, {
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
            partyId,
        }),
};
