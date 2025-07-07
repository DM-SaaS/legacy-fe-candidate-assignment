import React, { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Mail, Shield, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginForm: React.FC = () => {
  const { setShowAuthFlow } = useDynamicContext();
  const [email, setEmail] = useState('');

  const handleEmailLogin = () => {
    if (email) {
      setShowAuthFlow(true);
    }
  };

  return (
    <Card variant="glass" className="w-full max-w-md">
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Web3 Message Signer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign and verify messages with your wallet
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
              label="Email Address"
              className="w-full"
            />
          </div>

          <Button
            onClick={handleEmailLogin}
            disabled={!email}
            className="w-full"
            size="lg"
          >
            <Mail className="w-5 h-5 mr-2" />
            Continue with Email
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                Or
              </span>
            </div>
          </div>

          <Button
            onClick={() => setShowAuthFlow(true)}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            <Wallet className="w-5 h-5 mr-2" />
            Connect Wallet
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
          <Shield className="w-4 h-4 mr-1" />
          <span>Secured by Dynamic.xyz</span>
        </div>
      </motion.div>
    </Card>
  );
};
