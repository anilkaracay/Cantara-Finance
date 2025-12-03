"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CantaraRole = "user" | "institution";

interface UserContextValue {
    partyId: string | null;
    role: CantaraRole;
    institutionId: string | null;
    privacyMode: "Public" | "Private";
    setPartyId: (partyId: string) => void;
    setRole: (role: CantaraRole) => void;
    setInstitutionId: (id: string | null) => void;
    setPrivacyMode: (mode: "Public" | "Private") => void;
    logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    // Hardcoded for dev convenience after sandbox restart
    const DEFAULT_PARTY_ID = process.env.NEXT_PUBLIC_CANTARA_USER_PARTY_ID || "User";
    const STORAGE_KEY = "cantara:partyId_v6";

    const [partyId, setPartyIdState] = useState<string | null>(DEFAULT_PARTY_ID);
    const [role, setRoleState] = useState<CantaraRole>("user");
    const [institutionId, setInstitutionIdState] = useState<string | null>(null);
    const [privacyMode, setPrivacyModeState] = useState<"Public" | "Private">("Public");

    useEffect(() => {
        if (typeof window === "undefined") return;
        const savedParty = window.localStorage.getItem(STORAGE_KEY);
        const savedRole = window.localStorage.getItem("cantara:role_v1") as CantaraRole | null;
        const savedInst = window.localStorage.getItem("cantara:institutionId_v1");
        const savedPrivacy = window.localStorage.getItem("cantara:privacyMode_v1") as "Public" | "Private" | null;

        if (savedParty) setPartyIdState(savedParty);
        else {
            setPartyIdState(DEFAULT_PARTY_ID);
            window.localStorage.setItem(STORAGE_KEY, DEFAULT_PARTY_ID);
        }

        if (savedRole) setRoleState(savedRole);
        if (savedInst) setInstitutionIdState(savedInst);
        if (savedPrivacy) setPrivacyModeState(savedPrivacy);
    }, []);

    const setPartyId = (id: string) => {
        setPartyIdState(id);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, id);
        }
    };

    const setRole = (r: CantaraRole) => {
        setRoleState(r);
        if (typeof window !== "undefined") {
            window.localStorage.setItem("cantara:role_v1", r);
        }
    };

    const setInstitutionId = (id: string | null) => {
        setInstitutionIdState(id);
        if (typeof window !== "undefined") {
            if (id) window.localStorage.setItem("cantara:institutionId_v1", id);
            else window.localStorage.removeItem("cantara:institutionId_v1");
        }
    };

    const setPrivacyMode = (mode: "Public" | "Private") => {
        setPrivacyModeState(mode);
        if (typeof window !== "undefined") {
            window.localStorage.setItem("cantara:privacyMode_v1", mode);
        }
    };

    const logout = () => {
        setPartyIdState(null);
        setRoleState("user");
        setInstitutionIdState(null);
        setPrivacyModeState("Public");
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(STORAGE_KEY);
            window.localStorage.removeItem("cantara:role_v1");
            window.localStorage.removeItem("cantara:institutionId_v1");
            window.localStorage.removeItem("cantara:privacyMode_v1");
        }
    };

    return (
        <UserContext.Provider value={{ partyId, role, institutionId, privacyMode, setPartyId, setRole, setInstitutionId, setPrivacyMode, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
}
