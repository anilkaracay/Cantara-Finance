import { cn } from "../lib/utils";

interface StatBadgeProps {
    label: string;
    value: string | number;
    className?: string;
}

export default function StatBadge({ label, value, className }: StatBadgeProps) {
    return (
        <div className={cn("flex flex-col", className)}>
            <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
            <span className="text-lg font-semibold text-white">{value}</span>
        </div>
    );
}
