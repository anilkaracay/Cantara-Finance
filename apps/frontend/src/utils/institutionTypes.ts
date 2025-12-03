import { Building2, Landmark, TrendingUp, Home, LineChart, Shield, Umbrella, Globe2 } from "lucide-react";

export type InstitutionType =
    | "commercial-bank"
    | "investment-bank"
    | "asset-manager"
    | "family-office"
    | "hedge-fund"
    | "pension-fund"
    | "insurance"
    | "sovereign-wealth"
    | "other";

export interface InstitutionTypeMetadata {
    type: InstitutionType;
    label: string;
    icon: typeof Building2;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
}

const INSTITUTION_TYPE_MAP: Record<InstitutionType, InstitutionTypeMetadata> = {
    "commercial-bank": {
        type: "commercial-bank",
        label: "Commercial Bank",
        icon: Landmark,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        description: "Traditional banking & lending"
    },
    "investment-bank": {
        type: "investment-bank",
        label: "Investment Bank",
        icon: TrendingUp,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        description: "Capital markets & advisory"
    },
    "asset-manager": {
        type: "asset-manager",
        label: "Asset Manager",
        icon: LineChart,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        description: "Investment management"
    },
    "family-office": {
        type: "family-office",
        label: "Family Office",
        icon: Home,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        description: "Private wealth management"
    },
    "hedge-fund": {
        type: "hedge-fund",
        label: "Hedge Fund",
        icon: TrendingUp,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        description: "Alternative investments"
    },
    "pension-fund": {
        type: "pension-fund",
        label: "Pension Fund",
        icon: Shield,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        description: "Retirement fund management"
    },
    "insurance": {
        type: "insurance",
        label: "Insurance Company",
        icon: Umbrella,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        description: "Insurance & reinsurance"
    },
    "sovereign-wealth": {
        type: "sovereign-wealth",
        label: "Sovereign Wealth Fund",
        icon: Globe2,
        color: "text-primary",
        bgColor: "bg-primary/10",
        borderColor: "border-primary/20",
        description: "Government investment fund"
    },
    "other": {
        type: "other",
        label: "Financial Institution",
        icon: Building2,
        color: "text-text-secondary",
        bgColor: "bg-surface-highlight",
        borderColor: "border-border",
        description: "General financial institution"
    }
};

/**
 * Detects institution type based on institution name or risk profile
 */
export function detectInstitutionType(name: string, riskProfile?: string): InstitutionTypeMetadata {
    const nameLower = name.toLowerCase();

    if (nameLower.includes("commercial") || nameLower.includes("retail bank")) {
        return INSTITUTION_TYPE_MAP["commercial-bank"];
    }
    if (nameLower.includes("investment bank") || nameLower.includes("i-bank")) {
        return INSTITUTION_TYPE_MAP["investment-bank"];
    }
    if (nameLower.includes("asset manag") || nameLower.includes("wealth manag")) {
        return INSTITUTION_TYPE_MAP["asset-manager"];
    }
    if (nameLower.includes("family office")) {
        return INSTITUTION_TYPE_MAP["family-office"];
    }
    if (nameLower.includes("hedge fund") || nameLower.includes("hedge-fund")) {
        return INSTITUTION_TYPE_MAP["hedge-fund"];
    }
    if (nameLower.includes("pension")) {
        return INSTITUTION_TYPE_MAP["pension-fund"];
    }
    if (nameLower.includes("insurance") || nameLower.includes("insurer")) {
        return INSTITUTION_TYPE_MAP["insurance"];
    }
    if (nameLower.includes("sovereign") || nameLower.includes("swf")) {
        return INSTITUTION_TYPE_MAP["sovereign-wealth"];
    }

    // Fallback based on risk profile
    if (riskProfile?.toLowerCase().includes("aaa") || riskProfile?.toLowerCase().includes("conservative")) {
        return INSTITUTION_TYPE_MAP["pension-fund"];
    }
    if (riskProfile?.toLowerCase().includes("aggressive")) {
        return INSTITUTION_TYPE_MAP["hedge-fund"];
    }

    return INSTITUTION_TYPE_MAP["other"];
}

export function getInstitutionTypeMetadata(type: InstitutionType): InstitutionTypeMetadata {
    return INSTITUTION_TYPE_MAP[type] || INSTITUTION_TYPE_MAP["other"];
}

export function getAllInstitutionTypes(): InstitutionTypeMetadata[] {
    return Object.values(INSTITUTION_TYPE_MAP);
}
