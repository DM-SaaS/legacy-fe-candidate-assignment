import type React from "react"
import { ArrowLeft, Shield } from "lucide-react"
import { Button, OtpInput, type OtpInputRef } from "../core"

interface OtpStepProps {
  email: string
  otp: string[]
  onOtpChange: (value: string[]) => void
  onOtpComplete: (value: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  onBackToEmail: () => void
  onResendOtp: () => Promise<void>
  isLoading: boolean
  error: string
  canSubmit: boolean
  otpRef: React.RefObject<OtpInputRef>
}

export const OtpStep: React.FC<OtpStepProps> = ({
  email,
  otp,
  onOtpChange,
  onOtpComplete,
  onSubmit,
  onBackToEmail,
  onResendOtp,
  isLoading,
  error,
  canSubmit,
  otpRef,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">We sent a verification code to</p>
        <p className="font-semibold text-gray-900">{email}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block text-center">Enter 6-digit code</label>
          <OtpInput
            ref={otpRef}
            length={6}
            value={otp}
            onChange={onOtpChange}
            onComplete={onOtpComplete}
            error={error}
            disabled={isLoading}
            autoFocus
          />
        </div>

        {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          loadingText="Verifying..."
          disabled={!canSubmit}
          leftIcon={<Shield className="h-5 w-5" />}
        >
          Verify & Login
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        <Button type="button" variant="outline" size="md" fullWidth onClick={onResendOtp} disabled={isLoading}>
          Resend OTP
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          fullWidth
          onClick={onBackToEmail}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Email
        </Button>
      </div>
    </div>
  )
}
