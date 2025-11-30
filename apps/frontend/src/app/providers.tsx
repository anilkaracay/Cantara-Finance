"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { UserProvider } from "@/context/UserContext";

export function AppProviders({ children }: { children: ReactNode }) {
    const [client] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={client}>
            <UserProvider>{children}</UserProvider>
        </QueryClientProvider>
    );
}
