'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useCallback, useState } from 'react';

export interface SignedMessage {
  id: string;
  message: string;
  signature: string;
  signer: string;
  timestamp: number;
  isValid?: boolean;
  verificationResult?: {
    isValid: boolean;
    signer: string;
    originalMessage: string;
  };
}

export function useDynamicAuth() {
  const { 
    primaryWallet, 
    user, 
    handleLogOut,
    sdkHasLoaded 
  } = useDynamicContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = Boolean(user && primaryWallet);
  const walletAddress = primaryWallet?.address;
  const walletConnector = primaryWallet?.connector;

  const signMessage = useCallback(async (message: string): Promise<string | null> => {
    if (!primaryWallet || !message.trim()) {
      throw new Error('No wallet connected or empty message');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Sign the message using the primary wallet
      const signature = await primaryWallet.signMessage(message);
      
      if (!signature) {
        throw new Error('Failed to sign message');
      }

      return signature;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign message';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [primaryWallet]);

  const verifySignature = useCallback(async (
    message: string, 
    signature: string
  ): Promise<{
    isValid: boolean;
    signer: string;
    originalMessage: string;
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/server/verify-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          signature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Verification failed');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signAndVerifyMessage = useCallback(async (message: string): Promise<SignedMessage> => {
    if (!primaryWallet) {
      throw new Error('No wallet connected');
    }

    const signature = await signMessage(message);
    if (!signature) {
      throw new Error('Failed to sign message');
    }

    const verificationResult = await verifySignature(message, signature);

    const signedMessage: SignedMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      signature,
      signer: primaryWallet.address,
      timestamp: Date.now(),
      isValid: verificationResult.isValid,
      verificationResult,
    };

    return signedMessage;
  }, [primaryWallet, signMessage, verifySignature]);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await handleLogOut();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [handleLogOut]);

  return {
    // State
    isAuthenticated,
    isLoading,
    error,
    sdkHasLoaded,
    
    // User and wallet info
    user,
    primaryWallet,
    walletAddress,
    walletConnector,
    
    // Actions
    signMessage,
    verifySignature,
    signAndVerifyMessage,
    handleLogOut,
    
    // Utilities
    clearError: () => setError(null),
  };
}