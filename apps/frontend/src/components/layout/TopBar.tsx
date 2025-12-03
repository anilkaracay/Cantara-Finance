"use client";

import { usePathname } from "next/navigation";
import { Bell, Wallet, ChevronRight } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

export function TopBar() {
    const pathname = usePathname();
    const { role } = useUser();

    const getPageTitle = () => {
        if (pathname === "/dashboard") return "Overview";
        if (pathname === "/institution") return "Institutional Console";
        if (pathname.includes("pools")) return "Lending Pools";
        if (pathname.includes("positions")) return "My Positions";
        return "Dashboard";
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
                {/* Network Indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/50 border border-border/50 backdrop-blur-sm">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                    </div>
                    <span className="text-xs font-medium text-text-secondary">Canton Sandbox</span>
                </div>

                {/* Notifications */}
                <button className="p-2.5 rounded-full text-text-secondary hover:text-white hover:bg-white/5 transition-all relative group">
                    <Bell className="h-5 w-5 group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-all" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background shadow-[0_0_5px_var(--color-primary)]" />
                </button>

                {/* Wallet/User Status */}
                <div className="flex items-center gap-4 pl-6 border-l border-border/30">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-success flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_5px_var(--color-success)]" />
                            Connected
                        </span>
                        <span className="text-xs text-text-tertiary font-mono">0x...1234</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-surface-highlight to-surface border border-border flex items-center justify-center shadow-lg group cursor-pointer hover:border-primary/50 transition-all">
                        <Wallet className="h-5 w-5 text-primary group-hover:drop-shadow-[0_0_5px_var(--color-primary)] transition-all" />
                    </div>
                </div>
            </div>
        </header>
    );
}
