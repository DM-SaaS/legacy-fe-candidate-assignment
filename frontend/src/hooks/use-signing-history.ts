'use client';

import { useState, useEffect, useCallback } from 'react';
import { SignedMessage } from './use-dynamic-auth';

const STORAGE_KEY = 'web3-signing-history';

export function useSigningHistory() {
  const [history, setHistory] = useState<SignedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SignedMessage[];
        // Sort by timestamp (newest first)
        setHistory(parsed.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error('Failed to load signing history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save history to localStorage whenever it changes
  const saveHistory = useCallback((newHistory: SignedMessage[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save signing history:', error);
    }
  }, []);

  // Add a new signed message to history
  const addToHistory = useCallback((signedMessage: SignedMessage) => {
    setHistory(prevHistory => {
      const newHistory = [signedMessage, ...prevHistory];
      saveHistory(newHistory);
      return newHistory;
    });
  }, [saveHistory]);

  // Remove a message from history
  const removeFromHistory = useCallback((messageId: string) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.filter(msg => msg.id !== messageId);
      saveHistory(newHistory);
      return newHistory;
    });
  }, [saveHistory]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear signing history:', error);
    }
  }, []);

  // Get history for a specific signer address
  const getHistoryBySigner = useCallback((signerAddress: string) => {
    return history.filter(msg => 
      msg.signer.toLowerCase() === signerAddress.toLowerCase()
    );
  }, [history]);

  // Get statistics
  const getStats = useCallback(() => {
    const totalMessages = history.length;
    const validMessages = history.filter(msg => msg.isValid).length;
    const invalidMessages = totalMessages - validMessages;
    const uniqueSigners = new Set(history.map(msg => msg.signer.toLowerCase())).size;
    const lastSigned = history.length > 0 ? history[0].timestamp : null;

    return {
      totalMessages,
      validMessages,
      invalidMessages,
      uniqueSigners,
      lastSigned,
      successRate: totalMessages > 0 ? (validMessages / totalMessages) * 100 : 0,
    };
  }, [history]);

  // Export history as JSON
  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `web3-signing-history-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [history]);

  return {
    // State
    history,
    isLoading,
    
    // Actions
    addToHistory,
    removeFromHistory,
    clearHistory,
    exportHistory,
    
    // Utilities
    getHistoryBySigner,
    getStats,
    
    // Computed values
    hasHistory: history.length > 0,
    recentHistory: history.slice(0, 5), // Last 5 messages
  };
}