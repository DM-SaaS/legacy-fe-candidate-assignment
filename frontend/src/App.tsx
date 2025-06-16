import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import MessageSigner from "./components/MessageSigner";
import type { Address } from "./types";

export default function App() {
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address as Address;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-2xl mx-auto space-y-6 mt-12">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Web3 Message Signer</h1>
          <p className="text-gray-600">
            Connect, sign, and verify messages using your wallet
          </p>
        </header>

        {/* Login widget */}
        <div className="flex justify-center">
          <DynamicWidget buttonClassName="bg-blue-600 text-white py-2 px-4 rounded-lg" />
        </div>

        {/* Message signer */}
        {address && <MessageSigner address={address} />}
      </div>
    </div>
  );
}
