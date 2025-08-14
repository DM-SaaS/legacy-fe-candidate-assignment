import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMfaAuth, type MfaMethod } from '../hooks/useMfaAuth';
import { Smartphone, Shield, X, Loader, Settings } from 'lucide-react';
import { MfaSetup } from './MfaSetup';


const totpSchema = z.object({
  code: z.string().min(6, 'Code must be 6 digits').max(6, 'Code must be 6 digits'),
});

type TotpForm = z.infer<typeof totpSchema>;

interface MfaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const MfaModal: React.FC<MfaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Multi-Factor Authentication Required",
  description = "Please verify your identity to continue with this action."
}) => {
  const [selectedMethod, setSelectedMethod] = useState<MfaMethod | 'setup' | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  
  const {
    isAuthenticating,
    needsSetup,
    authenticateWithTOTP,
    setupTotp,
    checkTotpSetup,
  } = useMfaAuth();

  const totpForm = useForm<TotpForm>({
    resolver: zodResolver(totpSchema),
    defaultValues: { code: '' },
  });


  useEffect(() => {
    if (isOpen && !showSetup) {
      checkTotpSetup();
    }
  }, [isOpen, showSetup, checkTotpSetup]);


  useEffect(() => {
    if (isOpen && needsSetup && !showSetup && !selectedMethod) {
  
      setShowSetup(true);
    }
  }, [isOpen, needsSetup, showSetup, selectedMethod]);

  const handleClose = () => {
    totpForm.reset();
    setSelectedMethod(null);
    setShowSetup(false);
    onClose();
  };

  const handleSuccess = () => {
    totpForm.reset();
    setSelectedMethod(null);
    setShowSetup(false);
    onSuccess();
  };

  const handleTotpSubmit = async (data: TotpForm) => {
    const success = await authenticateWithTOTP(data.code);
    if (success) {
      handleSuccess();
    }
  };

  const handleSetupComplete = async (secret: string) => {
    await setupTotp(secret);
    setShowSetup(false);
    setSelectedMethod('totp');

    await checkTotpSetup();

  };

  const handleSetupCancel = () => {
    setShowSetup(false);
    setSelectedMethod(null);

    if (needsSetup) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  
  if (showSetup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <MfaSetup 
          onSetupComplete={handleSetupComplete}
          onCancel={handleSetupCancel}
        />
      </div>
    );
  }

  const renderMethodSelector = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      <div className="space-y-3">
        {!needsSetup ? (
          <button
            onClick={() => setSelectedMethod('totp')}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-accent-300 hover:bg-accent-50 transition-colors text-left"
            disabled={isAuthenticating}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Authenticator App</h4>
                <p className="text-sm text-gray-600">Enter 6-digit code from your app</p>
              </div>
            </div>
          </button>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <Settings className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">Setup Required</h4>
                <p className="text-sm text-yellow-700">
                  You need to set up an authenticator app before you can use MFA.
                </p>
              </div>
            </div>
          </div>
        )}

        {needsSetup && (
          <button
            onClick={() => setShowSetup(true)}
            className="w-full p-4 border-2 border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Set Up Authenticator App</h4>
                <p className="text-sm text-blue-700">Configure TOTP for future authentications</p>
              </div>
            </div>
          </button>
        )}
      </div>


      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleClose}
          className="w-full btn-secondary"
          disabled={isAuthenticating}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderTotpForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Authenticator App</h3>
        <p className="text-gray-600 text-sm">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <form onSubmit={totpForm.handleSubmit(handleTotpSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="000000"
            maxLength={6}
            className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...totpForm.register('code')}
            disabled={isAuthenticating}
          />
          {totpForm.formState.errors.code && (
            <p className="mt-1 text-sm text-red-600">
              {totpForm.formState.errors.code.message}
            </p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            Tip: Open your authenticator app and enter the current 6-digit code for this account.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setSelectedMethod(null)}
            className="flex-1 btn-secondary"
            disabled={isAuthenticating}
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary"
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-accent-600" />
              <span className="font-medium text-gray-900">Security Verification</span>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isAuthenticating}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!selectedMethod && renderMethodSelector()}
          {selectedMethod === 'totp' && renderTotpForm()}
        </div>
      </div>
    </div>
  );
}; 