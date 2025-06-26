'use client';

import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { WalletConnection } from '@/components/WalletConnection';
import { MessageSigner } from '@/components/MessageSigner';
import { SignatureHistory } from '@/components/SignatureHistory';
import { Sparkles, Shield, Zap } from 'lucide-react';

export default function HomePage() {
    const { isAuthenticated } = useDynamicContext();

    return (
        <div className="min-h-screen py-8 px-4">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Web3 Signature Verifier
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Sign custom messages with your wallet and verify them with our secure backend.
                        Built with Dynamic.xyz for seamless Web3 authentication.
                    </p>

                    {/* Feature highlights */}
                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span>Dynamic.xyz Integration</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Shield className="w-4 h-4 text-primary" />
                            <span>Cryptographic Verification</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Zap className="w-4 h-4 text-primary" />
                            <span>Real-time Validation</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto">
                {!isAuthenticated ? (
                    /* Authentication View */
                    <div className="flex justify-center">
                        <WalletConnection />
                    </div>
                ) : (
                    /* Authenticated View */
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Left Column: Wallet Info & Message Signer */}
                        <div className="space-y-6">
                            <WalletConnection />
                            <MessageSigner />
                        </div>

                        {/* Right Column: Signature History */}
                        <div>
                            <SignatureHistory />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="max-w-6xl mx-auto mt-16 pt-8 border-t text-center">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Built with Next.js, TypeScript, Dynamic.xyz, and NestJS
                    </p>
                    <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
                        <span>🔐 Secure Message Signing</span>
                        <span>⚡ Real-time Verification</span>
                        <span>🌐 Web3 Native</span>
                    </div>
                </div>
            </footer>
        </div>
    );
} 