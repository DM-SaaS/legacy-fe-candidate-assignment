import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, Send, Shield, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { APP_CONFIG, VALIDATION_MESSAGES, UI_TEXT } from '../constants';
import { formatAddress, sanitizeMessage, truncateText } from '../utils';
import { useDynamicHeadlessAuth } from '../hooks/useDynamicHeadlessAuth';
import { useMfaAuth } from '../hooks/useMfaAuth';
import { MfaModal } from './MfaModal';

const messageSchema = z.object({
  message: z
    .string()
    .min(1, VALIDATION_MESSAGES.MESSAGE_REQUIRED)
    .max(APP_CONFIG.MESSAGE_MAX_LENGTH, VALIDATION_MESSAGES.MESSAGE_TOO_LONG)
    .refine(
      (msg) => msg.trim().length > 0,
      VALIDATION_MESSAGES.MESSAGE_WHITESPACE_ONLY
    ),
});

type MessageForm = z.infer<typeof messageSchema>;

interface MessageSignerProps {
  onMessageSigned: (message: string, signature: string) => void;
}

export const MessageSigner: React.FC<MessageSignerProps> = ({ onMessageSigned }) => {
  const { wallet, logout } = useDynamicHeadlessAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  
  const {
    requireMfaForAction,
    showMfaModal,
    setShowMfaModal,
    hasMfaSession,
  } = useMfaAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: '',
    },
  });

  const messageValue = watch('message');
  const charCount = messageValue?.length || 0;

  const performSigning = async (message: string) => {
    if (!wallet || !wallet.signMessage) {
      toast.error(VALIDATION_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    setIsLoading(true);
    try {
      const sanitized = sanitizeMessage(message.trim());
      
      const signature = await wallet.signMessage(sanitized);
      
      toast.success('Message signed successfully!');
      
      onMessageSigned(sanitized, signature || '');
      reset();
      setPendingMessage(null);
    } catch (error) {
      console.error('Message signing error:', error);
      
      // Handle common wallet connection issues
      if (error instanceof Error) {
        if (error.message.includes('Room not found')) {
          toast.error('Wallet session expired. Please sign out and back in to continue.', {
            duration: 6000,
          });
          setTimeout(() => {
            logout();
          }, 3000);
        } else if (error.message.includes('network') || error.message.includes('Network')) {
          toast.error('Network connection issue. Please check your connection and try again.');
        } else if (error.message.includes('WaaS') || error.message.includes('Dynamic')) {
          toast.error('Wallet service error. Please try signing out and back in.');
        } else {
          toast.error(`Signing failed: ${error.message}`);
        }
      } else {
        toast.error('Failed to sign message. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: MessageForm) => {
    if (!wallet || !wallet.signMessage) {
      toast.error(VALIDATION_MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    if (!data.message) {
      toast.error(VALIDATION_MESSAGES.MESSAGE_REQUIRED);
      return;
    }

    const message = data.message.trim();
    
    // Require MFA before any message signing
    const mfaValid = await requireMfaForAction();
    
    if (!mfaValid) {
      setPendingMessage(message);
      return;
    }

    await performSigning(message);
  };

  const handleMfaSuccess = async () => {
    setShowMfaModal(false);
    
    if (pendingMessage) {
      await performSigning(pendingMessage);
    }
  };

  const handleMfaCancel = () => {
    setShowMfaModal(false);
    setPendingMessage(null);
  };

  const handleWalletRefresh = () => {
    toast('Refreshing wallet connection...', { icon: '🔄' });
    logout();
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {UI_TEXT.SIGN_MESSAGE}
              </h2>
              <p className="text-sm text-gray-600">
                Enter a custom message to sign with your connected wallet
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message to Sign
            </label>
            <div className="relative">
              <textarea
                {...register('message')}
                id="message"
                placeholder="Enter your message here..."
                className={`input min-h-[120px] resize-y ${
                  errors.message ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                } ${isLoading ? 'opacity-50' : ''}`}
                disabled={isLoading}
              />
              <div className={`absolute bottom-2 right-3 text-xs px-2 py-1 rounded ${
                charCount > APP_CONFIG.CHARACTER_WARNING_THRESHOLD 
                  ? 'text-error-600 bg-error-50' 
                  : 'text-gray-500 bg-gray-100'
              }`}>
                {charCount}/{APP_CONFIG.MESSAGE_MAX_LENGTH}
              </div>
            </div>
            {errors.message && (
              <div className="mt-2 p-3 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-sm text-error-600">
                  {errors.message.message}
                </p>
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-accent-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Signing with wallet</p>
                  <p className="text-sm font-mono text-gray-900">
                    {wallet?.address ? formatAddress(wallet.address) : 'Unknown'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleWalletRefresh}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Refresh wallet connection"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                hasMfaSession ? 'bg-green-600' : 'bg-blue-600'
              }`}>
                <Shield className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-700 font-medium">
                  {hasMfaSession ? 'MFA Authenticated' : 'MFA Required'}
                </p>
                <p className="text-sm text-blue-600">
                  {hasMfaSession 
                    ? 'Multi-factor authentication is active for message signing' 
                    : 'You will be prompted for multi-factor authentication before signing'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {messageValue && messageValue.trim() && (
              <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <p className="text-sm text-gray-700 truncate">
                  {truncateText(messageValue, APP_CONFIG.MESSAGE_PREVIEW_LENGTH)}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              className={`btn-primary px-6 py-3 ${isLoading ? 'opacity-50' : ''}`}
              disabled={isLoading || charCount === 0}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {UI_TEXT.SIGN_MESSAGE}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <MfaModal
        isOpen={showMfaModal}
        onClose={handleMfaCancel}
        onSuccess={handleMfaSuccess}
        title="Verify Identity to Sign Message"
        description="Multi-factor authentication is required before signing messages with your wallet."
      />
    </>
  );
}; 