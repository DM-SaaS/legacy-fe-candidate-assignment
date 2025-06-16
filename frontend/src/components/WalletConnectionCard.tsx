import { Wallet, CheckCircle } from "lucide-react";
import { formatAddress } from "../utils/helper";

export const WalletConnectionCard = ({ address }: { address: string }) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
    <div className="mb-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
        <Wallet className="h-5 w-5 text-blue-600" />
        Wallet Connection
      </h2>
      <p className="text-sm text-gray-600">Your wallet is connected</p>
    </div>

    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">Connected</span>
      </div>
      <span className="bg-gray-100 text-gray-800 text-xs font-mono px-2 py-1 rounded">
        {formatAddress(address)}
      </span>
    </div>
  </div>
);
