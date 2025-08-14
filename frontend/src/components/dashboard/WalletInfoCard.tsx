import type React from 'react';
import { useState } from 'react';
import { Wallet, Copy, CheckCircle } from 'lucide-react';
import { Button } from '../core';
import { showToast } from '../../util/showToast';

interface WalletInfoCardProps {
  walletAddress?: string;
}

export const WalletInfoCard: React.FC<WalletInfoCardProps> = ({
  walletAddress,
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
      showToast('Address copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy address', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Wallet className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Wallet Information</h2>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Primary Wallet Address
            </p>
            <p className="text-lg font-mono text-gray-900">
              {walletAddress
                ? truncateAddress(walletAddress)
                : 'No wallet connected'}
            </p>
          </div>
          {walletAddress && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(walletAddress)}
              leftIcon={
                copiedAddress ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )
              }
            >
              {copiedAddress ? 'Copied!' : 'Copy'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
