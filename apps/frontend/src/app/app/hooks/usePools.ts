import useSWR from "swr";
import { getPools } from "../lib/api";

export function usePools() {
    const { data, error, isLoading } = useSWR("/pools/permissionless", getPools);
    return {
        pools: data,
        isLoading,
        isError: error,
    };
}
