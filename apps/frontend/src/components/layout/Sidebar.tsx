"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRole } from "@/hooks/useRole";
import { LayoutDashboard, Waves, PieChart, Building2, LogOut, User, Shield, Lock, ShieldCheck, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import CantaraWhiteLogo from "@/components/svgs/CantaraWhiteLogo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { InstitutionGuardModal } from "@/components/auth/InstitutionGuardModal";
import { PrivacyModeToggle } from "@/components/institution/PrivacyModeToggle";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { partyId, logout, institutionProfile, privacyMode, setPrivacyMode } = useUser();
    const { role, isInstitution } = useRole();
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Pools', href: '/pools', icon: Waves },
        { name: 'My Positions', href: '/positions', icon: PieChart },
        { name: 'Institution', href: '/institution', icon: Building2, restricted: true },
    ];

    const handleRestrictedNav = (event: React.MouseEvent<HTMLElement>, restricted?: boolean) => {
        if (restricted && !isInstitution) {
            event.preventDefault();
            setShowRestrictionModal(true);
        }
    };

    const handleLogout = () => {
        logout();
        router.replace("/auth");
    };

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
                    const disabled = item.restricted && !isInstitution;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={(event) => handleRestrictedNav(event, item.restricted)}
                            aria-disabled={disabled}
                            className={cn(
                                "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden",
                                disabled
                                    ? "text-text-tertiary/50 cursor-not-allowed opacity-60"
                                    : isActive
                                        ? "bg-primary/10 text-primary shadow-[0_0_20px_-10px_var(--color-primary)]"
                                        : "text-text-secondary hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && !disabled && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_var(--color-primary)]" />
                            )}
                            <Icon className={cn(
                                "h-5 w-5 transition-colors duration-300",
                                disabled
                                    ? "text-text-tertiary/40"
                                    : isActive
                                        ? "text-primary drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]"
                                        : "text-text-tertiary group-hover:text-white"
                            )} />
                            <span className="relative z-10 flex items-center gap-2">
                                {item.name}
                                {disabled && <Lock className="h-3 w-3" />}
                            </span>
                            {isActive && !disabled && (
                                <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Privacy toggle for institutions */}
            {isInstitution && (
                <div className="px-6">
                    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-[#05121F]/60 to-black/40 p-4 shadow-[0_10px_40px_-20px_var(--color-primary)] animate-in fade-in">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                {privacyMode === "Private"
                                    ? <ShieldCheck className="h-5 w-5" />
                                    : <Radio className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                    Privacy Control
                                </p>
                                <p className="text-sm text-text-primary font-medium">
                                    {privacyMode === "Private" ? "Canton Private Ledger" : "Public Settlement"}
                                </p>
                            </div>
                        </div>

                        <PrivacyModeToggle
                            value={privacyMode}
                            onChange={setPrivacyMode}
                            className="justify-between"
                        />
                        <p className="mt-3 text-[11px] text-text-secondary leading-relaxed">
                            {privacyMode === "Private"
                                ? "Transactions are shielded and mirrored only to approved observers."
                                : "Activity is broadcast to permissionless markets for full transparency."}
                        </p>
                    </div>
                </div>
            )}

            {/* Bottom Section */}
            <div className="p-4 m-4 rounded-2xl bg-surface/50 border border-border/50 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-text-tertiary">Current Role</p>
                        <div className="flex items-center gap-2">
                            <Badge variant={isInstitution ? "glow" : "outline"} className="text-[11px]">
                                {isInstitution ? "Institution" : "User"}
                            </Badge>
                            {isInstitution && institutionProfile?.name && (
                                <span className="text-xs text-text-secondary truncate max-w-[120px]">
                                    {institutionProfile.name}
                                </span>
                            )}
                        </div>
                    </div>
                    <Shield className="h-5 w-5 text-primary" />
                </div>

                <div className="pt-4 border-t border-border/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-surface-highlight to-surface border border-border flex items-center justify-center shadow-inner">
                            <User className="h-4 w-4 text-text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-text-tertiary mb-0.5">Connected As</p>
                            <p className="text-xs text-text-primary truncate font-mono bg-black/20 px-1.5 py-0.5 rounded border border-border/30" title={partyId || "Not set"}>
                                {partyId ? `${partyId.substring(0, 16)}...` : "Not set"}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-2 border border-border/40 rounded-xl" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Switch Role / Logout
                    </Button>
                </div>
            </div>

            <InstitutionGuardModal
                open={showRestrictionModal}
                onClose={() => setShowRestrictionModal(false)}
                onRedirect={() => router.push("/auth?tab=institution")}
            />
        </aside>
    );
}
