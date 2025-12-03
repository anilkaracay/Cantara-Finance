export interface User {
    id: string;
    name: string;
}

export interface Asset {
    symbol: string;
    name: string;
    decimals: number;
}

export * from "./risk";
