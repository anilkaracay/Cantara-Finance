import { Pool, UserPosition } from "./types";
import { getMockParty } from "./party";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

async function fetchAPI<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = {
        "Content-Type": "application/json",
        "x-cantara-user": getMockParty(),
        ...options.headers,
    };

    const response = await fetch(`${BACKEND_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    return response.json();
}

export async function getPools(): Promise<Pool[]> {
    return fetchAPI<Pool[]>("/pools/permissionless");
}

export async function getPositions(party: string): Promise<UserPosition[]> {
    // The backend uses the x-cantara-user header to identify the user, 
    // but we can pass party if needed for other logic. 
    // For now, the header is sufficient for the backend endpoint GET /positions.
    return fetchAPI<UserPosition[]>("/positions");
}

export async function postDeposit(contractId: string, amount: string): Promise<any> {
    return fetchAPI(`/positions/${contractId}/deposit`, {
        method: "POST",
        body: JSON.stringify({ amount }),
    });
}

export async function postWithdraw(contractId: string, amount: string, price: string): Promise<any> {
    return fetchAPI(`/positions/${contractId}/withdraw`, {
        method: "POST",
        body: JSON.stringify({ amount, price }),
    });
}

export async function postBorrow(contractId: string, amount: string, price: string): Promise<any> {
    return fetchAPI(`/positions/${contractId}/borrow`, {
        method: "POST",
        body: JSON.stringify({ amount, price }),
    });
}

export async function postRepay(contractId: string, amount: string): Promise<any> {
    return fetchAPI(`/positions/${contractId}/repay`, {
        method: "POST",
        body: JSON.stringify({ amount }),
    });
}
