import { ChevronDown, ChevronUp, History } from "lucide-react";
import { formatAddress } from "../utils/helper";
import type { HistoryEntry } from "../types";

export const HistoryCard = ({
  history,
  isOpen,
  onToggle,
}: {
  history: HistoryEntry[];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200 rounded-t-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Signing History
            </h2>
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded ml-2">
              {history.length}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {history.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-gray-100 text-gray-800 text-xs font-mono px-2 py-1 rounded">
                      {formatAddress(item.result.signer)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.result.isValid
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {item.result.isValid ? "Valid" : "Invalid"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 break-words">
                    <strong>Message:</strong> {item.message}
                  </p>
                  <p className="text-xs text-gray-500 break-words truncate">
                    <strong>Signature:</strong> {item.signature}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
