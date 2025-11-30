"use client";

import { use } from "react";
import { postDeposit } from "../../../lib/api";
import ActionForm from "../../../components/ActionForm";

export default function DepositPage({ params }: { params: Promise<{ contractId: string }> }) {
    const { contractId } = use(params);

    return (
        <div className="flex h-full flex-col items-center justify-center">
            <ActionForm
                title="Deposit Collateral"
                submitText="Deposit"
                onSubmit={(amount) => postDeposit(contractId, amount)}
            />
        </div>
    );
}
