"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
    const { partyId, setPartyId, logout } = useUser();
    const pathname = usePathname();
    const [input, setInput] = useState("");

    const handleSetParty = () => {
        if (input.trim().length > 0) {
            setPartyId(input.trim());
            setInput("");
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-950 text-slate-50">
            <aside className="w-64 border-r border-slate-800 p-4 flex flex-col">
                <div className="mb-6">
                    <Link href="/" className="font-semibold text-lg text-emerald-400">
                        Cantara
                    </Link>
                </div>
                <nav className="flex-1 space-y-2 text-sm">
                    <Link
                        href="/dashboard"
                        className={`block px-3 py-2 rounded-md transition-colors ${pathname === "/dashboard"
                                ? "bg-slate-800 text-white font-medium"
                                : "text-slate-400 hover:text-white hover:bg-slate-900"
                            }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard#pools"
                        className="block px-3 py-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                    >
                        Pools
                    </Link>
                    <Link
                        href="/dashboard#positions"
                        className="block px-3 py-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                    >
                        My Positions
                    </Link>
                </nav>
                <div className="mt-6 border-t border-slate-800 pt-4 text-xs">
                    <div className="mb-2">
                        <div className="text-slate-400 font-medium mb-1">Party ID</div>
                        <div className="text-slate-100 break-all bg-slate-900 p-2 rounded border border-slate-800 font-mono">
                            {partyId || <span className="text-slate-500 italic">Not set</span>}
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Set party id..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                        <button
                            onClick={handleSetParty}
                            className="px-3 py-1.5 text-xs rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                        >
                            Save
                        </button>
                    </div>
                    {partyId && (
                        <button
                            onClick={logout}
                            className="mt-3 w-full py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
    );
}
