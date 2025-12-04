"use client";

import { useMemo } from "react";
import { useUser } from "@/context/UserContext";

export function useRole() {
    const { role, institutionProfile } = useUser();

    return useMemo(() => ({
        role,
        isUser: role === "user",
        isInstitution: role === "institution",
        institutionProfile,
    }), [role, institutionProfile]);
}


