import { Toaster } from 'react-hot-toast';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { SolanaWalletConnectors } from '@dynamic-labs/solana';
import { SuiWalletConnectors } from '@dynamic-labs/sui';
import { Navbar } from './components/Navbar';
import { HeadlessAuth } from './components/HeadlessAuth';
import { MessageSigner } from './components/MessageSigner';
import { SignatureHistory } from './components/SignatureHistory';
import { Settings } from './components/Settings';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppProvider } from './contexts/AppContext';
import { useSignatureHistory } from './hooks/useSignatureHistory';
import { useDynamicHeadlessAuth } from './hooks/useDynamicHeadlessAuth';
import { generateSecureId } from './utils';
import { APP_CONFIG } from './constants';
import { dynamicSettings } from './lib/dynamicClient';
import type { SignedMessage } from './types';
import { useState } from 'react';

function AppContent() {
  const { isAuthenticated, emailAddress } = useDynamicHeadlessAuth();
  const [currentPage, setCurrentPage] = useState<'main' | 'settings'>('main');
  const {
    history,
    addSignedMessage,
    updateSignedMessage,
    clearHistory,
    removeMessage,
  } = useSignatureHistory();

  const handleMessageSigned = (message: string, signature: string) => {
    const signedMessage: SignedMessage = {
      id: generateSecureId(),
      message,
      signature,
      signer: null,
      isValid: false,
      timestamp: new Date().toISOString(),
    };

    addSignedMessage(signedMessage);
  };

  
  if (currentPage === 'settings') {
    return <Settings onBack={() => setCurrentPage('main')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onNavigateToSettings={() => setCurrentPage('settings')} />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Web3 Message Signer & Verifier
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {isAuthenticated 
                ? `Authenticated with embedded wallet (${emailAddress})` 
                : 'Authenticate with email to create an embedded wallet'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!isAuthenticated ? (
            <div className="max-w-lg mx-auto">
              <HeadlessAuth />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
                <div className="space-y-6">
                  <MessageSigner onMessageSigned={handleMessageSigned} />
                </div>

      
                <div className="space-y-6">
                  <SignatureHistory
                    history={history}
                    onUpdateMessage={updateSignedMessage}
                    onRemoveMessage={removeMessage}
                    onClearHistory={clearHistory}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-600">
                Web3 Message Signer & Verifier
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Secure message signing with embedded wallet technology
              </p>
            </div>
          </div>
        </div>
      </footer>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: APP_CONFIG.TOAST_DURATION,
          style: {
            background: '#ffffff',
            color: '#374151',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
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
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <DynamicContextProvider
        settings={{
          ...dynamicSettings,
          walletConnectors: [
            EthereumWalletConnectors,
            SolanaWalletConnectors,
            SuiWalletConnectors,
          ],
        }}
      >
        <AppProvider>
          <AppContent />
        </AppProvider>
      </DynamicContextProvider>
    </ErrorBoundary>
  );
}
