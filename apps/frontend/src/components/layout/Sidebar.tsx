"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useInstitutions } from "@/hooks/permissioned/useInstitutions";
import { LayoutDashboard, Waves, PieChart, Building2, Settings, LogOut, User, Shield, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import CantaraWhiteLogo from "@/components/svgs/CantaraWhiteLogo";
import { InstitutionSelector } from "@/components/institution/InstitutionSelector";

export function Sidebar() {
    const pathname = usePathname();
    const { partyId, logout } = useUser();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Pools', href: '/pools', icon: Waves },
        { name: 'My Positions', href: '/positions', icon: PieChart },
        { name: 'Institution', href: '/institution', icon: Building2 },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-[#05060B]/80 backdrop-blur-2xl flex flex-col z-40 shadow-2xl">
            {/* Logo */}
            <div className="p-8 pb-6 flex justify-center">
                <Link href="/" className="flex items-center justify-center group">
                    <div className="h-16 w-16 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                        <CantaraWhiteLogo className="h-full w-full" />
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href.split('#')[0];
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-[0_0_20px_-10px_var(--color-primary)]"
                                    : "text-text-secondary hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_var(--color-primary)]" />
                            )}
                            <Icon className={cn("h-5 w-5 transition-colors duration-300", isActive ? "text-primary drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]" : "text-text-tertiary group-hover:text-white")} />
                            <span className="relative z-10">{item.name}</span>
                            {isActive && (
                                <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 m-4 rounded-2xl bg-surface/50 border border-border/50 backdrop-blur-md">
                <RoleSwitcher />

                <div className="mt-4 pt-4 border-t border-border/30">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-surface-highlight to-surface border border-border flex items-center justify-center shadow-inner">
                            <User className="h-4 w-4 text-text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-text-tertiary mb-0.5">Connected As</p>
                            <p className="text-xs text-text-primary truncate font-mono bg-black/20 px-1.5 py-0.5 rounded border border-border/30" title={partyId || "Not set"}>
                                {partyId ? `${partyId.substring(0, 12)}...` : "Not set"}
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 rounded-lg text-text-tertiary hover:text-error hover:bg-error/10 transition-all"
                            title="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function RoleSwitcher() {
    const { role, setRole, institutionId, setInstitutionId } = useUser();
    const { data: institutions } = useInstitutions();

    const handleRoleChange = (newRole: "user" | "institution") => {
        setRole(newRole);
        if (newRole === "institution" && !institutionId && institutions && institutions.length > 0) {
            setInstitutionId(institutions[0].institution);
        }
    };

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-border/50">
                <button
                    onClick={() => handleRoleChange("user")}
                    className={cn(
                        "flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-300",
                        role === "user"
                            ? "bg-surface-highlight text-white shadow-lg border border-border/50"
                            : "text-text-tertiary hover:text-text-secondary"
                    )}
                >
                    <User className="h-3 w-3" />
                    User
                </button>
                <button
                    onClick={() => handleRoleChange("institution")}
                    className={cn(
                        "flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-300",
                        role === "institution"
                            ? "bg-primary/20 text-primary shadow-lg border border-primary/20 shadow-[0_0_10px_-5px_var(--color-primary)]"
                            : "text-text-tertiary hover:text-text-secondary"
                    )}
                >
                    <Shield className="h-3 w-3" />
                    Inst.
                </button>
            </div>

            {role === "institution" && institutions && institutions.length > 0 && (
                <InstitutionSelector
                    institutions={institutions}
                    value={institutionId}
                    onChange={setInstitutionId}
                />
            )}
        </div>
    );
}
