import {
    CantaraDamlConfig,
    getInstitutions,
    getKycVerifiedUsersForInstitution,
    getPermissionedPools,
    getPermissionedPositions,
    createPermissionedPosition,
    getInstitutionalCapital,
    getPermissionedPositionsForInstitution,
    depositInstitutionalCapital,
    withdrawInstitutionalCapital,
    Institution,
    KycVerifiedUser,
    LendingPool,
    UserPosition,
} from "@cantara/sdk";
import { BackendConfig } from "../config.js";

function makeDamlConfigForInstitution(config: BackendConfig, overrideToken?: string): CantaraDamlConfig {
    const apiToken = overrideToken ?? config.damlInstitutionToken ?? config.damlAdminToken;
    if (!apiToken) {
        throw new Error("Permissioned rail requires CANTARA_DAML_INSTITUTION_TOKEN to be set.");
    }
    return {
        baseUrl: config.damlBaseUrl,
        ledgerId: config.damlLedgerId,
        apiToken,
        timeoutMs: 10_000,
    };
}

function makeDamlConfigForUser(config: BackendConfig, userToken?: string): CantaraDamlConfig {
    // In a real app, we'd exchange the user's JWT for a DAML token or use a service token acting on behalf of the user.
    // For sandbox, we use the shared user token or the one passed in.
    const apiToken = userToken ?? config.damlUserToken;
    return {
        baseUrl: config.damlBaseUrl,
        ledgerId: config.damlLedgerId,
        apiToken,
        timeoutMs: 10_000,
    };
}

export async function listInstitutions(config: BackendConfig): Promise<Institution[]> {
    const damlConfig = makeDamlConfigForInstitution(config);
    return getInstitutions(damlConfig);
}

export async function listKycUsersForInstitution(
    config: BackendConfig,
    institutionParty: string
): Promise<KycVerifiedUser[]> {
    const damlConfig = makeDamlConfigForInstitution(config);
    return getKycVerifiedUsersForInstitution(damlConfig, institutionParty);
}

export async function listPermissionedPools(
    config: BackendConfig,
    institutionParty?: string
): Promise<LendingPool[]> {
    // Pools can be viewed by users too, but let's use institution token for broader visibility if available,
    // or fallback to user token if institution token is missing (though permissioned pools might be visible to public).
    // For now, assume institution token is needed to see "all" or specific institution details.
    // If called by user, we might want to use user token.
    // Let's stick to institution token for "listing" as it's safer for now.
    const damlConfig = makeDamlConfigForInstitution(config);
    return getPermissionedPools(damlConfig, institutionParty);
}

export async function listPermissionedPositionsForUser(
    config: BackendConfig,
    userParty: string
): Promise<UserPosition[]> {
    // User views their own positions.
    const damlConfig = makeDamlConfigForUser(config);
    return getPermissionedPositions(damlConfig, userParty);
}

export async function createPermissionedUserPosition(
    config: BackendConfig,
    params: {
        userParty: string;
        institutionParty: string;
        poolId: string;
        assetSymbol: string;
        riskParams: any; // Pass through risk params
        now: string; // ISO string
        kycVerifiedInput: boolean;
        factoryContractId: string; // We need to find the factory first
        visibility: "Public" | "Private";
    }
): Promise<string> {
    const damlConfig = makeDamlConfigForInstitution(config);
    return createPermissionedPosition(damlConfig, {
        factoryContractId: params.factoryContractId,
        user: params.userParty,
        poolId: params.poolId,
        assetSymbol: params.assetSymbol,
        institution: params.institutionParty,
        riskParams: params.riskParams,
        now: params.now,
        kycVerifiedInput: params.kycVerifiedInput,
        visibility: params.visibility,
    });
}

export async function listInstitutionalCapital(config: BackendConfig, institutionParty: string) {
    const damlConfig = makeDamlConfigForInstitution(config);
    return getInstitutionalCapital(damlConfig, institutionParty);
}

export async function listPermissionedPositions(config: BackendConfig, institutionParty: string) {
    const damlConfig = makeDamlConfigForInstitution(config);
    return getPermissionedPositionsForInstitution(damlConfig, institutionParty);
}

export async function performInstitutionCapitalDeposit(
    config: BackendConfig,
    contractId: string,
    amount: string,
    now: string
) {
    const damlConfig = makeDamlConfigForInstitution(config);
    return depositInstitutionalCapital(damlConfig, { contractId, amount, now });
}

export async function performInstitutionCapitalWithdraw(
    config: BackendConfig,
    contractId: string,
    amount: string,
    now: string
) {
    const damlConfig = makeDamlConfigForInstitution(config);
    return withdrawInstitutionalCapital(damlConfig, { contractId, amount, now });
}
