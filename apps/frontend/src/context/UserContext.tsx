"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface UserContextValue {
    partyId: string | null;
    setPartyId: (partyId: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    // Hardcoded for dev convenience after sandbox restart
    const DEFAULT_PARTY_ID = "party-94d5f1fa-2dd9-4107-b1eb-be80cdee26db::1220e319d78e8b39334bceab832669f08ac7ca54eed77a9ceabd17907e317d0c67f0";
    const STORAGE_KEY = "cantara:partyId_v4";

    const [partyId, setPartyIdState] = useState<string | null>(DEFAULT_PARTY_ID);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setPartyIdState(saved);
        } else {
            // Initialize with default if nothing saved
            setPartyIdState(DEFAULT_PARTY_ID);
            window.localStorage.setItem(STORAGE_KEY, DEFAULT_PARTY_ID);
        }
    }, []);

    const setPartyId = (id: string) => {
        setPartyIdState(id);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, id);
        }
    };

    const logout = () => {
        setPartyIdState(null);
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    };

    return (
        <UserContext.Provider value={{ partyId, setPartyId, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
}
