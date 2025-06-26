import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context';
import { useConnectWithOtp } from '@dynamic-labs/sdk-react-core';
import type { VerifyResponse } from '@dynamic-labs/sdk-api-core';
import { ArrowLeft, Mail, Shield } from 'lucide-react';
import { Button, Input, OtpInput, OtpInputRef } from '../components/core';

export const Login = () => {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpRef = useRef<OtpInputRef>(null);

  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await connectWithEmail(email);
      console.log(result);
      setStep(2);
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;

    setIsLoading(true);
    setError('');

    try {
      const result = (await verifyOneTimePassword(otpValue)) as VerifyResponse;
      login(result.jwt, result.user.email);
    } catch {
      setError('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string[]) => {
    setOtp(value);
  };

  const handleOtpComplete = (value: string) => {
    // Auto-submit when OTP is complete
    if (value.length === 6) {
      handleOtpSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');

    try {
      await connectWithEmail(email);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step === 2) {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center justify-center mb-2">
              {step === 1 && <Mail className="h-8 w-8" />}
              {step === 2 && <Shield className="h-8 w-8" />}
            </div>
            <h1 className="text-2xl font-bold text-center">
              {step === 1 && 'Welcome Back'}
              {step === 2 && 'Verify Your Email'}
            </h1>
            <p className="text-blue-100 text-center mt-1">
              {step === 1 && 'Enter your email to get started'}
              {step === 2 && 'Enter the 6-digit code sent to your email'}
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Email Step */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  fullWidth
                  required
                  error={error}
                  leftIcon={<Mail className="h-5 w-5" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  loadingText="Sending OTP..."
                  disabled={!email}
                >
                  Send OTP
                </Button>
              </form>
            )}

            {/* OTP Step */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    We sent a verification code to
                  </p>
                  <p className="font-semibold text-gray-900">{email}</p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block text-center">
                      Enter 6-digit code
                    </label>
                    <OtpInput
                      ref={otpRef}
                      length={6}
                      value={otp}
                      onChange={handleOtpChange}
                      onComplete={handleOtpComplete}
                      error={error}
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    loadingText="Verifying..."
                    disabled={otp.join('').length !== 6}
                    leftIcon={<Shield className="h-5 w-5" />}
                  >
                    Verify & Login
                  </Button>
                </form>

                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={handleResendOtp}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    fullWidth
                    onClick={handleBackToEmail}
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                  >
                    Back to Email
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Developed by Nafeel Cassim</p>
        </div>
      </div>
    </div>
  );
};
