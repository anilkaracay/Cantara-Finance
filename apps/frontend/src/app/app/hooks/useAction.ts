import { useState } from "react";

interface ActionState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

export function useAction<T>(actionFn: (...args: any[]) => Promise<T>) {
    const [state, setState] = useState<ActionState>({
        isLoading: false,
        error: null,
        success: false,
    });

    const execute = async (...args: any[]) => {
        setState({ isLoading: true, error: null, success: false });
        try {
            const result = await actionFn(...args);
            setState({ isLoading: false, error: null, success: true });
            return result;
        } catch (err: any) {
            setState({ isLoading: false, error: err.message || "Action failed", success: false });
            throw err;
        }
    };

    return { ...state, execute, reset: () => setState({ isLoading: false, error: null, success: false }) };
}
