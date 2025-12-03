import {
    CantaraDamlConfig,
    getPortfolio,
    getAssetHoldings,
    deposit,
    withdraw,
    borrow,
    repay,
    split,
    merge,
} from "@cantara/sdk";
import axios, { AxiosError } from "axios";
import { BackendConfig } from "../config.js";
import { makeDamlConfigFromBackend } from "./damlUtils.js";
import { internalError, badRequest } from "../errors.js";
import { HistoryService } from "./historyService.js";

interface ExerciseResponse {
    exerciseResult: any;
    events: any[];
    transactionId: string;
}


export class PositionService {
    static async getClientPortfolio(config: BackendConfig, userParty: string) {
        const damlConfig = makeDamlConfigFromBackend(config, userParty);
        return getPortfolio(damlConfig, userParty);
    }

    static async getClientAssetHoldings(config: BackendConfig, userParty: string) {
        const damlConfig = makeDamlConfigFromBackend(config, userParty);
        return getAssetHoldings(damlConfig, userParty);
    }

    static async performDeposit(config: BackendConfig, userParty: string, portfolioCid: string, assetCid: string, poolCid: string, amountStr: string) {
        const damlConfig = makeDamlConfigFromBackend(config, userParty);

        try {
            // 1. Fetch all holdings to find the asset and check amount
            const holdings = await getAssetHoldings(damlConfig, userParty);
            const asset = holdings.find(h => h.contractId === assetCid);

            if (!asset) {
                throw badRequest("Asset not found in wallet");
            }

            const currentAmount = Number(asset.amount);
            const depositAmount = Number(amountStr);

            if (isNaN(depositAmount) || depositAmount <= 0) {
                throw badRequest("Invalid deposit amount");
            }

            if (currentAmount < depositAmount) {
                throw badRequest("Insufficient funds");
            }

            let targetAssetCid = assetCid;

            // 2. If current amount > deposit amount, split it
            if (currentAmount > depositAmount) {
                const splitResult = await split(damlConfig, { assetCid, splitAmount: amountStr });

                console.log("Split result:", JSON.stringify(splitResult));

                if (splitResult?.exerciseResult?._1) {
                    targetAssetCid = splitResult.exerciseResult._1;
                } else if (splitResult && splitResult._1) {
                    targetAssetCid = splitResult._1;
                } else if (Array.isArray(splitResult) && splitResult.length >= 1) {
                    targetAssetCid = splitResult[0];
                } else if (typeof splitResult === 'string') {
                    targetAssetCid = splitResult;
                } else {
                    console.warn("Could not parse split result, using original CID (might fail if not split)", JSON.stringify(splitResult));
                }
            }
            // 3. Deposit the target asset
            const result = await deposit(damlConfig, { portfolioCid, assetCid: targetAssetCid, poolCid });

            await this.consolidateHoldings(damlConfig, userParty);

            try {
                await HistoryService.addEntry({
                    type: 'DEPOSIT',
                    asset: asset.symbol,
                    amount: amountStr,
                    txId: (result as unknown as ExerciseResponse)?.transactionId || 'unknown'
                });
            } catch (e) {
                console.error("Failed to log history:", e);
            }

            return result;
        } catch (error) {
            handleDamlExerciseError("Deposit", error, "Deposit failed: please refresh your wallet and try again.");
        }
    }

    static async performWithdraw(config: BackendConfig, userParty: string, portfolioCid: string, symbol: string, amount: string, poolCid: string, oracleCids: string[]) {
        const damlConfig = makeDamlConfigFromBackend(config, userParty);
        try {
            const result = await withdraw(damlConfig, { portfolioCid, symbol, amount, poolCid, oracleCids });
            // Consolidate holdings after withdraw
            await this.consolidateHoldings(damlConfig, userParty);

            // Log History
            try {
                await HistoryService.addEntry({
                    type: 'WITHDRAW',
                    asset: symbol,
                    amount: amount,
                    txId: (result as unknown as ExerciseResponse)?.transactionId || 'unknown'
                });
            } catch (e) {
                console.error("Failed to log history:", e);
            }

            return result;
        } catch (error: unknown) {
            handleDamlExerciseError("Withdrawal", error, "Withdrawal failed: verify your deposited balance and health factor.");
        }
    }

