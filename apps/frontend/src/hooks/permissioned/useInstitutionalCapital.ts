import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { InstitutionalCapital } from "@cantara/sdk";

export function useInstitutionalCapital() {
    const { get, post } = useApiClient();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["institutional-capital"],
        queryFn: async () => {
            return get<InstitutionalCapital[]>("/permissioned/capital");
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
