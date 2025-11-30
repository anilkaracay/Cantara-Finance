"use client";

import { use } from "react";
import { postBorrow } from "../../../lib/api";
import ActionForm from "../../../components/ActionForm";

export default function BorrowPage({ params }: { params: Promise<{ contractId: string }> }) {
    const { contractId } = use(params);

    return (
        <div className="flex h-full flex-col items-center justify-center">
            <ActionForm
                title="Borrow Asset"
                submitText="Borrow"
                onSubmit={(amount, price) => postBorrow(contractId, amount, price)}
                requiresPrice
            />
        </div>
    );
}
