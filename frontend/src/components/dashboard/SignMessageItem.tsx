import type React from 'react';
import { MessageSquare, Shield, User } from 'lucide-react';
import { Button } from '../core';
import { showToast } from '../../util/showToast';

interface SignedMessage {
  originalMessage: string;
  signedMessage: string;
  signer: string;
}

interface SignedMessageItemProps {
  message: SignedMessage;
  index: number;
}

export const SignedMessageItem: React.FC<SignedMessageItemProps> = ({
  message,
}) => {
  const truncateSignature = (signature: string) => {
    return `${signature.slice(0, 20)}...${signature.slice(-20)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Signature copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy signature', 'error');
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-gray-800">Original Message</span>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <p className="text-gray-700 break-words">{message.originalMessage}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-purple-600" />
            <span className="font-semibold text-gray-800">Signature</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(message.signedMessage)}
              className="ml-auto"
            >
              Copy
            </Button>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <p className="text-gray-700 font-mono text-sm break-all">
              {truncateSignature(message.signedMessage)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-gray-800">Signer</span>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <p className="text-gray-700 break-words">{message.signer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
