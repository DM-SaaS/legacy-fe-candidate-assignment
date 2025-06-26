import type React from 'react';
import { MessageSquare, Shield } from 'lucide-react';
import { Button, TextArea } from '../core';

interface SignMessageCardProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isWalletSigning: boolean;
}

export const SignMessageCard: React.FC<SignMessageCardProps> = ({
  message,
  onMessageChange,
  onSubmit,
  isLoading,
  isWalletSigning,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign Message</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <TextArea
          label="Message to Sign"
          placeholder="Enter your message to sign..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          rows={4}
          size="md"
          fullWidth
          required
          resize="none"
          helperText="This message will be cryptographically signed with your wallet"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading || isWalletSigning}
          loadingText={isWalletSigning ? 'Signing...' : 'Verifying...'}
          disabled={!message.trim()}
          leftIcon={<Shield className="h-5 w-5" />}
        >
          Sign & Verify
        </Button>
      </form>
    </div>
  );
};
