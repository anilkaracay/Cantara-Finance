import React from "react";

interface AssetIconProps {
    icon: string;
    symbol: string;
    className?: string;
}

export function AssetIcon({ icon, symbol, className = "" }: AssetIconProps) {
    const isUrl = icon.startsWith("http") || icon.startsWith("/");

    if (isUrl) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={icon} alt={`${symbol} icon`} className={`object-contain ${className}`} />;
    }

    return <span className={className}>{icon}</span>;
}