    static async performBorrow(config: BackendConfig, userParty: string, portfolioCid: string, symbol: string, amount: string, poolCid: string, oracleCids: string[]) {
        const damlConfig = makeDamlConfigFromBackend(config, userParty);
        try {
            const result = await borrow(damlConfig, { portfolioCid, symbol, amount, poolCid, oracleCids });
            // Consolidate holdings after borrow
            await this.consolidateHoldings(damlConfig, userParty);

            // Log History
            try {
                await HistoryService.addEntry({
                    type: 'BORROW',
                    asset: symbol,
                    amount: amount,
                    txId: (result as unknown as ExerciseResponse)?.transactionId || 'unknown'
                });
            } catch (e) {
                console.error("Failed to log history:", e);
            }

            return result;
        } catch (error: unknown) {
            handleDamlExerciseError("Borrow", error, "Borrow failed: add more collateral or reduce existing debt to keep your health factor above 1.0.");
        }
    }

    static async performRepay(config: BackendConfig, userParty: string, portfolioCid: string, assetCid: string, poolCid: string, amountStr: string) {
        const damlConfig = makeDamlConfigFromBackend(config, userParty);

        try {
            const holdings = await getAssetHoldings(damlConfig, userParty);
            const asset = holdings.find(h => h.contractId === assetCid);

            if (!asset) {
                throw badRequest("Asset not found in wallet");
            }

            const currentAmount = Number(asset.amount);
            const repayAmount = Number(amountStr);

            if (isNaN(repayAmount) || repayAmount <= 0) {
                throw badRequest("Invalid repay amount");
            }

            if (currentAmount < repayAmount) {
                throw badRequest("Insufficient funds to repay");
            }

            let targetAssetCid = assetCid;

            if (currentAmount > repayAmount) {
                console.log(`Splitting asset for repay: ${currentAmount} -> ${repayAmount}`);
                const splitResult = await split(damlConfig, { assetCid, splitAmount: amountStr });

                console.log("Split result:", JSON.stringify(splitResult));

                if (splitResult?.exerciseResult?._1) {
                    targetAssetCid = splitResult.exerciseResult._1;
                } else if (splitResult && splitResult._1) {
                    targetAssetCid = splitResult._1;
                } else if (Array.isArray(splitResult) && splitResult.length >= 1) {
                    targetAssetCid = splitResult[0];
                } else if (typeof splitResult === 'string') {
                    targetAssetCid = splitResult;
                } else {
                    console.warn("Could not parse split result for repay", JSON.stringify(splitResult));
                }
            }

            const result = await repay(damlConfig, { portfolioCid, assetCid: targetAssetCid, poolCid });

            try {
                await HistoryService.addEntry({
                    type: 'REPAY',
                    asset: asset.symbol,
                    amount: amountStr,
                    txId: (result as unknown as ExerciseResponse)?.transactionId || 'unknown'
                });
            } catch (e) {
                console.error("Failed to log history:", e);
            }

            return result;
        } catch (error) {
            handleDamlExerciseError("Repay", error, "Repay failed: please check the selected asset and amount.");
        }
    }

