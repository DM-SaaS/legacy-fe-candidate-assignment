import { useState, useEffect } from 'react';
import type { SignedMessage, VerificationResult } from '../types';

type MessageHistoryType = Array<SignedMessage & { verification?: VerificationResult }>;
type MessageHistoryListener = (messages: MessageHistoryType) => void;


const STORAGE_KEY = 'signedMessages_v2'; 


let sharedMessageHistory: MessageHistoryType = [];
const listeners: Set<MessageHistoryListener> = new Set();


try {
  const savedHistory = localStorage.getItem(STORAGE_KEY);
  if (savedHistory) {
    sharedMessageHistory = JSON.parse(savedHistory);
  }
} catch (error) {
  console.error('Error parsing message history from localStorage:', error);
}


const updateMessages = (newMessages: MessageHistoryType) => {
  sharedMessageHistory = newMessages;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedMessageHistory));
  listeners.forEach(listener => listener(sharedMessageHistory));
};

export const useMessageHistory = () => {
  const [messageHistory, setMessageHistory] = useState<MessageHistoryType>(sharedMessageHistory);
  
  
  useEffect(() => {
    const updateState = (newState: MessageHistoryType) => {
      setMessageHistory([...newState]); 
    };
    
    listeners.add(updateState);
    
    
    setMessageHistory([...sharedMessageHistory]);
    
    return () => {
      listeners.delete(updateState);
    };
  }, []);

  
  const addMessage = (message: string, signature: string) => {
    const newEntry: SignedMessage = {
      message,
      signature,
      timestamp: Date.now(),
    };
    
    const newMessages = [newEntry, ...sharedMessageHistory];
    updateMessages(newMessages);
    
    return newEntry;
  };

  
  const updateVerification = (timestamp: number, result: VerificationResult) => {
    const newMessages = sharedMessageHistory.map((msg) => 
      msg.timestamp === timestamp 
        ? { ...msg, verification: result } 
        : msg
    );
    
    updateMessages(newMessages);
  };

  
  const clearHistory = () => {
    updateMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    messageHistory,
    addMessage,
    updateVerification,
    clearHistory,
  };
}; 