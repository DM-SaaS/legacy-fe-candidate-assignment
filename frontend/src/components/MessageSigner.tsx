'use client';

import React, { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { PenTool, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSignature } from '@/hooks/useSignature';
import ApiService from '@/lib/api';

export function MessageSigner() {
    const { user, primaryWallet } = useDynamicContext();
    const { addSignedMessage, updateMessageVerification } = useSignature();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignMessage = async () => {
        if (!message.trim()) {
            toast.error('Please enter a message to sign');
            return;
        }

        if (!primaryWallet) {
            toast.error('No wallet connected');
            return;
        }

        setIsLoading(true);

        try {
            const signature = await primaryWallet.connector.signMessage(message);

            if (!signature) {
                throw new Error('Failed to get signature');
            }

            toast.success('Message signed successfully!');

            const signedMessage = addSignedMessage(message, signature as string, primaryWallet.address || '');

            try {
                const verificationResult = await ApiService.verifySignature({
                    message,
                    signature,
                });

                updateMessageVerification(
                    signedMessage.id,
                    verificationResult.isValid,
                    verificationResult.signer
                );

                if (verificationResult.isValid) {
                    toast.success('Signature verified by backend!');
                }
            } catch (verificationError) {
                toast.error('Backend verification failed');
            }

            setMessage('');

        } catch (error: any) {
            toast.error(error.message || 'Failed to sign message');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <PenTool className="w-5 h-5" />
                    <span>Sign Message</span>
                </CardTitle>
                <CardDescription>
                    Enter a custom message to sign with your connected wallet
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Enter your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                    disabled={isLoading}
                />

                <Button
                    onClick={handleSignMessage}
                    disabled={!message.trim() || isLoading}
                    className="w-full"
                    size="lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Signing...
                        </>
                    ) : (
                        <>
                            <PenTool className="w-4 h-4 mr-2" />
                            Sign Message
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
} 