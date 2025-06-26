'use client';

import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatAddress } from '@/lib/utils';
import { Wallet, LogOut, User, Copy } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import toast from 'react-hot-toast';

export function WalletConnection() {
    const { setShowAuthFlow, isAuthenticated, user, handleLogOut, primaryWallet } = useDynamicContext();

    const handleCopyAddress = async () => {
        if (primaryWallet?.address) {
            try {
                await copyToClipboard(primaryWallet.address);
                toast.success('Address copied to clipboard!');
            } catch (error) {
                toast.error('Failed to copy address');
            }
        }
    };

    if (!isAuthenticated || !user) {
        return (
            <Card className="w-full max-w-md mx-auto glass">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>Connect Your Wallet</CardTitle>
                    <CardDescription>
                        Sign in with your wallet to start signing and verifying messages
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={() => setShowAuthFlow(true)}
                        className="w-full"
                        size="lg"
                    >
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto glass">
            <CardHeader>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm">Connected Wallet</CardTitle>
                        <CardDescription className="truncate">
                            {user.email || 'Web3 User'}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="font-mono text-sm">
                            {formatAddress(primaryWallet?.address || '', 6)}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyAddress}
                        className="h-8 w-8"
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>

                <Button
                    onClick={handleLogOut}
                    variant="outline"
                    className="w-full"
                    size="sm"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                </Button>
            </CardContent>
        </Card>
    );
} 