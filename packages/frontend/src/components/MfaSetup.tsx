import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Shield, 
  Smartphone, 
  QrCode, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Key,
  Download,
  Eye,
  EyeOff,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TotpService, LocalTotpStorage } from '../services/totpService';
import type { TotpSetup } from '../types';
import { useDynamicHeadlessAuth } from '../hooks/useDynamicHeadlessAuth';

const verificationSchema = z.object({
  code: z.string()
    .min(6, 'Code must be 6 digits')
    .max(6, 'Code must be 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only numbers'),
});

type VerificationForm = z.infer<typeof verificationSchema>;

interface MfaSetupProps {
  onSetupComplete: (secret: string) => void;
  onCancel: () => void;
}

export const MfaSetup: React.FC<MfaSetupProps> = ({ onSetupComplete, onCancel }) => {
  const [step, setStep] = useState<'instructions' | 'qr-code' | 'verification' | 'backup-codes' | 'complete'>('instructions');
  const [totpSetup, setTotpSetup] = useState<TotpSetup | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  
  const { emailAddress } = useDynamicHeadlessAuth();
  const storage = new LocalTotpStorage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { code: '' },
  });

  
  useEffect(() => {
    const updateTimer = async () => {
      try {
        const remaining = await TotpService.getTimeRemaining();
        setTimeRemaining(remaining);
      } catch (error) {
        console.error('Failed to get time remaining:', error);
  
        const epoch = Math.round(new Date().getTime() / 1000.0);
        const timeStep = 30;
        setTimeRemaining(timeStep - (epoch % timeStep));
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartSetup = async () => {
    setIsGenerating(true);
    setSetupError(null);
    
    try {
      console.log('Debug - emailAddress from hook:', emailAddress);
      
      if (!emailAddress) {
        throw new Error('Email address not available');
      }

      console.log('Starting TOTP setup for:', emailAddress);
      const setup = await TotpService.generateSetup(emailAddress);
      console.log('TOTP setup generated successfully');
      
      setTotpSetup(setup);
      setStep('qr-code');
    } catch (error) {
      console.error('Setup generation error:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate setup. Please try again.';
      setSetupError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadBackupCodes = () => {
    if (!totpSetup) return;

    const content = [
      'Web3 Message Signer - Backup Codes',
      '=====================================',
      '',
      'Save these backup codes in a secure location.',
      'Each code can only be used once.',
      '',
      ...totpSetup.backupCodes.map((code, index) => `${index + 1}. ${code}`),
      '',
      `Generated: ${new Date().toLocaleString()}`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mfa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleVerification = async (data: VerificationForm) => {
    if (!totpSetup) {
      toast.error('Setup not initialized');
      return;
    }

    setIsVerifying(true);
    
    try {
      console.log('Verifying TOTP code:', data.code);
      const isValid = await TotpService.validateToken(data.code, totpSetup.secret);
      console.log('TOTP validation result:', isValid);
      
      if (isValid) {
        // Setup verified - save secret and backup codes locally
        await storage.saveSecret(emailAddress || 'user', totpSetup.secret);
        await storage.saveBackupCodes(emailAddress || 'user', totpSetup.backupCodes);
        
        toast.success('Authenticator app setup complete!');
        setStep('backup-codes');
      } else {
        toast.error('Invalid code. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleComplete = () => {
    if (totpSetup) {
      onSetupComplete(totpSetup.secret);
    }
  };

  const currentCode = watch('code');

  const renderInstructions = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
        <Shield className="w-8 h-8 text-white" />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Set Up Two-Factor Authentication</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Secure your account with an authenticator app. You'll need your phone to continue.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-left">
            <h3 className="font-medium text-blue-900 mb-1">Supported Apps</h3>
            <p className="text-sm text-blue-700">
              Google Authenticator, Authy, Microsoft Authenticator, or any TOTP-compatible app
            </p>
          </div>
        </div>
      </div>

      {setupError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="text-left">
              <h3 className="font-medium text-red-900 mb-1">Setup Error</h3>
              <p className="text-sm text-red-700">{setupError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleStartSetup}
          disabled={isGenerating}
          className="btn-primary w-full"
        >
          {isGenerating ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating Setup...
            </>
          ) : (
            <>
              <Smartphone className="w-4 h-4 mr-2" />
              Set Up Authenticator App
            </>
          )}
        </button>
        
        <button
          onClick={onCancel}
          disabled={isGenerating}
          className="btn-secondary w-full"
        >
          Cancel Setup
        </button>
      </div>
    </div>
  );

  const renderQRCode = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Scan QR Code</h2>
        <p className="text-gray-600">Open your authenticator app and scan this QR code</p>
      </div>

      {totpSetup ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <img 
              src={totpSetup.qrCodeUrl} 
              alt="QR Code for authenticator setup"
              className="w-48 h-48"
              onError={() => {
                console.error('QR Code failed to load');
                toast.error('Failed to load QR code');
              }}
            />
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowManualEntry(!showManualEntry)}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Can't scan? Enter code manually
            </button>
          </div>

          {showManualEntry && (
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Manual Entry</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Account:</label>
                  <p className="text-sm font-mono bg-white border border-gray-200 rounded px-2 py-1">
                    {emailAddress}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Secret Key:</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-mono bg-white border border-gray-200 rounded px-2 py-1 flex-1">
                      {TotpService.formatSecretForDisplay(totpSetup.manualEntryKey)}
                    </p>
                    <button
                      onClick={() => copyToClipboard(totpSetup.manualEntryKey)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={() => setStep('instructions')}
          className="flex-1 btn-secondary"
        >
          Back
        </button>
        <button
          onClick={() => setStep('verification')}
          className="flex-1 btn-primary"
          disabled={!totpSetup}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify Setup</h2>
        <p className="text-gray-600">Enter the 6-digit code from your authenticator app</p>
      </div>

      <form onSubmit={handleSubmit(handleVerification)} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            6-Digit Code
          </label>
          <input
            {...register('code')}
            type="text"
            id="code"
            className="input-field text-center text-lg tracking-widest"
            placeholder="123456"
            maxLength={6}
            disabled={isVerifying}
            autoComplete="one-time-code"
          />
          {errors.code && (
            <p className="text-red-600 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time until next code:</span>
            <span className="text-sm font-mono text-gray-900">{timeRemaining}s</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${(timeRemaining / 30) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setStep('qr-code')}
            className="flex-1 btn-secondary"
            disabled={isVerifying}
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary"
            disabled={isVerifying || currentCode?.length !== 6}
          >
            {isVerifying ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Enable'
            )}
          </button>
        </div>
        
        
        <div className="mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
            disabled={isVerifying}
          >
            Cancel Setup
          </button>
        </div>
      </form>
    </div>
  );

  const renderBackupCodes = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Save Backup Codes</h2>
        <p className="text-gray-600">Save these codes in a secure location. Each can only be used once.</p>
      </div>

      {totpSetup && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-yellow-900">Backup Codes</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowBackupCodes(!showBackupCodes)}
                className="p-1 text-yellow-700 hover:text-yellow-800"
              >
                {showBackupCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={downloadBackupCodes}
                className="p-1 text-yellow-700 hover:text-yellow-800"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {showBackupCodes ? (
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {totpSetup.backupCodes.map((code, index) => (
                <div key={index} className="bg-white border border-yellow-300 rounded px-2 py-1 text-center">
                  {code}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-yellow-700">
              <p className="text-sm">Click the eye icon to show codes</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Important:</p>
            <ul className="space-y-1 text-xs">
              <li>• Store these codes in a password manager or secure location</li>
              <li>• Each code can only be used once</li>
              <li>• Use them if you lose access to your authenticator app</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={handleComplete}
        className="btn-primary w-full"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Complete Setup
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {step === 'instructions' && renderInstructions()}
      {step === 'qr-code' && renderQRCode()}
      {step === 'verification' && renderVerification()}
      {step === 'backup-codes' && renderBackupCodes()}
    </div>
  );
}; 