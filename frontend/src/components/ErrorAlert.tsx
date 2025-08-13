import { AlertCircle } from "lucide-react";

export const ErrorAlert = ({
  error,
  onDismiss,
}: {
  error: string;
  onDismiss: () => void;
}) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
    <div className="flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-red-800 text-sm">{error}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-red-600 hover:text-red-800 text-sm font-medium"
      >
        Dismiss
      </button>
    </div>
  </div>
);
