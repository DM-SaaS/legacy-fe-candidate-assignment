import { useCallback } from 'react';
import type { SignedMessage } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { APP_CONFIG } from '../constants';

const STORAGE_KEY = 'web3-signature-history';

export function useSignatureHistory() {
  const [history, setHistory] = useLocalStorage<SignedMessage[]>(STORAGE_KEY, []);

  const addSignedMessage = useCallback((message: SignedMessage) => {
    setHistory((prev) => {
      const newHistory = [message, ...prev];
      return newHistory.slice(0, APP_CONFIG.SIGNATURE_HISTORY_LIMIT);
    });
  }, [setHistory]);

  const updateSignedMessage = useCallback((id: string, updates: Partial<SignedMessage>) => {
    setHistory((prev) => 
      prev.map((msg) => 
        msg.id === id ? { ...msg, ...updates } : msg
      )
    );
  }, [setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const removeMessage = useCallback((id: string) => {
    setHistory((prev) => prev.filter((msg) => msg.id !== id));
  }, [setHistory]);

  const getMessageById = useCallback((id: string) => {
    return history.find((msg) => msg.id === id);
  }, [history]);

  return {
    history,
    addSignedMessage,
    updateSignedMessage,
    clearHistory,
    removeMessage,
    getMessageById,
    totalMessages: history.length,
  };
} 