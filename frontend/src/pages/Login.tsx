import { EmailStep, LoginContainer, LoginHeader, OtpStep } from "../components/login"
import { useLogin } from "../hooks/useLogin"

// Login Components

export const Login = () => {
  const {
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
  } = useLogin()

  return (
    <LoginContainer>
      <LoginHeader step={step} />

      <div className="px-8 py-8">
        {step === 1 && (
          <EmailStep
            email={email}
            onEmailChange={setEmail}
            onSubmit={handleEmailSubmit}
            isLoading={isLoading}
            error={error}
            canSubmit={canSubmitEmail}
          />
        )}

        {step === 2 && (
          <OtpStep
            email={email}
            otp={otp}
            onOtpChange={handleOtpChange}
            onOtpComplete={handleOtpComplete}
            onSubmit={handleOtpSubmit}
            onBackToEmail={handleBackToEmail}
            onResendOtp={handleResendOtp}
            isLoading={isLoading}
            error={error}
            canSubmit={canSubmitOtp}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            otpRef={otpRef}
          />
        )}
      </div>
    </LoginContainer>
  )
}