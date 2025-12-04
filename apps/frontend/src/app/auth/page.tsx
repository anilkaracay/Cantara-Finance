"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Users, Shield, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useUser, InstitutionProfile } from "@/context/UserContext";

type AuthTab = "user" | "institution";

const institutionTypes = ["Bank", "Fund", "Family Office", "Corporate Treasury", "Fintech"];
const aumRanges = ["< $50M", "$50M - $250M", "$250M - $1B", "$1B+", "Prefer not to say"];

export default function AuthPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab") === "institution" ? "institution" : "user";
    const { loginAsUser, loginAsInstitution, initialized, isAuthenticated } = useUser();
    const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);

    const [userPartyId, setUserPartyId] = useState("");
    const [userError, setUserError] = useState<string | null>(null);

    const [institutionName, setInstitutionName] = useState("");
    const [institutionEmail, setInstitutionEmail] = useState("");
    const [institutionWebsite, setInstitutionWebsite] = useState("");
    const [institutionCountry, setInstitutionCountry] = useState("");
    const [institutionTypesSelected, setInstitutionTypesSelected] = useState<string[]>([]);
    const [institutionAum, setInstitutionAum] = useState("");
    const [institutionPartyId, setInstitutionPartyId] = useState("");
    const [institutionConsent, setInstitutionConsent] = useState(false);
    const [institutionError, setInstitutionError] = useState<string | null>(null);

    const demoPartyId = useMemo(() => process.env.NEXT_PUBLIC_CANTARA_USER_PARTY_ID || "User", []);
    const demoInstitutionProfile = useMemo(() => ({
        name: process.env.NEXT_PUBLIC_CANTARA_DEMO_INSTITUTION_NAME || "Cantara Demo Bank",
        email: process.env.NEXT_PUBLIC_CANTARA_DEMO_INSTITUTION_EMAIL || "institution@cantara.finance",
        website: process.env.NEXT_PUBLIC_CANTARA_DEMO_INSTITUTION_WEBSITE || "https://cantara.finance",
        country: process.env.NEXT_PUBLIC_CANTARA_DEMO_INSTITUTION_COUNTRY || "Switzerland",
        types: ["Bank", "Fintech"],
        aumRange: "$1B+",
        partyId: process.env.NEXT_PUBLIC_CANTARA_DEMO_INSTITUTION_PARTY_ID || "InstitutionDemo",
    }), []);

    useEffect(() => {
        if (initialized && isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [initialized, isAuthenticated, router]);

    const handleUserSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!userPartyId.trim()) {
            setUserError("Party ID is required to continue.");
            return;
        }
        loginAsUser(userPartyId.trim());
        router.push("/dashboard");
    };

    const handleInstitutionSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!institutionName || !institutionEmail || !institutionPartyId) {
            setInstitutionError("Please complete all required fields.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(institutionEmail)) {
            setInstitutionError("Please enter a valid email address.");
            return;
        }
        if (!institutionConsent) {
            setInstitutionError("You must confirm authorization to proceed.");
            return;
        }
        const profile: InstitutionProfile = {
            name: institutionName.trim(),
            email: institutionEmail.trim(),
            website: institutionWebsite.trim() || undefined,
            country: institutionCountry || undefined,
            types: institutionTypesSelected,
            aumRange: institutionAum || undefined,
            partyId: institutionPartyId.trim(),
        };
        loginAsInstitution(profile);
        router.push("/dashboard");
    };

    const toggleInstitutionType = (value: string) => {
        setInstitutionTypesSelected((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    return (
        <div className="min-h-screen bg-[#03040b] relative overflow-hidden flex items-center justify-center px-4 py-10">
            <div className="absolute inset-0 opacity-60 pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-secondary/10 blur-[160px]" />
            </div>

            <div className="max-w-6xl w-full relative z-10">
                <Card variant="glass" className="p-8 border border-white/5 shadow-2xl bg-black/50 backdrop-blur-2xl">
                    <div className="grid lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">Cantara Finance</p>
                                <h1 className="text-4xl font-bold text-white">
                                    Choose how you access Cantara
                                </h1>
                                <p className="text-text-secondary">
                                    Connect as a retail user for permissionless markets or onboard your institution to unlock permissioned RWA strategies.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 bg-white/5 rounded-2xl border border-white/10 p-1">
                                <button
                                    onClick={() => setActiveTab("user")}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${
                                        activeTab === "user"
                                            ? "bg-primary/20 text-primary shadow shadow-primary/20"
                                            : "text-text-secondary hover:text-white"
                                    }`}
                                >
                                    <User className="h-4 w-4" />
                                    User Access
                                </button>
                                <button
                                    onClick={() => setActiveTab("institution")}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${
                                        activeTab === "institution"
                                            ? "bg-primary/20 text-primary shadow shadow-primary/20"
                                            : "text-text-secondary hover:text-white"
                                    }`}
                                >
                                    <Building2 className="h-4 w-4" />
                                    Institution Access
                                </button>
                            </div>

                            <div className="hidden lg:block p-6 rounded-2xl border border-border bg-white/5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-primary" />
                                    <p className="font-semibold text-white">Sandbox Auth</p>
                                </div>
                                <p className="text-sm text-text-secondary">
                                    This entry flow is designed for the Canton sandbox. No real-world credentials are required—just your party ID and institution metadata.
                                </p>
                            </div>
                        </div>

                        <div className="bg-black/40 border border-white/10 rounded-3xl p-8 shadow-inner space-y-6 backdrop-blur-xl">
                            {activeTab === "user" ? (
                                <form onSubmit={handleUserSubmit} className="space-y-5">
                                    <div className="space-y-1">
                                        <p className="text-sm uppercase tracking-[0.3em] text-text-tertiary font-bold">
                                            Retail access
                                        </p>
                                        <h2 className="text-2xl font-bold text-white">Connect as a User</h2>
                                        <p className="text-sm text-text-secondary">
                                            Access permissionless pools, borrow, and monitor your wallet in real time.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wide text-text-tertiary font-semibold">Party ID</label>
                                        <input
                                            type="text"
                                            value={userPartyId}
                                            onChange={(event) => {
                                                setUserPartyId(event.target.value);
                                                setUserError(null);
                                            }}
                                            placeholder="party-xxxx-1234"
                                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-tertiary focus:outline-none focus:border-primary"
                                        />
                                        {userError && <p className="text-xs text-error">{userError}</p>}
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <Button type="submit" className="flex-1 min-w-[140px]">
                                            Continue as User
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="flex-1 min-w-[140px] border border-white/10 rounded-xl"
                                            onClick={() => {
                                                setUserPartyId(demoPartyId);
                                                setUserError(null);
                                            }}
                                        >
                                            Use Demo Party
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleInstitutionSubmit} className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-[0.3em] text-warning font-bold">Institution onboarding</p>
                                        <h2 className="text-2xl font-bold text-white">Register your institution</h2>
                                        <p className="text-sm text-text-secondary">
                                            Unlock permissioned markets, RWAs, and institutional dashboards.
                                        </p>
                                    </div>

                                    {institutionError && (
                                        <div className="rounded-xl border border-error/40 bg-error/10 text-error text-sm px-4 py-2">
                                            {institutionError}
                                        </div>
                                    )}

                                    <div className="grid gap-3">
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-wide text-text-tertiary font-semibold">Institution Name</label>
                                            <input
                                                value={institutionName}
                                                onChange={(event) => setInstitutionName(event.target.value)}
                                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                                                placeholder="Global Cantara Bank"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-wide text-text-tertiary font-semibold">Institution Email</label>
                                            <input
                                                type="email"
                                                value={institutionEmail}
                                                onChange={(event) => setInstitutionEmail(event.target.value)}
                                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                                                placeholder="ops@cantara.finance"
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase tracking-wide text-text-tertiary font-semibold">Website</label>
                                                <input
                                                    value={institutionWebsite}
                                                    onChange={(event) => setInstitutionWebsite(event.target.value)}
                                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                                                    placeholder="https://cantara.finance"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs uppercase tracking-wide text-text-tertiary font-semibold">Country / Jurisdiction</label>
                                                <input
                                                    value={institutionCountry}
                                                    onChange={(event) => setInstitutionCountry(event.target.value)}
                                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                                                    placeholder="Switzerland"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-wide text-text-tertiary font-semibold flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                Type of Institution
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {institutionTypes.map((type) => {
                                                    const selected = institutionTypesSelected.includes(type);
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={type}
                                                            onClick={() => toggleInstitutionType(type)}
                                                            className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                                                                selected ? "bg-primary/20 border-primary/40 text-primary" : "border-white/10 text-text-secondary hover:border-white/30"
                                                            }`}
                                                        >
                                                            {type}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-wide text-text-tertiary font-semibold">Approximate AUM</label>
                                            <select
                                                value={institutionAum}
                                                onChange={(event) => setInstitutionAum(event.target.value)}
                                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                                            >
                                                <option value="">Select range</option>
                                                {aumRanges.map((range) => (
                                                    <option key={range} value={range}>{range}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-wide text-text-tertiary font-semibold">Canton Party ID</label>
                                            <input
                                                value={institutionPartyId}
                                                onChange={(event) => setInstitutionPartyId(event.target.value)}
                                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                                                placeholder="institution-party-123"
                                            />
                                        </div>
                                    </div>

                                    <label className="flex items-start gap-3 text-sm text-text-secondary">
                                        <input
                                            type="checkbox"
                                            checked={institutionConsent}
                                            onChange={(event) => setInstitutionConsent(event.target.checked)}
                                            className="mt-1 accent-primary"
                                        />
                                        <span>
                                            I confirm that I am authorized to act on behalf of this institution in the Canton sandbox environment.
                                        </span>
                                    </label>

                                    <div className="flex flex-wrap gap-3">
                                        <Button type="submit" className="flex-1 min-w-[160px]" disabled={!institutionConsent}>
                                            Register & Continue as Institution
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="flex-1 min-w-[160px] border border-white/10 rounded-xl"
                                            onClick={() => {
                                                setInstitutionName(demoInstitutionProfile.name);
                                                setInstitutionEmail(demoInstitutionProfile.email);
                                                setInstitutionWebsite(demoInstitutionProfile.website ?? "");
                                                setInstitutionCountry(demoInstitutionProfile.country ?? "");
                                                setInstitutionTypesSelected(demoInstitutionProfile.types);
                                                setInstitutionAum(demoInstitutionProfile.aumRange ?? "");
                                                setInstitutionPartyId(demoInstitutionProfile.partyId);
                                                setInstitutionConsent(true);
                                                setInstitutionError(null);
                                            }}
                                        >
                                            Use Demo Institution
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

