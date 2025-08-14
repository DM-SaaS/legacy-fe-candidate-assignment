import { useState, useCallback, useEffect, useMemo } from 'react';
import { useConnectWithOtp, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useAppContext } from '../contexts/AppContext';
import toast from 'react-hot-toast';

export const useDynamicHeadlessAuth = () => {
  const { state, actions } = useAppContext();
  const { user, primaryWallet, handleLogOut } = useDynamicContext();
  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();
  
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');

  const sendEmailOtp = useCallback(async (email: string) => {
    try {
      actions.setAuthenticating(true);
      actions.setError(null);
      setCurrentEmail(email);
      
      await connectWithEmail(email);
      
      setIsOtpSent(true);
      actions.setEmail(email);
      actions.setAuthStep('otp');
      toast.success(`OTP sent to ${email}`);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send OTP';
      actions.setError(message);
      toast.error(message);
      throw error;
    } finally {
      actions.setAuthenticating(false);
    }
  }, [connectWithEmail, actions]);

  const verifyEmailOtp = useCallback(async (otp: string) => {
    try {
      actions.setAuthenticating(true);
      actions.setError(null);
      
      await verifyOneTimePassword(otp);
      
      toast.success('Email verified successfully!');
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to verify OTP';
      actions.setError(message);
      toast.error(message);
      throw error;
    } finally {
      actions.setAuthenticating(false);
    }
  }, [verifyOneTimePassword, actions]);

  const resendOtp = useCallback(async () => {
    if (!currentEmail) {
      toast.error('No email address to resend to');
      return;
    }
    
    try {
      actions.setAuthenticating(true);
      actions.setError(null);
      
      await connectWithEmail(currentEmail);
      toast.success('OTP resent successfully');
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resend OTP';
      actions.setError(message);
      toast.error(message);
    } finally {
      actions.setAuthenticating(false);
    }
  }, [connectWithEmail, currentEmail, actions]);

  const logout = useCallback(async () => {
    try {
      await handleLogOut();
      actions.resetAuth();
      setIsOtpSent(false);
      setCurrentEmail('');
      toast.success('Logged out successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to logout';
      toast.error(message);
    }
  }, [handleLogOut, actions]);

  const isAuthenticated = !!user && !!primaryWallet;
  
  const stableActions = useMemo(() => actions, []);
  
  useEffect(() => {
    if (isAuthenticated) {
      stableActions.setAuthStep('authenticated');
      // Cast Dynamic wallet to our interface
      stableActions.setWallet(primaryWallet as any);
      stableActions.setEmail(user?.email || currentEmail);
    } else if (user && !primaryWallet) {
      stableActions.setAuthStep('mfa');
    } else {
      stableActions.setAuthStep(null);
      stableActions.setWallet(null);
    }
  }, [isAuthenticated, primaryWallet, user, currentEmail, stableActions]);

  return {
    isAuthenticating: state.dynamicAuth.isAuthenticating,
    authStep: state.dynamicAuth.authStep,
    emailAddress: state.dynamicAuth.emailAddress || currentEmail,
    wallet: primaryWallet,
    user,
    error: state.error,
    isOtpSent,
    
    sendEmailOtp,
    verifyEmailOtp,
    resendOtp,
    logout,
    
    isAuthenticated,
  };
}; 