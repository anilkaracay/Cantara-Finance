"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface UserContextValue {
    partyId: string | null;
    setPartyId: (partyId: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [partyId, setPartyIdState] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const saved = window.localStorage.getItem("cantara:partyId");
        if (saved) setPartyIdState(saved);
    }, []);

    const setPartyId = (id: string) => {
        setPartyIdState(id);
        if (typeof window !== "undefined") {
            window.localStorage.setItem("cantara:partyId", id);
        }
    };

    const logout = () => {
        setPartyIdState(null);
        if (typeof window !== "undefined") {
            window.localStorage.removeItem("cantara:partyId");
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
