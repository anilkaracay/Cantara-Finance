"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { INSTITUTION_PROFILE_PREFIX, PRIVACY_MODE_STORAGE_KEY, SESSION_STORAGE_KEY } from "@/constants/session";

export type CantaraRole = "user" | "institution";

export interface InstitutionProfile {
    name: string;
    email: string;
    website?: string;
    country?: string;
    types: string[];
    aumRange?: string;
    partyId: string;
    confirmed?: boolean;
}

interface UserSession {
    role: CantaraRole;
    partyId: string;
    institutionId: string | null;
    institutionProfile: InstitutionProfile | null;
}

interface UserContextValue {
    partyId: string | null;
    role: CantaraRole | null;
    institutionId: string | null;
    institutionProfile: InstitutionProfile | null;
    privacyMode: "Public" | "Private";
    initialized: boolean;
    isAuthenticated: boolean;
    loginAsUser: (partyId: string) => void;
    loginAsInstitution: (profile: InstitutionProfile) => void;
    setInstitutionId: (id: string | null) => void;
    setPrivacyMode: (mode: "Public" | "Private") => void;
    logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

function readInstitutionProfile(partyId: string): InstitutionProfile | null {
    if (typeof window === "undefined" || !partyId) return null;
    try {
        const stored = window.localStorage.getItem(`${INSTITUTION_PROFILE_PREFIX}${partyId}`);
        return stored ? (JSON.parse(stored) as InstitutionProfile) : null;
    } catch {
        return null;
    }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [session, setSessionState] = useState<UserSession | null>(null);
    const [privacyMode, setPrivacyModeState] = useState<"Public" | "Private">("Public");
    const [initialized, setInitialized] = useState(false);

    const persistSession = useCallback((next: UserSession | null) => {
        if (typeof window === "undefined") return;
        if (!next) {
            window.localStorage.removeItem(SESSION_STORAGE_KEY);
            return;
        }
        const payload = JSON.stringify({
            ...next,
            institutionProfile: next.institutionProfile ?? null,
        });
        window.localStorage.setItem(SESSION_STORAGE_KEY, payload);
        if (next.role === "institution" && next.institutionId && next.institutionProfile) {
            window.localStorage.setItem(`${INSTITUTION_PROFILE_PREFIX}${next.institutionId}`, JSON.stringify(next.institutionProfile));
        }
    }, []);

    const setSession = useCallback((value: UserSession | null | ((prev: UserSession | null) => UserSession | null)) => {
        setSessionState((prev) => {
            const next = typeof value === "function" ? (value as (prev: UserSession | null) => UserSession | null)(prev) : value;
            persistSession(next);
            return next;
        });
    }, [persistSession]);

    const loginAsUser = useCallback((partyId: string) => {
        const sanitized = partyId.trim();
        if (!sanitized) return;
        setSession({
            role: "user",
            partyId: sanitized,
            institutionId: null,
            institutionProfile: null,
        });
    }, [setSession]);

    const loginAsInstitution = useCallback((profile: InstitutionProfile) => {
        const sanitizedParty = profile.partyId.trim();
        if (!sanitizedParty) return;
        const normalizedProfile = { ...profile, partyId: sanitizedParty };
        setSession({
            role: "institution",
            partyId: sanitizedParty,
            institutionId: sanitizedParty,
            institutionProfile: normalizedProfile,
        });
    }, [setSession]);

    const setInstitutionId = useCallback((id: string | null) => {
        setSession((prev) => {
            if (!prev) return prev;
            if (!id) {
                return { ...prev, institutionId: null, institutionProfile: null };
            }
            const storedProfile = readInstitutionProfile(id) ?? (prev.institutionId === id ? prev.institutionProfile : null);
            return {
                ...prev,
                institutionId: id,
                institutionProfile: storedProfile,
            };
        });
    }, [setSession]);

    const setPrivacyMode = useCallback((mode: "Public" | "Private") => {
        setPrivacyModeState(mode);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(PRIVACY_MODE_STORAGE_KEY, mode);
        }
    }, []);

    const logout = useCallback(() => {
        setSession(null);
        setPrivacyModeState("Public");
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(PRIVACY_MODE_STORAGE_KEY);
        }
    }, [setSession]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
            if (storedSession) {
                const parsed = JSON.parse(storedSession) as UserSession;
                const profile = parsed.institutionProfile
                    ?? (parsed.role === "institution" && parsed.institutionId ? readInstitutionProfile(parsed.institutionId) : null);
                setSessionState({
                    ...parsed,
                    institutionProfile: profile,
                });
            }
            const savedPrivacy = window.localStorage.getItem(PRIVACY_MODE_STORAGE_KEY) as "Public" | "Private" | null;
            if (savedPrivacy) {
                setPrivacyModeState(savedPrivacy);
            }
        } finally {
            setInitialized(true);
        }
    }, []);

    const contextValue: UserContextValue = {
        partyId: session?.partyId ?? null,
        role: session?.role ?? null,
        institutionId: session?.institutionId ?? null,
        institutionProfile: session?.institutionProfile ?? null,
        privacyMode,
        initialized,
        isAuthenticated: Boolean(session?.partyId),
        loginAsUser,
        loginAsInstitution,
        setInstitutionId,
        setPrivacyMode,
        logout,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
}
