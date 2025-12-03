import { BackendConfig } from "../config.js";
import {
    listPermissionedPools,
    listInstitutionalCapital,
    listPermissionedPositions,
} from "../services/permissionedDaml.js";
import { InstitutionalCapital, PermissionedPosition, LendingPool } from "@cantara/sdk";

export interface PermissionedRiskSummary {
    institutionParty: string;
    totalCapitalSupplied: number;
    totalExposure: number;
    utilizationRate: number;
    activePoolsCount: number;
    activePositionsCount: number;
    generatedAt: string;
}

export async function buildPermissionedRiskSummary(
    config: BackendConfig,
    institutionParty: string
): Promise<PermissionedRiskSummary> {
    // 1. Fetch data in parallel
    const [pools, capitalList, positions] = await Promise.all([
        listPermissionedPools(config, institutionParty),
        listInstitutionalCapital(config, institutionParty),
        listPermissionedPositions(config, institutionParty),
    ]);

    // 2. Calculate Total Capital Supplied
    // Sum of all InstitutionalCapital.suppliedAmount
    const totalCapitalSupplied = capitalList.reduce((sum: number, cap: InstitutionalCapital) => {
        return sum + parseFloat(cap.suppliedAmount);
    }, 0);

    // 3. Calculate Total Exposure
    // Sum of all PermissionedPosition.debtAmount (amount lent out/borrowed by users)
    // Note: UserPosition.debtAmount is what the user owes. From institution perspective, this is exposure/assets.
    const totalExposure = positions.reduce((sum: number, pos: PermissionedPosition) => {
        return sum + parseFloat(pos.debtAmount);
    }, 0);

    // 4. Calculate Utilization Rate
    const utilizationRate = totalCapitalSupplied > 0 ? (totalExposure / totalCapitalSupplied) * 100 : 0;

    return {
        institutionParty,
        totalCapitalSupplied,
        totalExposure,
        utilizationRate,
        activePoolsCount: pools.length,
        activePositionsCount: positions.length,
        generatedAt: new Date().toISOString(),
    };
}
