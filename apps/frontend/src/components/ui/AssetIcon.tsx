import React from "react";

interface AssetIconProps {
    icon?: string;
    symbol: string;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function AssetIcon({ icon, symbol, className = "", size = "md" }: AssetIconProps) {
    const sizeStyles = {
        sm: { width: '24px', height: '24px', fontSize: '10px' },
        md: { width: '32px', height: '32px', fontSize: '12px' },
        lg: { width: '48px', height: '48px', fontSize: '16px' },
    };

    // Handle undefined/null icon - return a colored circle with symbol initials
    if (!icon) {
        const symbolColors: Record<string, string> = {
            BTC: "bg-orange-500",
            ETH: "bg-blue-500",
            USDC: "bg-blue-400",
            CC: "bg-purple-500",
            USTB: "bg-green-500",
            VBILL: "bg-teal-500",
            HOME: "bg-amber-500",
            REPO: "bg-indigo-500",
            NOTE: "bg-pink-500",
        };
        const bgColor = symbolColors[symbol] || "bg-gray-500";
        return (
            <div className={`${bgColor} rounded-full flex items-center justify-center text-white font-bold ${className}`}
                style={sizeStyles[size]}>
                {symbol?.slice(0, 2) || "?"}
            </div>
        );
    }

    const isExternalUrl = icon.startsWith("http");
    const isLocalAsset = icon.startsWith("/");

    if (isExternalUrl || isLocalAsset) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={icon} alt={`${symbol} icon`} className={`object-contain ${className}`} style={sizeStyles[size]} />;
    }

    return <span className={className}>{icon}</span>;
}
