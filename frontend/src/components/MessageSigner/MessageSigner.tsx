import React, { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Textarea } from '../UI/Textarea';
import { SignatureResult } from './SignatureResult';
import { useSignatureHistory } from '../../hooks/useSignatureHistory';
import { api } from '../../lib/api';
import { MAX_MESSAGE_LENGTH, MESSAGES } from '../../lib/constants';
import toast from 'react-hot-toast';
import { PenTool, CheckCircle, XCircle } from 'lucide-react';

interface FormData {
  message: string;
}

export const MessageSigner: React.FC = () => {
  const { primaryWallet } = useDynamicContext();
  const { addToHistory, updateVerificationStatus } = useSignatureHistory();
  const [signedData, setSignedData] = useState<{
    message: string;
    signature: string;
    historyId: string;
  } | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const message = watch('message', '');

  // Mutation for verifying signature
  const verifyMutation = useMutation({
    mutationFn: api.verifySignature,
    onSuccess: (data, variables) => {
      if (data.isValid) {
        toast.success(MESSAGES.VERIFY_SUCCESS);
        if (signedData?.historyId) {
          updateVerificationStatus(signedData.historyId, true);
        }
      } else {
        toast.error(MESSAGES.VERIFY_FAILED);
      }
      setVerificationResult(data);
    },
    onError: (error: Error) => {
      toast.error(error.message || MESSAGES.NETWORK_ERROR);
    },
  });

  const handleSign = async (data: FormData) => {
    if (!primaryWallet) {
      toast.error(MESSAGES.WALLET_NOT_CONNECTED);
      return;
    }

    try {
      // Sign the message
      const signature = await primaryWallet.signMessage(data.message);

      if (!signature) {
        throw new Error('Failed to sign message');
      }

      // Add to history
      const historyItem = addToHistory(
        data.message,
        signature,
        primaryWallet.address
      );

      toast.success(MESSAGES.SIGN_SUCCESS);

      // Store signed data
      const newSignedData = {
        message: data.message,
        signature,
        historyId: historyItem.id,
      };
      setSignedData(newSignedData);

      // Automatically verify the signature
      verifyMutation.mutate({
        message: data.message,
        signature,
      });
    } catch (error: any) {
      console.error('Signing error:', error);
      toast.error(error.message || 'Failed to sign message');
    }
  };

  const handleNewMessage = () => {
    reset();
    setSignedData(null);
    setVerificationResult(null);
  };

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Message Signer
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign custom messages with your wallet
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleSign)} className="space-y-4">
          <div>
            <Textarea
              {...register('message', {
                required: 'Message is required',
                maxLength: {
                  value: MAX_MESSAGE_LENGTH,
                  message: `Message must be less than ${MAX_MESSAGE_LENGTH} characters`,
                },
              })}
              label="Message to Sign"
              placeholder="Enter your message here..."
              rows={5}
              error={errors.message?.message}
              disabled={!!signedData}
            />
            <div className="mt-1 text-sm text-gray-500 text-right">
              {message.length} / {MAX_MESSAGE_LENGTH}
            </div>
          </div>

          {!signedData ? (
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!message.trim()}
            >
              <PenTool className="w-5 h-5 mr-2" />
              Sign Message
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNewMessage}
              size="lg"
              variant="secondary"
              className="w-full"
            >
              Sign New Message
            </Button>
          )}
        </form>
      </Card>

      {signedData && (
        <SignatureResult
          signature={signedData.signature}
          verificationResult={verificationResult}
          isVerifying={verifyMutation.isPending}
        />
      )}
    </div>
  );
};
