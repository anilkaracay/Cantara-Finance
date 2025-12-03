"use client";

import { useState, useRef, useEffect } from "react";
import { Institution } from "@cantara/sdk";
import { detectInstitutionType } from "@/utils/institutionTypes";
import { ChevronDown, Check, Search, Building2, MapPin, Shield, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface InstitutionSelectorProps {
    institutions: Institution[];
    value: string | null;
    onChange: (institutionId: string | null) => void;
}

export function InstitutionSelector({ institutions, value, onChange }: InstitutionSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    const selectedInstitution = institutions.find(i => i.institution === value);

    const filteredInstitutions = institutions.filter(inst =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-300",
                    "bg-surface-highlight border border-border",
                    "hover:bg-surface-highlight/80 hover:border-primary/30",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    isOpen && "border-primary/50 ring-2 ring-primary/20"
                )}
            >
                {selectedInstitution ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <InstitutionIcon institution={selectedInstitution} />
                        <div className="flex flex-col items-start flex-1 min-w-0">
                            <span className="text-text-primary font-semibold truncate w-full text-left">
                                {selectedInstitution.name}
                            </span>
                            <span className="text-[9px] text-text-tertiary uppercase tracking-wider">
                                {detectInstitutionType(selectedInstitution.name, selectedInstitution.riskProfile).label}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-text-tertiary" />
                        <span className="text-text-tertiary">Select Institution...</span>
                    </div>
                )}
                <ChevronDown className={cn(
                    "h-3.5 w-3.5 text-text-tertiary transition-transform duration-300",
                    isOpen && "rotate-180"
                )} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 z-50 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {/* Search */}
                    <div className="p-2 border-b border-border/50">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="Search institutions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 text-xs bg-surface-highlight border border-border/50 rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Institution List */}
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {filteredInstitutions.length === 0 ? (
                            <div className="p-4 text-center text-xs text-text-tertiary">
                                No institutions found
                            </div>
                        ) : (
                            filteredInstitutions.map((institution) => {
                                const isSelected = institution.institution === value;
                                const typeMetadata = detectInstitutionType(institution.name, institution.riskProfile);
                                const TypeIcon = typeMetadata.icon;

                                return (
                                    <button
                                        key={institution.contractId}
                                        type="button"
                                        onClick={() => {
                                            onChange(institution.institution);
                                            setIsOpen(false);
                                            setSearchQuery("");
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200",
                                            "hover:bg-surface-highlight",
                                            isSelected && "bg-primary/5 border-l-2 border-l-primary"
                                        )}
                                    >
                                        {/* Icon */}
                                        <div className={cn(
                                            "flex h-9 w-9 items-center justify-center rounded-lg border shadow-sm transition-all shrink-0",
                                            typeMetadata.bgColor,
                                            typeMetadata.borderColor
                                        )}>
                                            <TypeIcon className={cn("h-4 w-4", typeMetadata.color)} />
                                        </div>

                                        {/* Institution Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-sm font-semibold text-text-primary truncate">
                                                    {institution.name}
                                                </span>
                                                {institution.visibility === "Private" && (
                                                    <Lock className="h-3 w-3 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-text-tertiary">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-2.5 w-2.5" />
                                                    <span>{institution.country}</span>
                                                </div>
                                                <span className="text-border">•</span>
                                                <div className="flex items-center gap-1">
                                                    <Shield className="h-2.5 w-2.5" />
                                                    <span>{institution.riskProfile}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Selection Indicator */}
                                        {isSelected && (
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 shrink-0">
                                                <Check className="h-3 w-3 text-primary" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Footer Info */}
                    {filteredInstitutions.length > 0 && (
                        <div className="px-3 py-2 border-t border-border/50 bg-surface-highlight/30">
                            <div className="flex items-center justify-between text-[9px] text-text-tertiary uppercase tracking-wider">
                                <span>{filteredInstitutions.length} Institution{filteredInstitutions.length !== 1 ? 's' : ''}</span>
                                <div className="flex items-center gap-1">
                                    <Globe className="h-2.5 w-2.5" />
                                    <span>Canton Network</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function InstitutionIcon({ institution }: { institution: Institution }) {
    const typeMetadata = detectInstitutionType(institution.name, institution.riskProfile);
    const Icon = typeMetadata.icon;

    return (
        <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border shadow-sm shrink-0",
            typeMetadata.bgColor,
            typeMetadata.borderColor
        )}>
            <Icon className={cn("h-4 w-4", typeMetadata.color)} />
        </div>
    );
}
