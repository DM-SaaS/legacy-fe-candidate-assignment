import type React from "react"
import { Mail } from "lucide-react"
import { Button, Input } from "../core"

interface EmailStepProps {
  email: string
  onEmailChange: (email: string) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  isLoading: boolean
  error: string
  canSubmit: boolean
}

export const EmailStep: React.FC<EmailStepProps> = ({ email, onEmailChange, onSubmit, isLoading, error, canSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Input
        type="email"
        label="Email Address"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
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
        disabled={!canSubmit}
      >
        Send OTP
      </Button>
    </form>
  )
}
