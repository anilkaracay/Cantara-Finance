"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, PieChart, Settings, Clock } from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
    { name: "Dashboard", href: "/app", icon: LayoutDashboard },
    { name: "Pools", href: "/app/pools", icon: Layers },
    { name: "Positions", href: "/app/positions", icon: PieChart },
    { name: "History", href: "/app/history", icon: Clock },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r border-white/10 bg-[#0A0E18]">
            <div className="flex h-16 items-center px-6">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Cantara
                </span>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                    isActive ? "text-blue-400" : "text-white/40 group-hover:text-white"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-white/10 p-4">
                <div className="flex items-center px-3 py-2 text-sm font-medium text-white/60">
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                </div>
            </div>
        </div>
    );
}
