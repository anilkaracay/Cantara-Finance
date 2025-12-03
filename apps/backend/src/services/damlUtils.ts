import { CantaraDamlConfig } from "@cantara/sdk";
import { BackendConfig } from "../config.js";
import * as crypto from "crypto";

function base64url(str: string): string {
    return Buffer.from(str).toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function generateUserToken(ledgerId: string, userParty: string): string {
    const header = {
        "alg": "HS256",
        "typ": "JWT"
    };

    const payload = {
        "https://daml.com/ledger-api": {
            "ledgerId": ledgerId,
            "applicationId": "cantara-backend",
            "actAs": [userParty],
            "readAs": [userParty]
        },
        "iat": Math.floor(Date.now() / 1000)
    };

    const encodedHeader = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(payload));

    const secret = "secret"; // Default sandbox secret
    const signature = crypto.createHmac('sha256', secret)
        .update(encodedHeader + "." + encodedPayload)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function makeDamlConfigFromBackend(config: BackendConfig, userPartyOrToken?: string): CantaraDamlConfig {
    let apiToken = config.damlUserToken;

    if (userPartyOrToken) {
        if (userPartyOrToken.startsWith("eyJ")) {
            // It's a token
            apiToken = userPartyOrToken;
        } else {
            // It's a party ID, generate token
            apiToken = generateUserToken(config.damlLedgerId, userPartyOrToken);
        }
    }

    return {
        baseUrl: config.damlBaseUrl,
        ledgerId: config.damlLedgerId,
        apiToken: apiToken,
        timeoutMs: 10_000,
    };
}
