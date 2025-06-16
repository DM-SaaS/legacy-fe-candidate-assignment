import { useState, useEffect } from "react";
import { createWalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import axios from "axios";
import type {
  Props,
  SignatureVerificationResult,
  HistoryEntry,
} from "../types";

export const MessageForm = ({ address }: Props) => {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<SignatureVerificationResult | null>(
    null
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("history");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const signAndVerify = async () => {
    setLoading(true);
    try {
      const client = createWalletClient({
        chain: polygonMumbai,
        transport: custom(window.ethereum!),
      });

      const signature = await client.signMessage({
        account: address,
        message,
      });

      const res = await axios.post<SignatureVerificationResult>(
        `${import.meta.env.VITE_BACKEND_URL}/verify-signature`,
        { message, signature }
      );

      const result = res.data;
      setResult(result);

      const newEntry: HistoryEntry = { message, signature, result };
      const newHistory = [newEntry, ...history];
      setHistory(newHistory);
      localStorage.setItem("history", JSON.stringify(newHistory));
    } catch (err) {
      console.error(err);
      alert("Signing or verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 ">Sign a Message</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full p-3 border border-gray-300 rounded-md resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={signAndVerify}
        disabled={!message || loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition disabled:opacity-50"
      >
        {loading ? "Signing..." : "Sign & Verify"}
      </button>

      {result && (
        <div className="p-4 bg-green-50 border border-green-300 rounded-md">
          <p className="text-green-700 font-medium">
            ✅ Signature Valid: {String(result.isValid)}
          </p>
          <p className="text-sm text-gray-700">Signer: {result.signer}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-700">History</h3>
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {history.map((item, i) => (
            <li
              key={i}
              className="border p-3 rounded-md bg-gray-50 text-sm break-words"
            >
              <div>
                <strong>Message:</strong> {item.message}
              </div>
              <div>
                <strong>Signer:</strong> {item.result.signer}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
