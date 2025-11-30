import { CantaraDamlConfig } from "@cantara/sdk";
import { BackendConfig } from "../config.js";

export function makeDamlConfigFromBackend(config: BackendConfig, tokenOverride?: string): CantaraDamlConfig {
    return {
        baseUrl: config.damlBaseUrl,
        ledgerId: config.damlLedgerId,
        apiToken: tokenOverride ?? config.damlUserToken,
        timeoutMs: 10_000,
    };
}
