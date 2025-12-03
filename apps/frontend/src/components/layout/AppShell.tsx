"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-text-primary font-sans selection:bg-primary/20 selection:text-primary">
            <Sidebar />
            <div className="pl-64 flex flex-col min-h-screen transition-all duration-300">
                <TopBar />
                <main className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}

