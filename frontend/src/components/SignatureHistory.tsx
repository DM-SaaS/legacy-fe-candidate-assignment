'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSignature } from '@/hooks/useSignature';
import { formatTimestamp, formatAddress, copyToClipboard } from '@/lib/utils';
import { History, Copy, Trash2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { SignedMessage } from '@/types';

export function SignatureHistory() {
    const { signedMessages, removeSignedMessage, clearAllMessages } = useSignature();
    const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

    const toggleMessageExpansion = (id: string) => {
        const newExpanded = new Set(expandedMessages);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedMessages(newExpanded);
    };

    const handleCopySignature = async (signature: string) => {
        try {
            await copyToClipboard(signature);
            toast.success('Signature copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy signature');
        }
    };

    const handleCopyMessage = async (message: string) => {
        try {
            await copyToClipboard(message);
            toast.success('Message copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy message');
        }
    };

    const handleDeleteMessage = (id: string) => {
        removeSignedMessage(id);
        toast.success('Message deleted');
    };

    const handleClearAll = () => {
        if (signedMessages.length === 0) return;

        if (confirm('Are you sure you want to clear all signed messages?')) {
            clearAllMessages();
            toast.success('All messages cleared');
        }
    };

    if (signedMessages.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <History className="w-5 h-5" />
                        <span>Signature History</span>
                    </CardTitle>
                    <CardDescription>
                        Your signed messages will appear here
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No signed messages yet</p>
                        <p className="text-sm text-muted-foreground">
                            Sign your first message to see it here
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center space-x-2">
                            <History className="w-5 h-5" />
                            <span>Signature History</span>
                            <span className="text-sm font-normal text-muted-foreground">
                                ({signedMessages.length})
                            </span>
                        </CardTitle>
                        <CardDescription>
                            View and manage your signed messages
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAll}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {signedMessages.map((signedMessage: SignedMessage) => {
                        const isExpanded = expandedMessages.has(signedMessage.id);

                        return (
                            <div
                                key={signedMessage.id}
                                className="border rounded-lg p-4 space-y-3 bg-card"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-muted-foreground">
                                                {formatTimestamp(signedMessage.timestamp)}
                                            </span>
                                            {signedMessage.isVerified !== undefined && (
                                                <div className="flex items-center space-x-1">
                                                    {signedMessage.isVerified ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                            <span className="text-xs text-green-600">Verified</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-4 h-4 text-red-600" />
                                                            <span className="text-xs text-red-600">Failed</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">Message:</p>
                                            <div className="bg-muted p-2 rounded text-sm break-words">
                                                {signedMessage.message}
                                            </div>
                                        </div>

                                        {signedMessage.signer && (
                                            <div>
                                                <p className="text-xs text-muted-foreground">Signer:</p>
                                                <p className="font-mono text-sm">
                                                    {formatAddress(signedMessage.signer, 6)}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex space-x-1 ml-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => toggleMessageExpansion(signedMessage.id)}
                                            className="h-8 w-8"
                                        >
                                            {isExpanded ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteMessage(signedMessage.id)}
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="space-y-2 pt-2 border-t">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-xs text-muted-foreground">Signature:</p>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCopySignature(signedMessage.signature)}
                                                    className="h-6 px-2 text-xs"
                                                >
                                                    <Copy className="w-3 h-3 mr-1" />
                                                    Copy
                                                </Button>
                                            </div>
                                            <div className="bg-muted p-2 rounded font-mono text-xs break-all">
                                                {signedMessage.signature}
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopyMessage(signedMessage.message)}
                                                className="text-xs"
                                            >
                                                <Copy className="w-3 h-3 mr-1" />
                                                Copy Message
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
} 