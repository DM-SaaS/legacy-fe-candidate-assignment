import React from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { useClipboard } from '../../hooks/useClipboard';
import { CheckCircle, XCircle, Copy, ExternalLink, Shield } from 'lucide-react';
import { truncateAddress } from '../../lib/utils';
import { motion } from 'framer-motion';

interface SignatureResultProps {
  signature: string;
  verificationResult: any;
  isVerifying: boolean;
}

export const SignatureResult: React.FC<SignatureResultProps> = ({
  signature,
  verificationResult,
  isVerifying,
}) => {
  const { copyToClipboard } = useClipboard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="glass">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Signature
            </h3>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-700 dark:text-gray-300 break-all">
                {truncateAddress(signature, 20)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(signature)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isVerifying ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-purple-500 animate-pulse" />
                <span className="text-gray-600 dark:text-gray-400">
                  Verifying signature...
                </span>
              </div>
            </div>
          ) : verificationResult ? (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Verification Result
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <div className="flex items-center space-x-2">
                    {verificationResult.isValid ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-500 font-medium">
                          Valid
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-500 font-medium">
                          Invalid
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {verificationResult.signer && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Signer
                    </span>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm text-gray-700 dark:text-gray-300">
                        {truncateAddress(verificationResult.signer)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(verificationResult.signer)
                        }
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {verificationResult.error && (
                  <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {verificationResult.error}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
};
