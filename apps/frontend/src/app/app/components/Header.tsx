"use client";

import { getMockParty } from "../lib/party";
import { Wallet } from "lucide-react";

export default function Header() {
    const party = getMockParty();

    return (
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0A0E18] px-8">
            <div className="flex items-center gap-4">
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 border border-green-500/20">
                    Canton Devnet
                </span>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                    <Wallet className="h-4 w-4 text-purple-400" />
                    <span className="font-mono text-white/80">{party}</span>
                </div>
            </div>
        </header>
    );
}
