'use client';

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { ReactNode } from 'react';

interface DynamicProviderProps {
    children: ReactNode;
}

export default function DynamicProvider({ children }: DynamicProviderProps) {
    const environmentId = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;

    if (!environmentId) {
        throw new Error('Missing Dynamic Environment ID');
    }

    return (
        <DynamicContextProvider
            settings={{
                environmentId,
                walletConnectors: [EthereumWalletConnectors],
                appName: 'Web3 Signature Verifier',
            }}
        >
            {children}
        </DynamicContextProvider>
    );
} 