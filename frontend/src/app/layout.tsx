import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DynamicProvider from '@/components/DynamicProvider';
import { SignatureProvider } from '@/hooks/useSignature';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Web3 Signature Verifier',
    description: 'A beautiful Web3 app for signing and verifying messages with Dynamic.xyz wallet integration',
    keywords: ['Web3', 'Ethereum', 'Signature', 'Dynamic.xyz', 'DeFi'],
    authors: [{ name: 'Web3 Developer' }],
    colorScheme: 'light dark',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <DynamicProvider>
                    <SignatureProvider>
                        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                            {children}
                        </div>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: 'hsl(var(--card))',
                                    color: 'hsl(var(--card-foreground))',
                                    border: '1px solid hsl(var(--border))',
                                },
                            }}
                        />
                    </SignatureProvider>
                </DynamicProvider>
            </body>
        </html>
    );
} 