    private static async consolidateHoldings(damlConfig: CantaraDamlConfig, userParty: string) {
        try {
            const holdings = await getAssetHoldings(damlConfig, userParty);
            const grouped: Record<string, typeof holdings> = {};

            for (const h of holdings) {
                if (!grouped[h.symbol]) grouped[h.symbol] = [];
                grouped[h.symbol].push(h);
            }

            for (const symbol in grouped) {
                const assets = grouped[symbol];
                if (assets.length > 1) {
                    console.log(`Consolidating ${assets.length} holdings for ${symbol}`);
                    let baseCid = assets[0].contractId;
                    for (let i = 1; i < assets.length; i++) {
                        const otherCid = assets[i].contractId;
                        console.log(`Merging ${otherCid} into ${baseCid}`);
                        const result = await merge(damlConfig, { assetCid: baseCid, otherCid });

                        // Update baseCid for next iteration
                        if (result?.exerciseResult) {
                            baseCid = result.exerciseResult;
                        } else if (typeof result === 'string') {
                            baseCid = result;
                        } else {
                            console.warn("Merge result format unknown, stopping consolidation for", symbol, result);
                            break;
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Error consolidating holdings:", e);
        }
    }
}

const ASSERTION_PREFIX = "assertion failed:";

function normalizeDamlMessage(message: string): string {
    let normalized = message.trim();
    const assertionIndex = normalized.indexOf(ASSERTION_PREFIX);
    if (assertionIndex >= 0) {
        normalized = normalized.slice(assertionIndex + ASSERTION_PREFIX.length).trim();
    }
    if (normalized.startsWith("CommandRejected:")) {
        normalized = normalized.replace("CommandRejected:", "").trim();
    }
    return normalized;
}

function extractDamlErrorMessage(error: unknown): string | null {
    const responseData = getResponseData(error);
    let raw: string | undefined;

    if (responseData !== undefined) {
        if (typeof responseData === "string") {
            try {
                const parsed = JSON.parse(responseData);
                raw = extractMessageFromPayload(parsed) ?? responseData;
            } catch {
                raw = responseData;
            }
        } else if (Array.isArray(responseData?.errors) || typeof responseData === "object") {
            raw = extractMessageFromPayload(responseData);
        } else if (Buffer.isBuffer(responseData)) {
            const text = responseData.toString("utf8");
            try {
                const parsed = JSON.parse(text);
                raw = extractMessageFromPayload(parsed) ?? text;
            } catch {
                raw = text;
            }
        }
    }

    if (!raw && error instanceof Error && error.message) {
        raw = error.message;
    }

    if (!raw) {
        try {
            const serialized = JSON.stringify(error);
            const assertionMatch = serialized.match(/assertion failed:[^"]+/);
            if (assertionMatch) {
                raw = assertionMatch[0];
            } else {
                const detailMatch = serialized.match(/detail":"([^"]+)"/);
                if (detailMatch) {
                    raw = detailMatch[1];
                }
            }
        } catch {
            // ignore
        }
    }

    if (raw && raw.trim() === "Request failed with status code 400") {
        raw = null;
    }

    return raw ? normalizeDamlMessage(raw) : null;
}

function getResponseData(error: unknown): any {
    if (axios.isAxiosError(error) || error instanceof AxiosError) {
        return error.response?.data;
    }
    if (typeof error === "object" && error !== null && "response" in error) {
        // Fallback for non-Axios errors that still follow axios-like shape
        return (error as any).response?.data;
    }
    return undefined;
}

function extractMessageFromPayload(payload: any): string | undefined {
    if (!payload) return undefined;
    if (Array.isArray(payload.errors) && payload.errors.length > 0) {
        return payload.errors[0]?.detail ?? payload.errors[0]?.message;
    }
    if (typeof payload.message === "string") {
        return payload.message;
    }
    if (typeof payload.detail === "string") {
        return payload.detail;
    }
    return undefined;
}

function mapFriendlyMessage(raw: string): string {
    const lower = raw.toLowerCase();

    if (lower.includes("insufficient collateral") || lower.includes("health")) {
        return "Insufficient collateral: this action would push your health factor below the liquidation threshold.";
    }
    if (lower.includes("insufficient deposit")) {
        return "Not enough deposited balance to withdraw that amount.";
    }
    if (lower.includes("insufficient funds")) {
        return "Insufficient wallet balance to execute this action.";
    }
    if (lower.includes("asset owner mismatch")) {
        return "Selected asset is no longer owned by your wallet.";
    }
    if (lower.includes("amount must be positive")) {
        return "Amount must be greater than zero.";
    }

    return raw;
}

function handleDamlExerciseError(action: string, error: unknown, fallback?: string): never {
    const message = extractDamlErrorMessage(error);
    if (message) {
        throw badRequest(`${action} failed: ${mapFriendlyMessage(message)}`);
    }
    const fallbackMessage = fallback ?? `${action} failed due to an unexpected ledger error. Please try again.`;
    throw badRequest(fallbackMessage);
}
