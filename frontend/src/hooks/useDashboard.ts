import type React from 'react';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDynamicWaas } from '@dynamic-labs/sdk-react-core';
import { ChainEnum } from '@dynamic-labs/sdk-api-core';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useVerifySignature } from './useVerifySignature';
import { useGetVerifySignature, type SignedMessage } from './useGetVerifySignature';
import { showToast } from '../util/showToast';

interface UseDashboardReturn {
  // State
  message: string;
  walletSigning: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  primaryWallet: any;
  verifyData: SignedMessage[];
  isVerifying: boolean;
  isVerifyingSignature: boolean;
  walletSetupLoading: boolean;

  // Functions
  setMessage: (message: string) => void;
  onLogoutClick: () => Promise<void>;
  handleSignAndVerify: (e: React.FormEvent) => Promise<void>;
  clearMessage: () => void;
  retryWalletSetup: () => Promise<void>;

  // Computed values
  hasWallet: boolean;
  walletAddress?: string;
  canSignMessage: boolean;
  messageCount: number;
}

export const useDashboard = (): UseDashboardReturn => {
  // Auth and wallet hooks
  const { logout } = useAuth();
  const { createWalletAccount, getWaasWallets } = useDynamicWaas();
  const { primaryWallet, handleLogOut } = useDynamicContext();

  // Local state
  const [message, setMessage] = useState('');
  const [walletSigning, setWalletSigning] = useState(false);
  const [walletSetupLoading, setWalletSetupLoading] = useState(false);

  // API hooks
  const verifyMutation = useVerifySignature();
  const { data: verifyData = [], isLoading: isVerifying } =
    useGetVerifySignature({});

  // Wallet setup function
  const onCreateWalletHandler = useCallback(async () => {
    setWalletSetupLoading(true);
    try {
      const waasWallets = await getWaasWallets();
      if (waasWallets.length === 0) {
        await createWalletAccount([ChainEnum.Evm]);
        showToast('Wallet created successfully', 'success');
      }
    } catch (e) {
      showToast('Something went wrong while setting up wallet', 'error');
      console.error(e);
    } finally {
      setWalletSetupLoading(false);
    }
  }, [createWalletAccount, getWaasWallets]);

  // Initialize wallet on mount
  useEffect(() => {
    onCreateWalletHandler();
  }, [onCreateWalletHandler]);

  // Logout handler
  const onLogoutClick = useCallback(async () => {
    try {
      handleLogOut();
      logout();
      showToast('Logged out successfully', 'success');
    } catch (error) {
      showToast('Error during logout', 'error');
      console.error(error);
    }
  }, [handleLogOut, logout]);

  // Sign and verify message handler
  const handleSignAndVerify = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!primaryWallet) {
        showToast(
          'No primary wallet found. Please connect your wallet.',
          'error'
        );
        return;
      }

      if (!message.trim()) {
        showToast('Please enter a message to sign', 'error');
        return;
      }

      try {
        setWalletSigning(true);
        const signature = await primaryWallet.signMessage(message);
        setWalletSigning(false);

        await verifyMutation.mutateAsync({ message, signature: signature as string });
        showToast('Signature verification success', 'success');
        setMessage(''); // Clear message on success
      } catch (error) {
        setWalletSigning(false);
        const err = error as Error;
        showToast(
          `Error: ${err?.message || 'Failed to verify signature.'}`,
          'error'
        );
      }
    },
    [primaryWallet, message, verifyMutation]
  );

  // Utility functions
  const clearMessage = useCallback(() => {
    setMessage('');
  }, []);

  const retryWalletSetup = useCallback(async () => {
    await onCreateWalletHandler();
  }, [onCreateWalletHandler]);

  // Computed values
  const hasWallet = !!primaryWallet?.address;
  const walletAddress = primaryWallet?.address;
  const canSignMessage =
    hasWallet &&
    message.trim().length > 0 &&
    !walletSigning &&
    !verifyMutation.isPending;
  const messageCount = verifyData?.length || 0;

  // Return all the state and functions needed by the UI
  return {
    // State
    message,
    walletSigning,
    primaryWallet,
    verifyData,
    isVerifying,
    isVerifyingSignature: verifyMutation.status === 'pending',
    walletSetupLoading,

    // Functions
    setMessage,
    onLogoutClick,
    handleSignAndVerify,
    clearMessage,
    retryWalletSetup,

    // Computed values
    hasWallet,
    walletAddress,
    canSignMessage,
    messageCount,
  };
};
