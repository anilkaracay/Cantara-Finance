import React from 'react';
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'outline' | 'gradient';
    hoverEffect?: boolean;
}

export function Card({ className, variant = 'glass', hoverEffect = false, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl p-6 transition-all duration-300",
                variant === 'glass' && "glass-card",
                variant === 'default' && "bg-surface border border-border",
                variant === 'outline' && "bg-transparent border border-border",
                variant === 'gradient' && "bg-gradient-to-br from-surface-highlight to-surface border border-border/50",
                hoverEffect && "hover:translate-y-[-2px] hover:shadow-lg hover:border-border-hover",
                className
            )}
            {...props}
        />
    );
}
