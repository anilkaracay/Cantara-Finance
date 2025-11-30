import axios, { AxiosInstance } from 'axios';
import { CantaraDamlConfig } from './config';

export interface DamlCreateCommand<T> {
    templateId: string;
    payload: T;
}

export interface DamlExerciseCommand<T> {
    templateId: string;
    contractId: string;
    choice: string;
    argument: T;
}

export interface DamlQueryRequest {
    templateIds: string[];
    query?: Record<string, unknown>;
}

export interface DamlResult<T> {
    result: T;
}

export class DamlClient {
    private axios: AxiosInstance;

    constructor(config: CantaraDamlConfig) {
        this.axios = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeoutMs || 10000,
            headers: {
                'Content-Type': 'application/json',
                ...(config.apiToken ? { Authorization: `Bearer ${config.apiToken}` } : {}),
            },
        });
    }

    async create<TPayload, TCreated>(cmd: DamlCreateCommand<TPayload>): Promise<TCreated> {
        const response = await this.axios.post<DamlResult<TCreated>>('/v1/create', cmd);
        return response.data.result;
    }

    async exercise<TArg, TResult>(cmd: DamlExerciseCommand<TArg>): Promise<TResult> {
        const response = await this.axios.post<DamlResult<TResult>>('/v1/exercise', cmd);
        return response.data.result;
    }

    async query<T>(req: DamlQueryRequest): Promise<T[]> {
        const response = await this.axios.post<DamlResult<T[]>>('/v1/query', req);
        console.log('DAML Query Response:', JSON.stringify(response.data, null, 2));
        return response.data.result;
    }
}

export function createDamlClient(config: CantaraDamlConfig): DamlClient {
    return new DamlClient(config);
}
