import { useState, useEffect, useCallback } from 'react';
import { SignedMessage } from '../types';
import { STORAGE_KEYS, MAX_HISTORY_ITEMS } from '../lib/constants';
import { generateId } from '../lib/utils';

export const useSignatureHistory = () => {
  const [history, setHistory] = useState<SignedMessage[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SIGNATURE_HISTORY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(Array.isArray(parsed) ? parsed : []);
      } catch {
        setHistory([]);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SIGNATURE_HISTORY,
      JSON.stringify(history)
    );
  }, [history]);

  const addToHistory = useCallback(
    (message: string, signature: string, signer: string) => {
      const newItem: SignedMessage = {
        id: generateId(),
        message,
        signature,
        signer,
        timestamp: new Date().toISOString(),
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev];
        // Keep only the most recent items
        return updated.slice(0, MAX_HISTORY_ITEMS);
      });

      return newItem;
    },
    []
  );

  const updateVerificationStatus = useCallback(
    (id: string, verified: boolean) => {
      setHistory((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, verified, verifiedAt: new Date().toISOString() }
            : item
        )
      );
    },
    []
  );

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    updateVerificationStatus,
    removeFromHistory,
    clearHistory,
  };
};
