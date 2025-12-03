import React from 'react';
import { cn } from "@/lib/utils";

interface SparklineProps {
    data: number[];
    color?: string;
    width?: number;
    height?: number;
    className?: string;
}

export function Sparkline({
    data,
    color = "var(--color-primary)",
    width = 100,
    height = 30,
    className
}: SparklineProps) {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Calculate points
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    // Determine trend color if not specified
    const isPositive = data[data.length - 1] >= data[0];
    const strokeColor = color === "var(--color-primary)"
        ? (isPositive ? "var(--color-success)" : "var(--color-error)")
        : color;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className={cn("overflow-visible", className)}
        >
            <polyline
                points={points}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-80"
            />
            {/* Gradient fill area (optional, simplified for now) */}
        </svg>
    );
}
