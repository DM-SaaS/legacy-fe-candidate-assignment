'use client';

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

const evmNetworks = [
  {
    chainId: 1,
    name: 'Ethereum Mainnet',
    iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    networkId: 1,
    rpcUrls: ['https://cloudflare-eth.com/'],
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  {
    chainId: 11155111,
    name: 'Sepolia',
    iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
    nativeCurrency: {
      decimals: 18,
      name: 'Sepolia Ether',
      symbol: 'ETH',
    },
    networkId: 11155111,
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
  },
  {
    chainId: 8453,
    name: 'Base',
    iconUrls: ['https://app.dynamic.xyz/assets/networks/base.svg'],
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    networkId: 8453,
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org/'],
  },
];

interface DynamicProviderProps {
  children: ReactNode;
}

export function DynamicProvider({ children }: DynamicProviderProps) {
  const environmentId = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;

  if (!environmentId) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 text-red-600">
          ⚠️ Missing Dynamic Environment ID
        </div>
        <div className="text-sm text-gray-600">
          Please add NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID to your .env.local file
        </div>
      </div>
    );
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId,
        walletConnectors: [EthereumWalletConnectors],
        overrides: { evmNetworks },
        
        // Enable email authentication alongside wallet connection
        initialAuthenticationMode: 'connect-and-sign',
        
        // Enable email authentication
        emailAuthenticationEnabled: true,
        
        // Authentication modes - allow both email and wallet
        authModeOrder: ['email', 'wallet'],
        
        // Recommended wallets
        recommendedWallets: [
          { walletKey: 'metamask' },
          { walletKey: 'coinbase' },
          { walletKey: 'walletconnect' },
          { walletKey: 'phantom' },
        ],

        // New to Web3 wallet recommendations
        newToWeb3WalletChainMap: {
          primary_chain: 'evm',
          wallets: {
            evm: 'coinbase'
          },
        },

        // Event handlers
        events: {
          onAuthSuccess: (event) => {
            console.log('User authenticated successfully:', event.user);
          },
          onLogout: () => {
            console.log('User logged out');
          },
          onAuthFailure: (error) => {
            console.error('Authentication failed:', error);
          },
        },

        // Design customization
        cssOverrides: `
          .dynamic-widget-card {
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          
          .dynamic-widget-button {
            border-radius: 8px;
            font-weight: 500;
          }
          
          .dynamic-widget-button--primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
          }
          
          .dynamic-widget-button--primary:hover {
            background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          }
          
          .dynamic-email-input {
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            padding: 12px;
            font-size: 14px;
          }
          
          .dynamic-auth-tab {
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
          }
        `,
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </DynamicContextProvider>
  );
}