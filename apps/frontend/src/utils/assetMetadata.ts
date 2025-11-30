export interface AssetMetadata {
    symbol: string;
    name: string;
    icon: string; // Emoji for now, could be SVG path later
    color: string;
}

export const ASSET_METADATA: Record<string, AssetMetadata> = {
    ETH: {
        symbol: "ETH",
        name: "Ethereum",
        icon: "💎",
        color: "bg-indigo-500/20 text-indigo-400"
    },
    BTC: {
        symbol: "BTC",
        name: "Bitcoin",
        icon: "₿",
        color: "bg-orange-500/20 text-orange-400"
    },
    USDC: {
        symbol: "USDC",
        name: "USD Coin",
        icon: "💵",
        color: "bg-blue-500/20 text-blue-400"
    },
    USTB: {
        symbol: "USTB",
        name: "US Treasury Bill",
        icon: "🏛️",
        color: "bg-green-500/20 text-green-400"
    },
    PAXG: {
        symbol: "PAXG",
        name: "Paxos Gold",
        icon: "🥇",
        color: "bg-yellow-500/20 text-yellow-400"
    },
    CNT: {
        symbol: "CNT",
        name: "Canton Coin",
        icon: "💠",
        color: "bg-cyan-500/20 text-cyan-400"
    }
};

export function getAssetMetadata(symbol: string): AssetMetadata {
    return ASSET_METADATA[symbol] || {
        symbol,
        name: symbol,
        icon: symbol[0],
        color: "bg-slate-800 text-slate-400"
    };
}
