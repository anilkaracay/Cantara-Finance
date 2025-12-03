"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, Globe } from "lucide-react";

interface PrivacyModeToggleProps {
    value: "Public" | "Private";
    onChange: (value: "Public" | "Private") => void;
    className?: string;
}

export function PrivacyModeToggle({ value, onChange, className }: PrivacyModeToggleProps) {
    const isPrivate = value === "Private";

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-0.5">
                    Global Privacy Mode
                </span>
                <span className={cn(
                    "text-xs font-bold transition-colors duration-300 flex items-center gap-1.5",
                    isPrivate ? "text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" : "text-text-tertiary"
                )}>
                    {isPrivate ? (
                        <>
                            <Lock className="h-3 w-3" />
                            PRIVATE (RESTRICTED)
                        </>
                    ) : (
                        <>
                            <Globe className="h-3 w-3" />
                            PUBLIC (OPEN)
                        </>
                    )}
                </span>
            </div>

            <button
                onClick={() => onChange(isPrivate ? "Public" : "Private")}
                className={cn(
                    "w-14 h-8 rounded-full relative transition-all duration-500 focus:outline-none shadow-inner border",
                    isPrivate
                        ? "bg-primary/20 border-primary/30 shadow-[0_0_15px_-5px_var(--color-primary)]"
                        : "bg-surface/50 border-border/50"
                )}
            >
                <div className={cn(
                    "absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-500 shadow-lg flex items-center justify-center border",
                    isPrivate
                        ? "translate-x-6 bg-primary text-black border-primary shadow-[0_0_10px_var(--color-primary)]"
                        : "translate-x-0 bg-surface-highlight text-text-tertiary border-border"
                )}>
                    {isPrivate ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </div>
            </button>
        </div>
    );
}
