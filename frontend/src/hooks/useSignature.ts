import { useState, useEffect } from 'react';
import { SignedMessage } from '@/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'signedMessages';

export function useSignature() {
    const [signedMessages, setSignedMessages] = useState<SignedMessage[]>([]);

    // Load messages from localStorage on component mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Convert timestamp strings back to Date objects
                const messages = parsed.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                }));
                setSignedMessages(messages);
            }
        } catch (error) {
            console.error('Error loading signed messages from localStorage:', error);
        }
    }, []);

    // Save messages to localStorage whenever signedMessages changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(signedMessages));
        } catch (error) {
            console.error('Error saving signed messages to localStorage:', error);
        }
    }, [signedMessages]);

    const addSignedMessage = (message: string, signature: string, signer?: string) => {
        const newMessage: SignedMessage = {
            id: generateId(),
            message,
            signature,
            timestamp: new Date(),
            signer,
            isVerified: false,
        };

        setSignedMessages((prev) => [newMessage, ...prev]);
        return newMessage;
    };

    const updateMessageVerification = (id: string, isVerified: boolean, signer?: string) => {
        setSignedMessages((prev) =>
            prev.map((msg) =>
                msg.id === id
                    ? { ...msg, isVerified, signer: signer || msg.signer }
                    : msg
            )
        );
    };

    const removeSignedMessage = (id: string) => {
        setSignedMessages((prev) => prev.filter((msg) => msg.id !== id));
    };

    const clearAllMessages = () => {
        setSignedMessages([]);
    };

    return {
        signedMessages,
        addSignedMessage,
        updateMessageVerification,
        removeSignedMessage,
        clearAllMessages,
    };
} 