import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Shield, Key, Loader, ArrowLeft } from 'lucide-react';
import { useDynamicHeadlessAuth } from '../hooks/useDynamicHeadlessAuth';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});

type EmailForm = z.infer<typeof emailSchema>;
type OtpForm = z.infer<typeof otpSchema>;

export const HeadlessAuth: React.FC = () => {
  const {
    isAuthenticating,
    authStep,
    emailAddress,
    error,
    isOtpSent,
    sendEmailOtp,
    verifyEmailOtp,
    resendOtp,
    logout,
  } = useDynamicHeadlessAuth();

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const handleEmailSubmit = async (data: EmailForm) => {
    try {
      await sendEmailOtp(data.email);
    } catch (error) {
    }
  };

  const handleOtpSubmit = async (data: OtpForm) => {
    try {
      await verifyEmailOtp(data.otp);
    } catch (error) {
    }
  };

  const renderEmailStep = () => (
    <div className="card max-w-md mx-auto">
      <div className="card-header text-center">
        <div className="w-16 h-16 bg-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Sign in with Email
        </h2>
        <p className="text-gray-600">
          Enter your email to create a secure embedded wallet
        </p>
      </div>

      <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            {...emailForm.register('email')}
            type="email"
            id="email"
            className="input-field"
            placeholder="Enter your email address"
            disabled={isAuthenticating}
          />
          {emailForm.formState.errors.email && (
            <p className="text-red-600 text-sm mt-1">
              {emailForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isAuthenticating}
          className="btn-primary w-full"
        >
          {isAuthenticating ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Sending OTP...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Send Verification Code
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );

  const renderOtpStep = () => (
    <div className="card max-w-md mx-auto">
      <div className="card-header text-center">
        <div className="w-16 h-16 bg-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Enter Verification Code
        </h2>
        <p className="text-gray-600">
          We sent a 6-digit code to <strong>{emailAddress}</strong>
        </p>
      </div>

      <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            {...otpForm.register('otp')}
            type="text"
            id="otp"
            className="input-field text-center text-lg tracking-widest"
            placeholder="123456"
            maxLength={6}
            disabled={isAuthenticating}
          />
          {otpForm.formState.errors.otp && (
            <p className="text-red-600 text-sm mt-1">
              {otpForm.formState.errors.otp.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isAuthenticating}
          className="btn-primary w-full"
        >
          {isAuthenticating ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Verify Code & Create Wallet
            </>
          )}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => logout()}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          disabled={isAuthenticating}
        >
          <ArrowLeft className="w-3 h-3 mr-1 inline" />
          Use different email
        </button>
        
        <button
          onClick={resendOtp}
          className="text-sm text-accent-600 hover:text-accent-700 transition-colors"
          disabled={isAuthenticating}
        >
          Resend OTP
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );

  if (authStep === 'authenticated') {
    return null;
  }

  if (isOtpSent || authStep === 'otp') {
    return renderOtpStep();
  }

  return renderEmailStep();
}; 