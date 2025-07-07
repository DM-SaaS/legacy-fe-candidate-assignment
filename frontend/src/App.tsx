import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { Header } from './components/Layout/Header';
import { AuthGuard } from './components/Auth/AuthGuard';
import { MessageSigner } from './components/MessageSigner/MessageSigner';
import { HistoryPanel } from './components/History/HistoryPanel';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId:
          import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || 'YOUR_ENVIRONMENT_ID',
        walletConnectors: [EthereumWalletConnectors],
        initialAuthenticationMode: 'email',
        appName: 'Web3 Message Signer',
        appLogoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=web3signer',
      }}
    >
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-colors">
          <Header />

          <main className="container mx-auto px-4 py-8">
            <AuthGuard>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <MessageSigner />
                </div>
                <div className="lg:col-span-1">
                  <HistoryPanel />
                </div>
              </div>
            </AuthGuard>
          </main>

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </QueryClientProvider>
    </DynamicContextProvider>
  );
}

export default App;
