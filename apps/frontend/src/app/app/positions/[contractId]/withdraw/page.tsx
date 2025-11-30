"use client";

import { use } from "react";
import { postWithdraw } from "../../../lib/api";
import ActionForm from "../../../components/ActionForm";

export default function WithdrawPage({ params }: { params: Promise<{ contractId: string }> }) {
    const { contractId } = use(params);

    return (
        <div className="flex h-full flex-col items-center justify-center">
            <ActionForm
                title="Withdraw Collateral"
                submitText="Withdraw"
                onSubmit={(amount, price) => postWithdraw(contractId, amount, price)}
                requiresPrice
            />
        </div>
    );
}
