import { CantaraDamlConfig } from './config';
import { createDamlClient, DamlClient } from './damlClient';
import { TemplateIds, SupportedAsset, LendingPool, Portfolio, AssetHolding, OraclePrice } from './types';

function getClient(configOrClient: CantaraDamlConfig | DamlClient): DamlClient {
    if (configOrClient instanceof DamlClient) {
        return configOrClient;
    }
    return createDamlClient(configOrClient);
}

export async function getPermissionlessPools(config: CantaraDamlConfig | DamlClient): Promise<LendingPool[]> {
    const client = getClient(config);
    const results = await client.query<{ contractId: string; payload: Omit<LendingPool, "contractId"> }>({
        templateIds: [TemplateIds.LendingPool],
        query: {},
    });
    console.log("SDK getPermissionlessPools - Results:", results.length);
    if (results.length > 0) {
        console.log("SDK getPermissionlessPools - First Result ContractId:", results[0].contractId);
    }
    return results.map((r: { contractId: string; payload: Omit<LendingPool, "contractId"> }) => ({ ...r.payload, contractId: r.contractId }));
}

export async function getPortfolio(config: CantaraDamlConfig | DamlClient, user: string): Promise<Portfolio | null> {
    const client = getClient(config);
    console.log("SDK getPortfolio - Querying for user:", user);
    console.log("SDK getPortfolio - Template ID:", TemplateIds.Portfolio);
    const results = await client.query<{ contractId: string; payload: Portfolio }>({
        templateIds: [TemplateIds.Portfolio],
        query: { user },
    });

    if (results.length === 0) {
        console.log("SDK getPortfolio - No results found");
        return null;
    }
    console.log("SDK getPortfolio - Found results:", results.length);
    return { ...results[0].payload, contractId: results[0].contractId };
}

export async function getAssetHoldings(config: CantaraDamlConfig | DamlClient, userParty: string): Promise<AssetHolding[]> {
    const client = getClient(config);
    const results = await client.query<{ contractId: string; payload: Omit<AssetHolding, "contractId"> }>({
        templateIds: [TemplateIds.AssetHolding],
        query: { owner: userParty },
    });
    return results.map((r: { contractId: string; payload: Omit<AssetHolding, "contractId"> }) => ({ ...r.payload, contractId: r.contractId }));
}

export async function getOraclePrice(config: CantaraDamlConfig | DamlClient, symbol: string): Promise<OraclePrice | null> {
    const client = getClient(config);
    const results = await client.query<{ contractId: string; payload: OraclePrice }>({
        templateIds: [TemplateIds.OraclePrice],
        query: { symbol },
    });

    if (results.length === 0) return null;

    // Sort by lastUpdatedAt descending if multiple found (naive string comparison for ISO dates works)
    results.sort((a: { payload: OraclePrice }, b: { payload: OraclePrice }) => b.payload.lastUpdatedAt.localeCompare(a.payload.lastUpdatedAt));

    return results[0].payload;
}

export async function getAllOracles(config: CantaraDamlConfig | DamlClient): Promise<OraclePrice[]> {
    const client = getClient(config);
    const results = await client.query<{ contractId: string; payload: Omit<OraclePrice, "contractId"> }>({
        templateIds: [TemplateIds.OraclePrice],
        query: {},
    });
    return results.map((r: { contractId: string; payload: Omit<OraclePrice, "contractId"> }) => ({ ...r.payload, contractId: r.contractId }));
}

export async function getAllPortfolios(config: CantaraDamlConfig | DamlClient): Promise<Portfolio[]> {
    const client = getClient(config);
    console.log("SDK getAllPortfolios - Querying all portfolios");
    console.log("SDK getAllPortfolios - Template ID:", TemplateIds.Portfolio);

    // Query all portfolios (admin readAs should give visibility to all)
    const results = await client.query<{ contractId: string; payload: Portfolio }>({
        templateIds: [TemplateIds.Portfolio],
        query: {}, // No filter - get all
    });

    console.log("SDK getAllPortfolios - Found results:", results.length);
    return results.map((r: { contractId: string; payload: Portfolio }) => ({
        ...r.payload,
        contractId: r.contractId
    }));
}
