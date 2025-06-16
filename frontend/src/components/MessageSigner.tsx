import { useState, useCallback } from "react";
import { createWalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import axios, { AxiosError } from "axios";
import type {
  Address,
  SignatureVerificationResult,
  HistoryEntry,
} from "../types";
import { BACKEND_URL } from "../config";
import { ERROR_MESSAGES } from "../constants/errors";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ErrorAlert } from "./ErrorAlert";
import { WalletConnectionCard } from "./WalletConnectionCard";
import { MessageSigningCard } from "./MessageSigningCard";
import { ResultCard } from "./ResultCard";
import { HistoryCard } from "./HistoryCard";
import { localStorageItems } from "../constants/localStorage";
import { isWalletError, isBackendError } from "../utils/type-guards";

function getBackendErrorMessage(error: AxiosError): string {
  const responseData = error.response?.data;
  if (
    responseData &&
    typeof responseData === "object" &&
    "message" in responseData
  ) {
    const message = (responseData as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }
  return "Failed to verify signature";
}

export default function MessageSigner({ address }: { address: Address }) {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<SignatureVerificationResult | null>(
    null
  );
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    localStorageItems.HISTORY_STORAGE_KEY,
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    console.error("Signing error:", err);

    if (err instanceof Error) {
      // Check for user rejection
      if (
        err.message?.includes("User rejected") ||
        err.message?.includes("rejected") ||
        (isWalletError(err) && err.code === 4001)
      ) {
        setError(ERROR_MESSAGES.USER_REJECTED);
        return;
      }

      // Check for no wallet
      if (err.message?.includes("No wallet")) {
        setError(ERROR_MESSAGES.NO_WALLET);
        return;
      }
    }

    // Check for backend errors
    if (isBackendError(err)) {
      setError(`Backend error: ${getBackendErrorMessage(err)}`);
      return;
    }

    // Generic error fallback
    setError(ERROR_MESSAGES.GENERIC_ERROR);
  }, []);

  const signAndVerify = useCallback(async (): Promise<void> => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!window.ethereum) {
        throw new Error(ERROR_MESSAGES.NO_WALLET);
      }

      // Ensure address is properly typed
      if (!address || typeof address !== "string") {
        throw new Error("Invalid wallet address");
      }

      const client = createWalletClient({
        chain: polygonMumbai,
        transport: custom(window.ethereum),
      });

      const signature = await client.signMessage({
        account: address as Address,
        message,
      });

      const response = await axios.post<SignatureVerificationResult>(
        `${BACKEND_URL}/verify-signature`,
        { message, signature },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const verificationResult = response.data;
      setResult(verificationResult);

      const newEntry: HistoryEntry = {
        message,
        signature,
        result: verificationResult,
      };

      const updatedHistory: HistoryEntry[] = [newEntry, ...history];
      setHistory(updatedHistory);
      setMessage("");
    } catch (err: unknown) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [message, address, history, setHistory, handleError]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <WalletConnectionCard address={address} />

        {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}

        <MessageSigningCard
          message={message}
          onMessageChange={setMessage}
          onSign={signAndVerify}
          loading={loading}
        />

        {result && <ResultCard result={result} />}

        <HistoryCard
          history={history}
          isOpen={isHistoryOpen}
          onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        />
      </div>
    </div>
  );
}
