import { CantaraDamlConfig } from "./config";
import { createDamlClient, DamlClient } from "./damlClient";
import {
    TemplateIds,
    Institution,
    KycVerifiedUser,
    LendingPool,
    UserPosition,
    InstitutionalCapital,
    PermissionedPosition,
} from "./types";

function getClient(configOrClient: CantaraDamlConfig | DamlClient): DamlClient {
    if (configOrClient instanceof DamlClient) {
        return configOrClient;
    }
    return createDamlClient(configOrClient);
}

/**
 * Fetch all registered institutions.
 */
export async function getInstitutions(config: CantaraDamlConfig | DamlClient): Promise<Institution[]> {
    const client = getClient(config);
    const results = await client.query<{ contractId: string; payload: Omit<Institution, "contractId"> }>({
        templateIds: [TemplateIds.Institution],
        query: {},
    });
    return results.map((r: { contractId: string; payload: Omit<Institution, "contractId"> }) => ({ ...r.payload, contractId: r.contractId }));
}

/**
 * Fetch KYC verified users for a specific institution.
 */
export async function getKycVerifiedUsersForInstitution(
    config: CantaraDamlConfig | DamlClient,
    institutionParty: string
): Promise<KycVerifiedUser[]> {
    const client = getClient(config);
    const results = await client.query<{ contractId: string; payload: Omit<KycVerifiedUser, "contractId"> }>({
        templateIds: [TemplateIds.KycVerifiedUser],
        query: { institution: institutionParty },
    });
    return results.map((r: { contractId: string; payload: Omit<KycVerifiedUser, "contractId"> }) => ({ ...r.payload, contractId: r.contractId }));
}

/**
 * Fetch permissioned pools.
 * Optionally filter by owner institution.
 */
export async function getPermissionedPools(
    config: CantaraDamlConfig | DamlClient,
    institutionParty?: string
): Promise<LendingPool[]> {
    const client = getClient(config);
    const queryPayload: any = {
        railType: "Permissioned",
    };

    if (institutionParty) {
        queryPayload.ownerInstitution = institutionParty;
    }

    const results = await client.query<{ contractId: string; payload: Omit<LendingPool, "contractId"> }>({
        templateIds: [TemplateIds.LendingPool],
        query: queryPayload,
    });
    return results.map((r: { contractId: string; payload: Omit<LendingPool, "contractId"> }) => ({ ...r.payload, contractId: r.contractId }));
}

/**
 * Fetch permissioned positions for a user.
 */
export async function getPermissionedPositions(
    config: CantaraDamlConfig | DamlClient,
    userParty: string
): Promise<UserPosition[]> {
    const client = getClient(config);
    const results = await client.query<{ contractId: string; payload: Omit<UserPosition, "contractId"> }>({
        templateIds: [TemplateIds.UserPosition],
        query: {
            user: userParty,
            railType: "Permissioned",
        },
    });
    return results.map((r: { contractId: string; payload: Omit<UserPosition, "contractId"> }) => ({ ...r.payload, contractId: r.contractId }));
}

/**
 * Fetch institutional capital for a specific institution.
 */
export async function getInstitutionalCapital(
    config: CantaraDamlConfig | DamlClient,
    institutionParty: string
): Promise<InstitutionalCapital[]> {
    const client = getClient(config);
    const results = await client.query<{ contractId: string; payload: Omit<InstitutionalCapital, "contractId"> }>({
        templateIds: [TemplateIds.InstitutionalCapital],
        query: { institution: institutionParty },
    });
    return results.map((r: { contractId: string; payload: Omit<InstitutionalCapital, "contractId"> }) => ({ ...r.payload, contractId: r.contractId }));
}

/**
 * Fetch permissioned positions for a specific institution (as owner).
 */
export async function getPermissionedPositionsForInstitution(
    config: CantaraDamlConfig | DamlClient,
    institutionParty: string
): Promise<PermissionedPosition[]> {
    const client = getClient(config);
    const results = await client.query<{ contractId: string; payload: Omit<PermissionedPosition, "contractId"> }>({
        templateIds: [TemplateIds.PermissionedPosition],
        query: { ownerInstitution: institutionParty },
    });
    return results.map((r: { contractId: string; payload: Omit<PermissionedPosition, "contractId"> }) => ({ ...r.payload, contractId: r.contractId }));
}
