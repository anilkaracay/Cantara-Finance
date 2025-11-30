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
    const DEFAULT_PARTY_ID = "party-5bd0e7df-bdbd-4f32-8ab3-3637192dc9b3::122070dd5d4c98499ae2f2c890d416de24190a13b44f3aeb60a3e9d18f60a852baff";
    const STORAGE_KEY = "cantara:partyId_v3";

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
