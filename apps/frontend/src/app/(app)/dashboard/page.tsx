"use client";

import { PoolList } from "@/components/pools/PoolList";
import { PortfolioOverview } from "@/components/positions/PortfolioOverview";
import { WalletBalance } from "@/components/WalletBalance";
import { TransactionHistory } from "@/components/history/TransactionHistory";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { LiquidationPanel } from "@/components/liquidation/LiquidationPanel";
import { PublicLiquidationsBoard } from "@/components/liquidation/PublicLiquidationsBoard";
import { NotificationBanner } from "@/components/notifications/NotificationBanner";

export default function DashboardPage() {
    return (
        <>
            <NotificationBanner />
            <div className="space-y-10 max-w-7xl mx-auto">
                <section id="overview" className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
                        <p className="text-slate-400">
                            Monitor permissionless pools and manage your positions on Cantara.
                        </p>
                    </div>
                    <WalletBalance />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section id="supply" className="space-y-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Supply Markets
                        </h2>
                        <PoolList mode="supply" />
                    </section>

                    <section id="borrow" className="space-y-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Borrow Markets
                        </h2>
                        <PoolList mode="borrow" />
                    </section>
                </div>

                <section id="portfolio" className="space-y-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        My Portfolio
                    </h2>
                    <PortfolioOverview />
                </section>

                <section id="history" className="pt-8 border-t border-slate-800">
                    <TransactionHistory />
                </section>

                <section id="liquidation" className="pt-8 border-t border-slate-800">
                    <LiquidationPanel />
                </section>

                <section id="public-liquidations" className="pt-8 border-t border-slate-800">
                    <PublicLiquidationsBoard />
                </section>

                <section id="admin" className="pt-8 border-t border-slate-800">
                    <AdminPanel />
                </section>
            </div>
        </>
    );
}
