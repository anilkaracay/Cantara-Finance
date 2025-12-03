import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-primary text-black font-bold hover:bg-primary/90 shadow-[0_0_20px_-5px_var(--color-primary)] hover:shadow-[0_0_25px_-5px_var(--color-primary)] border-none",
        secondary: "bg-surface-highlight text-text-primary border border-border hover:bg-surface-highlight/80 hover:border-primary/30",
        outline: "bg-transparent border border-primary/50 text-primary hover:bg-primary/10",
        ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5",
        danger: "bg-error/10 text-error border border-error/20 hover:bg-error/20",
        glass: "glass text-text-primary hover:bg-white/5 border-border/50",
    };

    const sizes = {
        sm: "h-8 px-4 text-xs rounded-full",
        md: "h-10 px-6 text-sm rounded-full",
        lg: "h-12 px-8 text-base rounded-full",
        icon: "h-10 w-10 p-2 flex items-center justify-center rounded-full",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {children}
        </button>
    );
}
