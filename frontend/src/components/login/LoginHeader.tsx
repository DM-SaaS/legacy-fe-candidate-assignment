import type React from "react"
import { Mail, Shield } from "lucide-react"

interface LoginHeaderProps {
  step: number
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ step }) => {
  const getHeaderContent = () => {
    switch (step) {
      case 1:
        return {
          icon: <Mail className="h-8 w-8" />,
          title: "Welcome Back",
          subtitle: "Enter your email to get started",
        }
      case 2:
        return {
          icon: <Shield className="h-8 w-8" />,
          title: "Verify Your Email",
          subtitle: "Enter the 6-digit code sent to your email",
        }
      default:
        return {
          icon: <Mail className="h-8 w-8" />,
          title: "Welcome Back",
          subtitle: "Enter your email to get started",
        }
    }
  }

  const { icon, title, subtitle } = getHeaderContent()

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
      <div className="flex items-center justify-center mb-2">{icon}</div>
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      <p className="text-blue-100 text-center mt-1">{subtitle}</p>
    </div>
  )
}