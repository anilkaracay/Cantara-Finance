import { PRIVACY_MODE_STORAGE_KEY, SESSION_STORAGE_KEY } from "@/constants/session";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

interface StoredSession {
    role: "user" | "institution";
    partyId: string;
    institutionId: string | null;
}

interface RequestOptions extends RequestInit {
    partyId?: string;
}

function getStoredSession(): StoredSession | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as StoredSession) : null;
    } catch {
        return null;
    }
}

function getStoredPrivacy(): "Public" | "Private" | null {
    if (typeof window === "undefined") return null;
    const value = window.localStorage.getItem(PRIVACY_MODE_STORAGE_KEY);
    if (value === "Public" || value === "Private") return value;
    return null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = `${BASE_URL}${path}`;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}),
    };

    const session = getStoredSession();
    const partyId = options.partyId ?? session?.partyId;

    if (partyId) {
        headers["x-cantara-user"] = partyId;
    }

    if (session?.role) {
        headers["x-cantara-role"] = session.role;
    }

    if (session?.role === "institution" && session.institutionId) {
        headers["x-cantara-institution"] = session.institutionId;
    }

    const privacyMode = getStoredPrivacy();
    if (privacyMode) {
        headers["x-cantara-privacy-mode"] = privacyMode;
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
