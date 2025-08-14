import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Wallet, LogOut, User, Copy, CheckCircle } from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const { 
    primaryWallet, 
    user, 
    setShowAuthFlow, 
    handleLogOut
  } = useDynamicContext();

  const [copied, setCopied] = React.useState(false);

  const handleConnect = () => {
    setShowAuthFlow(true);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (primaryWallet && user) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Wallet Connected</h3>
              <p className="text-sm text-gray-500">Your wallet is successfully connected</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
  
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Wallet className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formatAddress(primaryWallet.address)}
                </p>
                <p className="text-xs text-gray-500">
                  {primaryWallet.connector.name} Wallet
                </p>
              </div>
            </div>
            <button
              onClick={handleLogOut}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Disconnect
            </button>
          </div>


          {primaryWallet.address && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Wallet Address</p>
                <button
                  onClick={() => copyToClipboard(primaryWallet.address)}
                  className="inline-flex items-center text-xs text-accent-600 hover:text-accent-700 transition-colors duration-150"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-mono text-gray-700 break-all">
                  {primaryWallet.address}
                </p>
              </div>
            </div>
          )}

  
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-success-50 rounded-lg border border-success-200">
              <div className="w-6 h-6 bg-success-600 rounded-full flex items-center justify-center mx-auto mb-1">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs font-medium text-success-700">Connected</p>
            </div>
            <div className="text-center p-3 bg-accent-50 rounded-lg border border-accent-200">
              <div className="w-6 h-6 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <p className="text-xs font-medium text-accent-700">Ready to Sign</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card text-center">
      <div className="w-16 h-16 bg-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Wallet className="w-8 h-8 text-white" />
      </div>
      
      <div className="space-y-3 mb-6">
        <h3 className="text-xl font-medium text-gray-900">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600">
          Connect your wallet to start signing messages and verify signatures on the blockchain.
        </p>
      </div>

      <button
        onClick={handleConnect}
        className="btn-primary w-full py-3"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </button>

      <div className="mt-4 text-xs text-gray-500">
        <p>Supports MetaMask, WalletConnect, Coinbase Wallet, and more</p>
      </div>
    </div>
  );
}; 