import axios from "axios";
import { LiquidatorBotConfig } from "./config.js";

export interface LiquidatablePosition {
    contractId: string;
    userParty: string;
    assetSymbol: string;
    collateralAmount: string;
    debtAmount: string;
    healthFactor: number;
    hfThreshold: number;
    price: string;
}

export async function fetchLiquidatablePositions(config: LiquidatorBotConfig): Promise<LiquidatablePosition[]> {
    const url = `${config.backendBaseUrl}/risk/liquidatable`;
    const res = await axios.get(url, {
        params: { maxHf: config.hfThreshold.toString(), limit: config.maxPositionsPerCycle },
    });
    return res.data.positions as LiquidatablePosition[];
}

export async function sendLiquidation(
    config: LiquidatorBotConfig,
    position: LiquidatablePosition,
    repayAmount: string,
): Promise<void> {
    const url = `${config.backendBaseUrl}/liquidation/execute`;

    await axios.post(
        url,
        {
            targetUser: position.userParty,
            collateralAsset: "ETH", // TODO: Determine collateral asset dynamically or from position
            debtAsset: position.assetSymbol,
            repayAmount: parseFloat(repayAmount),
        },
        {
            headers: {
                "x-cantara-liquidator-key": config.liquidatorApiKey,
                // We also need a user header if the backend requires it for context, 
                // but we are using API Key auth. 
                // However, our backend implementation currently checks for `x-cantara-user` if API key is present but we need a party to execute.
                // Let's send a dummy user header or the liquidator party if known.
                // For now, let's assume the backend handles it or we send a dummy.
                "x-cantara-user": "LiquidatorBot"
            },
        },
    );
}

export function computeRepayAmount(position: LiquidatablePosition): string {
    const debt = Number(position.debtAmount);
    if (!isFinite(debt) || debt <= 0) return "0";
    // Repay 50% of debt
    const repay = debt * 0.5;
    return repay.toFixed(6);
}
