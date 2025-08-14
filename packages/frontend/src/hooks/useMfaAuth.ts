import { useState, useCallback, useMemo } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import toast from 'react-hot-toast';
import { TotpService, LocalTotpStorage } from '../services/totpService';

export type MfaMethod = 'totp';

export interface MfaSession {
  isAuthenticated: boolean;
  authenticatedAt: number;
  expiresAt: number;
  method: MfaMethod;
}

export const useMfaAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [mfaSession, setMfaSession] = useState<MfaSession | null>(null);
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  
  const { user } = useDynamicContext();
  
  const storage = useMemo(() => new LocalTotpStorage(), []);

  const SESSION_DURATION = 5 * 60 * 1000; // 5 minute sessions

  const isSessionValid = useCallback((session?: MfaSession): boolean => {
    if (!session || !session.isAuthenticated) return false;
    return Date.now() < session.expiresAt;
  }, []);

  const createMfaSession = useCallback((method: MfaMethod): MfaSession => {
    const now = Date.now();
    return {
      isAuthenticated: true,
      authenticatedAt: now,
      expiresAt: now + SESSION_DURATION,
      method,
    };
  }, [SESSION_DURATION]);

  const checkTotpSetup = useCallback(async (): Promise<boolean> => {
    if (!user?.email) return false;
    
    try {
      const secret = await storage.getSecret(user.email);
      const hasSetup = !!secret;
      setNeedsSetup(!hasSetup);
      return hasSetup;
    } catch (error) {
      console.error('Error checking TOTP setup:', error);
      setNeedsSetup(true);
      return false;
    }
  }, [user?.email, storage]);

  // Main TOTP authentication flow
  const authenticateWithTOTP = useCallback(async (code: string): Promise<boolean> => {
    try {
      setIsAuthenticating(true);
      
      if (!code || code.length !== 6) {
        throw new Error('Please enter a valid 6-digit code');
      }

      if (!user?.email) {
        throw new Error('User email not available');
      }

      const secret = await storage.getSecret(user.email);
      if (!secret) {
        setNeedsSetup(true);
        throw new Error('TOTP not set up. Please set up authenticator app first.');
      }

      // Use window validation for better UX
      const isValid = await TotpService.validateTokenWithWindow(code, secret, 1);
      
      if (isValid) {
        const session = createMfaSession('totp');
        setMfaSession(session);
        setRequiresMfa(false);
        setShowMfaModal(false);
        
        toast.success('TOTP authentication successful!');
        return true;
      } else {
        throw new Error('Invalid code. Please check your authenticator app.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'TOTP authentication failed';
      toast.error(message);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [createMfaSession, user?.email, storage]);

  const authenticateWithMethod = useCallback(async (
    method: MfaMethod, 
    totpCode?: string
  ): Promise<boolean> => {
    switch (method) {
      case 'totp':
        if (!totpCode) {
          throw new Error('TOTP code is required for TOTP authentication');
        }
        return authenticateWithTOTP(totpCode);
      default:
        throw new Error(`Unsupported MFA method: ${method}`);
    }
  }, [authenticateWithTOTP]);

  const clearMfaSession = useCallback(() => {
    setMfaSession(null);
    setRequiresMfa(false);
    setShowMfaModal(false);
  }, []);

  const setupTotp = useCallback(async (secret: string): Promise<void> => {
    if (!user?.email) {
      throw new Error('User email not available');
    }
    
    await storage.saveSecret(user.email, secret);
    setNeedsSetup(false);
    toast.success('Authenticator app setup complete!');
  }, [user?.email, storage]);

  const removeTotpSetup = useCallback(async (): Promise<void> => {
    if (!user?.email) {
      throw new Error('User email not available');
    }
    
    await storage.removeSecret(user.email);
    setNeedsSetup(true);
    clearMfaSession();
    toast.success('Authenticator app removed');
  }, [user?.email, storage, clearMfaSession]);

  // Checks if MFA is needed and shows modal if required
  const requireMfaForAction = useCallback(async (): Promise<boolean> => {
    if (mfaSession && isSessionValid(mfaSession)) {
      return true;
    }

    if (mfaSession && !isSessionValid(mfaSession)) {
      setMfaSession(null);
    }

    try {
      const hasTotp = await checkTotpSetup();
      if (!hasTotp) {
        setNeedsSetup(true);
      } else {
        setNeedsSetup(false);
      }
    } catch (error) {
      console.error('Error checking TOTP setup in requireMfaForAction:', error);
      setNeedsSetup(true);
    }

    setRequiresMfa(true);
    setShowMfaModal(true);
    return false;
  }, [mfaSession, isSessionValid, checkTotpSetup]);

  const hasMfaSession = mfaSession && isSessionValid(mfaSession);

  return {
    isAuthenticating,
    mfaSession,
    requiresMfa,
    showMfaModal,
    needsSetup,
    hasMfaSession: !!hasMfaSession,
    
    requireMfaForAction,
    authenticateWithTOTP,
    authenticateWithMethod,
    clearMfaSession,
    setupTotp,
    removeTotpSetup,
    checkTotpSetup,
    
    setShowMfaModal,
    setRequiresMfa,
    setNeedsSetup,
  };
}; 