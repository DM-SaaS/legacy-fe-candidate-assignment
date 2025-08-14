import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Wallet, MessageSquare, Shield, Clock, CheckCircle } from 'lucide-react';

export const WalletRequired: React.FC = () => {
  const { setShowAuthFlow } = useDynamicContext();

  const handleConnect = () => {
    setShowAuthFlow(true);
  };

  return (
    <div className="max-w-4xl mx-auto">

      <div className="card text-center mb-8">
        <div className="w-20 h-20 bg-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Connect Your Wallet to Get Started
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect your Web3 wallet to unlock powerful message signing and verification features. 
            Your wallet enables secure cryptographic operations and maintains your signature history.
          </p>
        </div>

        <button
          onClick={handleConnect}
          className="btn-primary text-lg px-8 py-4 mx-auto"
        >
          <Wallet className="w-5 h-5 mr-3" />
          Connect Wallet
        </button>

        <div className="mt-6 text-sm text-gray-500">
          <p>Supports MetaMask, WalletConnect, Coinbase Wallet, and more</p>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sign Messages</h3>
          <p className="text-gray-600 text-sm">
            Create cryptographically signed messages using your wallet's private key for secure authentication.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Verify Signatures</h3>
          <p className="text-gray-600 text-sm">
            Instantly verify message signatures with on-chain validation and cryptographic proof.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Signature History</h3>
          <p className="text-gray-600 text-sm">
            Track and manage all your signed messages with detailed verification status and timestamps.
          </p>
        </div>
      </div>

      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Secure & Private</h4>
            <p className="text-sm text-blue-700">
              Your private keys never leave your wallet. All signing operations happen locally on your device, 
              ensuring maximum security and privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 