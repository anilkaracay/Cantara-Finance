import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function SlideOver({ isOpen, onClose, title, children, className }: SlideOverProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div
                    className={cn(
                        "w-screen max-w-md transform transition-transform duration-300 ease-in-out glass-panel h-full flex flex-col",
                        className
                    )}
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="relative flex-1 px-6 py-6 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
