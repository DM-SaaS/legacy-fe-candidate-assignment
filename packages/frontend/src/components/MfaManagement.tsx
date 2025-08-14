import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Settings, CheckCircle, AlertTriangle, Plus, Trash2, Key } from 'lucide-react';
import { useMfaAuth } from '../hooks/useMfaAuth';
import { useDynamicHeadlessAuth } from '../hooks/useDynamicHeadlessAuth';
import { MfaSetup } from './MfaSetup';
import { LocalTotpStorage } from '../services/totpService';
import toast from 'react-hot-toast';

export const MfaManagement: React.FC = () => {
  const [showSetup, setShowSetup] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [backupCodesCount, setBackupCodesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { 
    setupTotp, 
    removeTotpSetup, 
    hasMfaSession,
    mfaSession 
  } = useMfaAuth();
  
  const { emailAddress } = useDynamicHeadlessAuth();

  const storage = React.useMemo(() => new LocalTotpStorage(), []);

  const checkTotpSetupStatus = useCallback(async (email: string): Promise<boolean> => {
    try {
      const secret = await storage.getSecret(email);
      return !!secret;
    } catch (error) {
      console.error('Error checking TOTP setup:', error);
      return false;
    }
  }, [storage]);
  useEffect(() => {
    let mounted = true;
    
    const checkStatus = async () => {
      if (!emailAddress) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log('MfaManagement: Checking setup status for', emailAddress);
        const hasSetup = await checkTotpSetupStatus(emailAddress);
        
        if (!mounted) return; // Component unmounted
        
        setIsSetup(hasSetup);
        
        if (hasSetup) {
          const backupCodes = await storage.getBackupCodes(emailAddress);
          if (mounted) {
            setBackupCodesCount(backupCodes.length);
          }
        } else {
          if (mounted) {
            setBackupCodesCount(0);
          }
        }
        
        console.log('MfaManagement: Setup status check complete. Has setup:', hasSetup);
      } catch (error) {
        console.error('MfaManagement: Error checking MFA status:', error);
        if (mounted) {
          setIsSetup(false);
          setBackupCodesCount(0);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkStatus();
    
    return () => {
      mounted = false;
    };
  }, [emailAddress, checkTotpSetupStatus, storage]); // Only depend on emailAddress

  const handleSetupComplete = async (secret: string) => {
    try {
      await setupTotp(secret);
      setShowSetup(false);
      setIsSetup(true);
      
  
      if (emailAddress) {
        const backupCodes = await storage.getBackupCodes(emailAddress);
        setBackupCodesCount(backupCodes.length);
      }
    } catch (error) {
      console.error('MfaManagement: Error completing setup:', error);
      toast.error('Failed to complete MFA setup');
    }
  };

  const handleRemoveSetup = async () => {
    if (!window.confirm('Are you sure you want to remove MFA setup? This will disable two-factor authentication for your account.')) {
      return;
    }

    try {
      await removeTotpSetup();
      setIsSetup(false);
      setBackupCodesCount(0);
      toast.success('MFA setup removed successfully');
    } catch (error) {
      console.error('MfaManagement: Error removing setup:', error);
      toast.error('Failed to remove MFA setup');
    }
  };

  const handleSetupCancel = () => {
    setShowSetup(false);
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
        </div>
      </div>
    );
  }

  
  if (showSetup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Set Up Multi-Factor Authentication</h3>
          <button
            onClick={handleSetupCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <MfaSetup onSetupComplete={handleSetupComplete} onCancel={handleSetupCancel} />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Multi-Factor Authentication</h3>
            <p className="text-sm text-gray-600">Secure your account with additional authentication</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isSetup ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {isSetup ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
            </div>
            <div>
              <p className={`font-medium ${isSetup ? 'text-green-900' : 'text-yellow-900'}`}>
                {isSetup ? 'MFA Enabled' : 'MFA Not Set Up'}
              </p>
              <p className={`text-sm ${isSetup ? 'text-green-700' : 'text-yellow-700'}`}>
                {isSetup 
                  ? 'Your account is protected with two-factor authentication'
                  : 'Set up MFA to secure your message signing'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isSetup ? (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Active</p>
                <p className="text-xs text-gray-600">{backupCodesCount} backup codes remaining</p>
              </div>
            ) : (
              <button
                onClick={() => setShowSetup(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Set Up MFA
              </button>
            )}
          </div>
        </div>


        {isSetup && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                hasMfaSession ? 'bg-green-600' : 'bg-gray-400'
              }`}>
                <Shield className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Current Session: {hasMfaSession ? 'Authenticated' : 'Not Authenticated'}
                </p>
                <p className="text-xs text-blue-700">
                  {hasMfaSession && mfaSession
                    ? `Expires in ${Math.ceil((mfaSession.expiresAt - Date.now()) / 60000)} minutes`
                    : 'Authentication required for message signing'
                  }
                </p>
              </div>
            </div>
          </div>
        )}


        {isSetup && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Authenticator App</h4>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">TOTP Configured</p>
                    <p className="text-sm text-gray-600">Time-based one-time passwords</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
            </div>

    
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Key className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Backup Codes</p>
                    <p className="text-sm text-gray-600">{backupCodesCount} codes remaining</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    backupCodesCount > 3 ? 'bg-green-500' : backupCodesCount > 0 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-sm ${
                    backupCodesCount > 3 ? 'text-green-600' : backupCodesCount > 0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {backupCodesCount > 3 ? 'Good' : backupCodesCount > 0 ? 'Low' : 'None'}
                  </span>
                </div>
              </div>
              
              {backupCodesCount === 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700">
                    Warning: You have no backup codes remaining. If you lose access to your authenticator app, 
                    you won't be able to authenticate. Consider removing and re-setting up MFA to generate new codes.
                  </p>
                </div>
              )}
            </div>


            <div className="flex space-x-3">
              <button
                onClick={() => setShowSetup(true)}
                className="btn-secondary"
              >
                <Settings className="w-4 h-4 mr-2" />
                Reconfigure
              </button>
              
              <button
                onClick={handleRemoveSetup}
                className="btn-danger"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove MFA
              </button>
            </div>
          </div>
        )}

        
        {!isSetup && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Why Set Up MFA?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Required for signing messages with your wallet</li>
              <li>• Protects against unauthorized access</li>
              <li>• Uses standard TOTP compatible with popular authenticator apps</li>
              <li>• Includes backup codes for account recovery</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 