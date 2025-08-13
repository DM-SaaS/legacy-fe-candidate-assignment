'use client';

import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { useDynamicAuth } from '@/hooks/use-dynamic-auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Wallet, Shield, ChevronDown } from 'lucide-react';

export function WalletConnectButton() {
  const { isAuthenticated, walletAddress, handleLogOut, sdkHasLoaded } = useDynamicAuth();

  if (!sdkHasLoaded) {
    return (
      <Button disabled className="h-12 px-6 bg-slate-100 text-slate-400 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      </Button>
    );
  }

  if (isAuthenticated && walletAddress) {
    return (
      <div className="flex items-center gap-3 h-14">
        {/* Wallet Address Display */}
        <div className="bg-gradient-to-r from-emerald-50/90 to-teal-50/90 border-2 border-emerald-200/80 rounded-2xl px-4 py-2 shadow-lg backdrop-blur-sm h-12 flex items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white border-0 text-xs font-bold h-5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-200 mr-1.5 animate-pulse"></div>
                Connected
              </Badge>
              <code className="text-sm font-mono text-slate-700 font-medium">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </code>
            </div>
          </div>
        </div>
        
        {/* Disconnect Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogOut}
          className="h-12 px-4 border-2 border-slate-300/80 hover:border-red-300 hover:bg-red-50/80 rounded-2xl font-semibold text-slate-700 hover:text-red-700 transition-all duration-300 group backdrop-blur-sm"
        >
          <LogOut className="h-4 w-4 mr-2 group-hover:text-red-600" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center h-14">
      <div className="dynamic-wallet-container">
        <DynamicWidget />
      </div>
    </div>
  );
}