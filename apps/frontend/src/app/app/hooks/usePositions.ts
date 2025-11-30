import useSWR from "swr";
import { getPositions } from "../lib/api";
import { getMockParty } from "../lib/party";

export function usePositions() {
    const party = getMockParty();
    // We pass party to SWR key to re-fetch if party changes (though it's static now)
    const { data, error, isLoading, mutate } = useSWR(["/positions", party], () => getPositions(party));
    return {
        positions: data,
        isLoading,
        isError: error,
        mutate,
    };
}
