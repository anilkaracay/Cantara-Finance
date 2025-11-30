"use client";

import { use } from "react";
import { postRepay } from "../../../lib/api";
import ActionForm from "../../../components/ActionForm";

export default function RepayPage({ params }: { params: Promise<{ contractId: string }> }) {
    const { contractId } = use(params);

    return (
        <div className="flex h-full flex-col items-center justify-center">
            <ActionForm
                title="Repay Debt"
                submitText="Repay"
                onSubmit={(amount) => postRepay(contractId, amount)}
            />
        </div>
    );
}
