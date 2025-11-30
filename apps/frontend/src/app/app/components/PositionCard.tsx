import Link from "next/link";
import { UserPosition } from "../lib/types";
import StatBadge from "./StatBadge";
import { cn } from "../lib/utils";

export default function PositionCard({ position, contractId }: { position: UserPosition; contractId: string }) {
    // Mock price for HF calculation display (backend does real check)
    // In real app, fetch oracle price here or pass it down
    const mockPrice = 2000;
    const collateralVal = Number(position.collateralAmount) * mockPrice;
    const debt = Number(position.debtAmount);
    const threshold = Number(position.riskParams.rpLiquidationThreshold);

    const hf = debt > 0 ? (collateralVal * threshold) / debt : 999;

    const hfColor = hf >= 1.5 ? "text-green-400" : hf >= 1.0 ? "text-yellow-400" : "text-red-400";

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white">{position.assetSymbol} Position</h3>
                    <p className="text-sm text-white/40 font-mono">Pool: {position.poolId}</p>
                </div>
                <div className={cn("text-lg font-mono font-bold", hfColor)}>
                    HF: {hf === 999 ? "∞" : hf.toFixed(2)}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <StatBadge label="Collateral" value={`${position.collateralAmount} ${position.assetSymbol}`} />
                <StatBadge label="Debt" value={`${position.debtAmount} ${position.assetSymbol}`} />
                <StatBadge label="Max LTV" value={`${Number(position.riskParams.rpMaxLtv) * 100}%`} />
                <StatBadge label="Liq. Threshold" value={`${Number(position.riskParams.rpLiquidationThreshold) * 100}%`} />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Link href={`/app/positions/${contractId}/deposit`} className="btn-secondary">Deposit</Link>
                <Link href={`/app/positions/${contractId}/borrow`} className="btn-secondary">Borrow</Link>
                <Link href={`/app/positions/${contractId}/withdraw`} className="btn-secondary">Withdraw</Link>
                <Link href={`/app/positions/${contractId}/repay`} className="btn-secondary">Repay</Link>
            </div>
        </div>
    );
}
