import React, { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Shield, Smartphone, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export const MFASetup: React.FC = () => {
  const { user, primaryWallet } = useDynamicContext();
  const [mfaCode, setMfaCode] = useState('');
  const [isEnabling, setIsEnabling] = useState(false);

  const handleEnableMFA = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsEnabling(true);
    try {
      // Here you would normally call the Dynamic MFA API
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Multi-factor authentication enabled!');
    } catch (error) {
      toast.error('Failed to enable MFA. Please try again.');
    } finally {
      setIsEnabling(false);
    }
  };

  return (
    <Card variant="glass" className="w-full max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Enable Multi-Factor Authentication
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add an extra layer of security to your account
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                1. Install an authenticator app
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Use Google Authenticator, Authy, or similar
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Key className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                2. Scan the QR code or enter the key
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Link your authenticator app to your account
              </p>
            </div>
          </div>
        </div>

        <div>
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={mfaCode}
            onChange={(e) =>
              setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            label="Verification Code"
            className="text-center text-2xl tracking-widest"
          />
        </div>

        <Button
          onClick={handleEnableMFA}
          isLoading={isEnabling}
          disabled={mfaCode.length !== 6}
          className="w-full"
          size="lg"
        >
          Enable MFA
        </Button>
      </div>
    </Card>
  );
};
