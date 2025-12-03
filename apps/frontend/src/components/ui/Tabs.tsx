import React from 'react';
import { cn } from "@/lib/utils";

interface TabsProps {
    tabs: { id: string; label: string }[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
    return (
        <div className={cn("flex space-x-1 rounded-xl bg-surface-highlight p-1", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        "w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-primary/50",
                        activeTab === tab.id
                            ? "bg-surface text-primary shadow-sm"
                            : "text-text-secondary hover:bg-white/[0.05] hover:text-white"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
