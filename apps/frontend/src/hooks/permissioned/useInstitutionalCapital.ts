import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { InstitutionalCapital } from "@cantara/sdk";

interface CapitalOptions {
    privacyOverride?: "Public" | "Private";
}

export function useInstitutionalCapital(options?: CapitalOptions) {
    const { get, post } = useApiClient();
    const queryClient = useQueryClient();
    const privacyOverride = options?.privacyOverride;

    const query = useQuery({
        queryKey: ["institutional-capital", privacyOverride ?? "session"],
        queryFn: async () => {
            const params = privacyOverride ? `?privacy=${privacyOverride.toLowerCase()}` : "";
            return get<InstitutionalCapital[]>(`/permissioned/capital${params}`);
        }
    });

    const deposit = useMutation({
        mutationFn: async ({ contractId, amount }: { contractId: string; amount: string }) => {
            return post(`/permissioned/capital/${contractId}/deposit`, { amount });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["institutional-capital"] });
            queryClient.invalidateQueries({ queryKey: ["permissioned-pools"] });
        }
    });

    const withdraw = useMutation({
        mutationFn: async ({ contractId, amount }: { contractId: string; amount: string }) => {
            return post(`/permissioned/capital/${contractId}/withdraw`, { amount });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["institutional-capital"] });
            queryClient.invalidateQueries({ queryKey: ["permissioned-pools"] });
        }
    });

    return {
        ...query,
        deposit,
        withdraw
    };
}
