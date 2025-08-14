import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useAuth } from "../context"
import { useConnectWithOtp } from "@dynamic-labs/sdk-react-core"
import type { VerifyResponse } from "@dynamic-labs/sdk-api-core"
import type { OtpInputRef } from "../components/core"

interface UseLoginReturn {
  // State
  step: number
  email: string
  otp: string[]
  isLoading: boolean
  error: string

  // Refs
  otpRef: React.RefObject<OtpInputRef | null>

  // Functions
  setEmail: (email: string) => void
  handleEmailSubmit: (e: React.FormEvent) => Promise<void>
  handleOtpSubmit: (e: React.FormEvent) => Promise<void>
  handleOtpChange: (value: string[]) => void
  handleOtpComplete: (value: string) => void
  handleBackToEmail: () => void
  handleResendOtp: () => Promise<void>

  // Computed values
  canSubmitEmail: boolean
  canSubmitOtp: boolean
}

export const useLogin = (): UseLoginReturn => {
  const { login } = useAuth()
  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp()

  // State
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Refs
  const otpRef = useRef<OtpInputRef>(null)

  // Email submission handler
  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!email) return

      setIsLoading(true)
      setError("")

      try {
        await connectWithEmail(email)
        setStep(2)
      } catch {
        setError("Failed to send OTP. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [email, connectWithEmail],
  )

  // OTP submission handler
  const handleOtpSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const otpValue = otp.join("")
      if (otpValue.length !== 6) return

      setIsLoading(true)
      setError("")

      try {
        const result = (await verifyOneTimePassword(otpValue)) as VerifyResponse
        login(result.jwt as string, result.user.email as string)
      } catch {
        setError("Invalid OTP. Please try again.")
        setOtp(["", "", "", "", "", ""])
        otpRef.current?.focus()
      } finally {
        setIsLoading(false)
      }
    },
    [otp, verifyOneTimePassword, login],
  )

  // OTP change handler
  const handleOtpChange = useCallback((value: string[]) => {
    setOtp(value)
  }, [])

  // OTP completion handler (auto-submit)
  const handleOtpComplete = useCallback(
    (value: string) => {
      if (value.length === 6) {
        handleOtpSubmit({ preventDefault: () => {} } as React.FormEvent)
      }
    },
    [handleOtpSubmit],
  )

  // Back to email handler
  const handleBackToEmail = useCallback(() => {
    setStep(1)
    setOtp(["", "", "", "", "", ""])
    setError("")
  }, [])

  // Resend OTP handler
  const handleResendOtp = useCallback(async () => {
    setIsLoading(true)
    setError("")

    try {
      await connectWithEmail(email)
      setOtp(["", "", "", "", "", ""])
      otpRef.current?.focus()
    } catch {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [email, connectWithEmail])

  // Auto-focus OTP input when step changes
  useEffect(() => {
    if (step === 2) {
      otpRef.current?.focus()
    }
  }, [step])

  // Computed values
  const canSubmitEmail = !!email && !isLoading
  const canSubmitOtp = otp.join("").length === 6 && !isLoading

  return {
    // State
    step,
    email,
    otp,
    isLoading,
    error,

    // Refs
    otpRef,

    // Functions
    setEmail,
    handleEmailSubmit,
    handleOtpSubmit,
    handleOtpChange,
    handleOtpComplete,
    handleBackToEmail,
    handleResendOtp,

    // Computed values
    canSubmitEmail,
    canSubmitOtp,
  }
}