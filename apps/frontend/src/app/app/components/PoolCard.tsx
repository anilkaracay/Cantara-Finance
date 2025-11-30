import Link from "next/link";
import { Pool } from "../lib/types";
import StatBadge from "./StatBadge";

export default function PoolCard({ pool }: { pool: Pool }) {
    const utilization =
        Number(pool.totalDeposits) > 0
            ? (Number(pool.totalBorrows) / Number(pool.totalDeposits)) * 100
            : 0;

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white">{pool.assetSymbol} Pool</h3>
                    <p className="text-sm text-white/40 font-mono">{pool.poolId}</p>
                </div>
                <div className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
                    {pool.railType}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <StatBadge label="Total Deposits" value={pool.totalDeposits} />
                <StatBadge label="Total Borrows" value={pool.totalBorrows} />
                <StatBadge label="Utilization" value={`${utilization.toFixed(2)}%`} />
                <StatBadge label="Base Rate" value={`${(Number(pool.baseRate) * 100).toFixed(2)}%`} />
            </div>

            <Link
                href="/app/positions"
                className="block w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-500 hover:to-purple-500"
            >
                View Positions
            </Link>
        </div>
    );
}
