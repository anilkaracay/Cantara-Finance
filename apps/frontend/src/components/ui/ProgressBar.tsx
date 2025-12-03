import React from 'react';
import { cn } from "@/lib/utils";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient';
}

export function ProgressBar({
    value,
    max = 100,
    variant = 'default',
    className,
    ...props
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
        default: "bg-primary",
        success: "bg-success",
        warning: "bg-warning",
        error: "bg-error",
        gradient: "bg-gradient-to-r from-primary to-secondary",
    };

    return (
        <div
            className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-highlight border border-white/5", className)}
            {...props}
        >
            <div
                className={cn("h-full transition-all duration-500 ease-in-out", variants[variant])}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
