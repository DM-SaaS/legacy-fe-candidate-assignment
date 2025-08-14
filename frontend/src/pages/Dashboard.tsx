
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { DashboardHeader, SignedMessagesList, SignMessageCard, WalletInfoCard } from "../components/dashboard"
import { useDashboard } from "../hooks"

export const Dashboard = () => {
 const {
    // State
    message,
    walletSigning,
    verifyData,
    isVerifying,
    isVerifyingSignature,
    walletAddress,

    // Functions
    setMessage,
    onLogoutClick,
    handleSignAndVerify,
  } = useDashboard()


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <ToastContainer />

      <div className="max-w-4xl mx-auto space-y-6">
        <DashboardHeader userName="Nafeel" onLogout={onLogoutClick} />

        <WalletInfoCard walletAddress={walletAddress} />

        <SignMessageCard
          message={message}
          onMessageChange={setMessage}
          onSubmit={handleSignAndVerify}
          isLoading={isVerifyingSignature}
          isWalletSigning={walletSigning}
        />

        <SignedMessagesList messages={verifyData} isLoading={isVerifying} />
      </div>
    </div>
  )
}


