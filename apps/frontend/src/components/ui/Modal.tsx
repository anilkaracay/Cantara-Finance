import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div
                className={cn(
                    "relative w-full max-w-lg transform rounded-xl bg-surface border border-border p-6 shadow-2xl transition-all glass-card",
                    className
                )}
            >
                <div className="flex items-center justify-between mb-4">
                    {title && <h3 className="text-lg font-semibold text-text-primary">{title}</h3>}
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
