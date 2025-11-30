import { getPermissionlessPools } from "@cantara/sdk";
import { BackendConfig } from "../config.js";
import { makeDamlConfigFromBackend } from "./damlUtils.js";

export class PoolService {
    static async listPermissionlessPools(config: BackendConfig) {
        const damlConfig = makeDamlConfigFromBackend(config, config.damlAdminToken);
        return getPermissionlessPools(damlConfig);
    }
}
