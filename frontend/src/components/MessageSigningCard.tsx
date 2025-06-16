import { Send } from "lucide-react";

export const MessageSigningCard = ({
  message,
  onMessageChange,
  onSign,
  loading,
}: {
  message: string;
  onMessageChange: (message: string) => void;
  onSign: () => void;
  loading: boolean;
}) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
    <div className="mb-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
        <Send className="h-5 w-5 text-purple-600" />
        Sign Message
      </h2>
      <p className="text-sm text-gray-600">
        Enter your message to sign and verify
      </p>
    </div>

    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Your Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Enter the message you want to sign..."
          className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none transition-colors duration-200"
        />
      </div>
      <button
        onClick={onSign}
        disabled={!message.trim() || loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
      >
        {loading ? "Signing & Verifying..." : "Sign & Verify Message"}
      </button>
    </div>
  </div>
);
