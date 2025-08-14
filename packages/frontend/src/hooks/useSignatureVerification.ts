import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';
import { VALIDATION_MESSAGES } from '../constants';
import type { SignedMessage } from '../types';

export const useSignatureVerification = () => {
  const [verifyingIds, setVerifyingIds] = useState<Set<string>>(new Set());

  const verifySignature = useCallback(async (
    message: SignedMessage,
    onUpdate: (id: string, updates: Partial<SignedMessage>) => void
  ) => {
    if (verifyingIds.has(message.id)) return;

    setVerifyingIds(prev => new Set(prev).add(message.id));

    try {
      const response = await apiService.verifySignature({
        message: message.message,
        signature: message.signature,
      });

      if (response.success && response.data) {
        onUpdate(message.id, {
          isValid: response.data.isValid,
          signer: response.data.signer,
          verificationResult: response.data,
        });

        toast.success(
          response.data.isValid
            ? 'Signature verified successfully!'
            : 'Signature verification failed'
        );
      } else {
        toast.error(VALIDATION_MESSAGES.SIGNATURE_VERIFICATION_FAILED);
      }
    } catch (error) {
      toast.error(VALIDATION_MESSAGES.SIGNATURE_VERIFICATION_FAILED);
    } finally {
      setVerifyingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(message.id);
        return newSet;
      });
    }
  }, [verifyingIds]);

  const isVerifying = useCallback((id: string) => verifyingIds.has(id), [verifyingIds]);

  return { verifySignature, isVerifying };
}; 