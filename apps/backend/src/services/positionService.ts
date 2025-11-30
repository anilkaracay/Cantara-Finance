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
        const damlConfig = makeDamlConfigFromBackend(config);
        return getPortfolio(damlConfig, userParty);
    }

    static async getClientAssetHoldings(config: BackendConfig, userParty: string) {
        const damlConfig = makeDamlConfigFromBackend(config);
        return getAssetHoldings(damlConfig, userParty);
    }

    static async performDeposit(config: BackendConfig, userParty: string, portfolioCid: string, assetCid: string, poolCid: string, amountStr: string) {
        const damlConfig = makeDamlConfigFromBackend(config);

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
            // Call split
            const splitResult = await split(damlConfig, { assetCid, splitAmount: amountStr });

            console.log("Split result:", JSON.stringify(splitResult));

            // Handle different return formats from JSON API
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

        // Consolidate holdings after deposit (change returned)
        await this.consolidateHoldings(damlConfig, userParty);

        // Log History
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
    }

    static async performWithdraw(config: BackendConfig, userParty: string, portfolioCid: string, symbol: string, amount: string, poolCid: string, oracleCids: string[]) {
        const damlConfig = makeDamlConfigFromBackend(config);
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
        } catch (e: unknown) {
            console.error("Withdraw error:", e);
            const errorString = JSON.stringify(e);
            if (errorString.includes("Insufficient collateral")) {
                throw badRequest("Withdrawal failed: Insufficient collateral. This action would lower your Health Factor below 1.0.");
            }
            throw e;
        }
    }

    static async performBorrow(config: BackendConfig, userParty: string, portfolioCid: string, symbol: string, amount: string, poolCid: string, oracleCids: string[]) {
        const damlConfig = makeDamlConfigFromBackend(config);
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
        } catch (e: unknown) {
            console.error("Borrow error:", e);
            const errorString = JSON.stringify(e);
            if (errorString.includes("Insufficient collateral")) {
                throw badRequest("Borrow failed: Insufficient collateral. This action would lower your Health Factor below 1.0.");
            }
            throw e;
        }
    }

    static async performRepay(config: BackendConfig, userParty: string, portfolioCid: string, assetCid: string, poolCid: string, amountStr: string) {
        const damlConfig = makeDamlConfigFromBackend(config);

        // 1. Fetch all holdings to find the asset and check amount
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

        // 2. If current amount > repay amount, split it
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

        // 3. Repay with the target asset
        const result = await repay(damlConfig, { portfolioCid, assetCid: targetAssetCid, poolCid });

        // Log History
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
