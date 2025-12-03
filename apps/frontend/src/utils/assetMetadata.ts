export interface AssetMetadata {
    symbol: string;
    name: string;
    icon: string; // Remote URL or local /public asset
    color: string;
    decimals?: number;
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
    CC: {
        symbol: "CC",
        name: "Canton Coin",
        decimals: 18,
        // Using Chainlink as a visual placeholder for Canton Network (Blue Hexagon/Connectivity)
        // Official Brand Kit: https://www.canton.network/brand-kit-trademark-use
        icon: "https://cryptologos.cc/logos/chainlink-link-logo.png",
        color: "#00B4D8",
    },
    VBILL: {
        symbol: "VBILL",
        name: "VBILL Treasury Bill",
        icon: "/assets/tokens/vbill.svg",
        color: "bg-teal-500/20 text-teal-400"
    },
    HOME: {
        symbol: "HOME",
        name: "Tokenized Home",
        icon: "/assets/tokens/home.svg",
        color: "bg-amber-500/20 text-amber-400"
    },
    REPO: {
        symbol: "REPO",
        name: "Repo Token",
        icon: "/assets/tokens/repo.svg",
        color: "bg-indigo-500/20 text-indigo-400"
    },
    NOTE: {
        symbol: "NOTE",
        name: "Tokenized Note",
        icon: "/assets/tokens/note.svg",
        color: "bg-pink-500/20 text-pink-400"
    },
    USTB: {
        symbol: "USTB",
        name: "US Treasury Bill",
        icon: "/assets/tokens/ustb.svg",
        color: "bg-green-500/20 text-green-400"
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
