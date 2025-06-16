import { CheckCircle, XCircle } from "lucide-react";
import type { SignatureVerificationResult } from "../types";
import { formatAddress } from "../utils/helper";

export const ResultCard = ({
  result,
}: {
  result: SignatureVerificationResult;
}) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
    <div className="mb-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        {result.isValid ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600" />
        )}
        Verification Result
      </h2>
    </div>

    <div
      className={`p-4 rounded-lg border ${
        result.isValid
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              result.isValid
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {result.isValid ? "Valid Signature" : "Invalid Signature"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Signer:</span>
          <span className="bg-gray-100 text-gray-800 text-xs font-mono px-2 py-1 rounded">
            {formatAddress(result.signer)}
          </span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-sm font-medium text-gray-700">Message:</span>
          <span className="text-sm text-gray-600 text-right max-w-[200px] break-words">
            {result.message}
          </span>
        </div>
      </div>
    </div>
  </div>
);
