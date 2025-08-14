import type React from "react"

interface LoginContainerProps {
  children: React.ReactNode
}

export const LoginContainer: React.FC<LoginContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">{children}</div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Developed by Nafeel Cassim</p>
        </div>
      </div>
    </div>
  )
}