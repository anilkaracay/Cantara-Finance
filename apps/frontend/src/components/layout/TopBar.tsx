"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Wallet, ChevronRight, Shield, LogOut } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/Button";

export function TopBar() {
    const pathname = usePathname();
    const router = useRouter();
    const { role, institutionId, institutionProfile, logout } = useUser();
    const { isInstitution } = useRole();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const getPageTitle = () => {
        if (pathname === "/dashboard") return "Overview";
        if (pathname === "/institution") return "Institutional Console";
        if (pathname.includes("pools")) return "Lending Pools";
        if (pathname.includes("positions")) return "My Positions";
        return "Dashboard";
    };

    const roleLabel = isInstitution ? (institutionProfile?.name ?? institutionId ?? "Institution") : "Permissionless User";

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        router.replace("/auth");
    };

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between px-8 transition-all duration-300 bg-[#0D0D0F]/80 backdrop-blur-xl border-b border-border/30">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-text-tertiary mb-1">
                        <span>App</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-text-secondary capitalize">{pathname.split('/')[1] || 'Dashboard'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                            {getPageTitle()}
                        </h1>
                        {role === "institution" && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20 shadow-[0_0_10px_-5px_var(--color-primary)]">
                                Institutional
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/50 border border-border/50 backdrop-blur-sm">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                    </div>
                    <span className="text-xs font-medium text-text-secondary">Canton Sandbox</span>
                </div>

                <button className="p-2.5 rounded-full text-text-secondary hover:text-white hover:bg-white/5 transition-all relative group" aria-label="Notifications">
                    <Bell className="h-5 w-5 group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-all" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background shadow-[0_0_5px_var(--color-primary)]" />
                </button>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="flex items-center gap-3 px-4 py-2 rounded-2xl border border-border/40 bg-white/5 hover:border-primary/40 transition-all"
                    >
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-surface-highlight to-surface border border-border flex items-center justify-center shadow-inner">
                            <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] uppercase tracking-wider text-text-tertiary font-bold">Connected Role</p>
                            <p className="text-sm text-text-primary font-semibold">{roleLabel}</p>
                        </div>
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-border/60 bg-[#0B0C12]/95 backdrop-blur-xl shadow-2xl">
                            <div className="px-4 py-3 border-b border-border/40">
                                <p className="text-[10px] uppercase tracking-wide text-text-tertiary">Signed in as</p>
                                <p className="text-sm text-text-primary font-semibold">{roleLabel}</p>
                                <p className="text-xs text-text-secondary mt-1">{isInstitution ? "Institutional Access" : "User Access"}</p>
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                                <Button variant="ghost" className="justify-start gap-3 w-full rounded-xl border border-border/40" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4 text-text-secondary" />
                                    Switch Role / Logout
                                </Button>
                                {!isInstitution && (
                                    <Button
                                        variant="outline"
                                        className="justify-center rounded-xl text-xs"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            router.push("/auth?tab=institution");
                                        }}
                                    >
                                        Become an Institution
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="hidden lg:flex items-center gap-4 pl-6 border-l border-border/30">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-success flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_5px_var(--color-success)]" />
                            Connected
                        </span>
                        <span className="text-xs text-text-tertiary font-mono">0x...1234</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-surface-highlight to-surface border border-border flex items-center justify-center shadow-lg">
                        <Wallet className="h-5 w-5 text-primary" />
                    </div>
                </div>
            </div>
        </header>
    );
}
