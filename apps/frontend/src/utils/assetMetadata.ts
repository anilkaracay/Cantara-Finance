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
        icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        color: "bg-indigo-500/20 text-indigo-400"
    },
    BTC: {
        symbol: "BTC",
        name: "Bitcoin",
        icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
        color: "bg-orange-500/20 text-orange-400"
    },
    USDC: {
        symbol: "USDC",
        name: "USD Coin",
        icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
        color: "bg-blue-500/20 text-blue-400"
    },
    USTB: {
        symbol: "USTB",
        name: "US Treasury Bill",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Flag_of_the_United_States_%28Pantone%29.svg/1024px-Flag_of_the_United_States_%28Pantone%29.svg.png",
        color: "bg-green-500/20 text-green-400"
    },
    PAXG: {
        symbol: "PAXG",
        name: "Paxos Gold",
        icon: "https://cryptologos.cc/logos/pax-gold-paxg-logo.png",
        color: "bg-yellow-500/20 text-yellow-400"
    },
    CC: {
        symbol: "CC",
        name: "Canton Coin",
        decimals: 18,
        // Using Chainlink as a visual placeholder for Canton Network (Blue Hexagon/Connectivity)
        // Official Brand Kit: https://www.canton.network/brand-kit-trademark-use
        icon: "https://cryptologos.cc/logos/chainlink-link-logo.png",
        color: "#00B4D8",
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
