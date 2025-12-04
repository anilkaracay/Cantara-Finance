"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const { initialized, isAuthenticated } = useUser();

    useEffect(() => {
        if (!initialized) return;
        if (!isAuthenticated) {
            router.replace("/auth");
        }
    }, [initialized, isAuthenticated, router]);

    if (!initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-text-secondary">
                <div className="space-y-4 text-center">
                    <div className="h-12 w-12 rounded-full border-2 border-border border-t-primary animate-spin mx-auto" />
                    <p className="text-sm tracking-wide uppercase">Preparing Cantara...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}

