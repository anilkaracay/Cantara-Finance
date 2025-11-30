import React from 'react';
import { useWallet } from '../hooks/usePortfolio';

export const WalletBalance: React.FC = () => {
    const { data: holdings, isLoading } = useWallet();

    if (isLoading) {
        return <div className="animate-pulse h-10 w-32 bg-gray-700 rounded"></div>;
    }

    if (!holdings || holdings.length === 0) {
        return <div className="text-gray-400 text-sm">Wallet Empty</div>;
    }

    return (
        <div className="flex gap-4">
            {holdings.map((h) => (
                <div key={h.contractId} className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">{h.symbol}</span>
                    <span className="font-mono font-bold">{parseFloat(h.amount).toFixed(4)}</span>
                </div>
            ))}
        </div>
    );
};
