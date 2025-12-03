import React from 'react';
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    className?: string;
    loading?: boolean;
    icon?: React.ReactNode;
    footer?: React.ReactNode;
    tooltip?: string;
}

export function MetricCard({
    title,
    value,
    subValue,
    trend,
    trendValue,
    className,
    loading,
    icon,
    footer,
    tooltip
}: MetricCardProps) {
    return (
        <Card variant="glass" hoverEffect className={cn("flex flex-col justify-between relative overflow-hidden group", className)}>
            {/* Background Glow Effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

            <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-secondary">{title}</p>
                    {tooltip && (
                        <div className="group/tooltip relative">
                            <span className="text-xs text-text-tertiary cursor-help">ⓘ</span>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-surface-highlight border border-border rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {tooltip}
                            </div>
                        </div>
                    )}
                </div>
                {icon && <div className="text-primary/80 p-1.5 bg-primary/10 rounded-lg">{icon}</div>}
            </div>

            <div className="space-y-1 relative z-10">
                {loading ? (
                    <div className="h-8 w-32 bg-surface-highlight animate-pulse rounded" />
                ) : (
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-text-primary tracking-tight">{value}</h3>
                        {subValue && <span className="text-sm text-text-tertiary font-medium">{subValue}</span>}
                    </div>
                )}

                {(trend || trendValue) && (
                    <div className="flex items-center gap-2 mt-1">
                        {trend && (
                            <span className={cn(
                                "text-xs font-bold px-1.5 py-0.5 rounded-full",
                                trend === 'up' ? "bg-success/10 text-success" :
                                    trend === 'down' ? "bg-error/10 text-error" :
                                        "bg-surface-highlight text-text-secondary"
                            )}>
                                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '•'}
                            </span>
                        )}
                        {trendValue && (
                            <span className={cn(
                                "text-xs font-medium",
                                trend === 'up' ? "text-success" :
                                    trend === 'down' ? "text-error" :
                                        "text-text-secondary"
                            )}>
                                {trendValue}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {footer && <div className="mt-4 pt-4 border-t border-border/30 relative z-10">{footer}</div>}
        </Card>
    );
}
