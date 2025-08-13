'use client';

import { useState } from 'react';
import { useDynamicAuth } from '@/hooks/use-dynamic-auth';
import { useSigningHistory } from '@/hooks/use-signing-history';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  MessageSquare, 
  Shield,
  Copy,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

export function MessageSigner() {
  const { isAuthenticated, error, signAndVerifyMessage, walletAddress } = useDynamicAuth();
  const { addToHistory } = useSigningHistory();
  
  const [message, setMessage] = useState('');
  const [lastResult, setLastResult] = useState<{
    id: string;
    message: string;
    signature: string;
    signer: string;
    timestamp: number;
    isValid?: boolean;
    verificationResult?: {
      isValid: boolean;
      signer: string;
      originalMessage: string;
    };
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSignMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message to sign');
      return;
    }

    setIsProcessing(true);
    setLastResult(null);

    try {
      const result = await signAndVerifyMessage(message);
      setLastResult(result);
      addToHistory(result);
      
      if (result.isValid) {
        toast.success('Message signed and verified successfully!');
      } else {
        toast.warning('Message signed but verification failed');
      }
      
      // Clear the message after successful signing
      setMessage('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign message';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full">
              <Shield className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-amber-900">Wallet Connection Required</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Connect your Web3 wallet to access enterprise-grade message signing and verification capabilities
            </p>
          </div>

          {/* Connection Card */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-200/50 shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Secure Authentication Required
              </h3>
              <p className="text-lg text-slate-600">
                Connect with your email or wallet to begin signing messages with cryptographic security
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">Custom Message Signing</h4>
                    <p className="text-sm text-slate-600">Sign any message with your wallet</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">Instant Verification</h4>
                    <p className="text-sm text-slate-600">Real-time signature validation</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">Complete History</h4>
                    <p className="text-sm text-slate-600">Track all signed messages</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">Export Capabilities</h4>
                    <p className="text-sm text-slate-600">Download your signed data</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl">
                <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-indigo-900 font-semibold">Click "Connect Wallet" in the top navigation to get started</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-lg mb-1">Enterprise Security</h4>
                <p className="text-slate-600">Your wallet connection is secured with enterprise-grade encryption. We never store your private keys.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
          <span className="font-semibold text-indigo-900">Professional Message Signing</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Sign Your Message
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Enter your custom message below and sign it with enterprise-grade cryptographic security
        </p>
      </div>

      {/* Message Input Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-200/50 shadow-xl p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="message" className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                Message Content
              </Label>
              <Textarea
                id="message"
                placeholder="Enter your message here... (e.g., 'Hello Web3 World!', 'I am signing this message on [current date]')"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="resize-none text-lg border-2 border-slate-200 focus:border-indigo-500 rounded-2xl p-4 bg-white/80 backdrop-blur-sm transition-all duration-300"
              />
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-medium">Connected: {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-slate-50 border-slate-300">
                    {message.length} characters
                  </Badge>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-900">Signing Error</h4>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleSignMessage} 
              disabled={!message.trim() || isProcessing || !isAuthenticated}
              className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl group"
              size="lg"
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Signing & Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 group-hover:gap-4 transition-all duration-300">
                  <Shield className="h-6 w-6" />
                  <span>Sign & Verify Message</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Latest Result Card */}
      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {lastResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Latest Signature Result
              <Badge variant={lastResult.isValid ? "default" : "destructive"}>
                {lastResult.isValid ? "Valid" : "Invalid"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {/* Original Message */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Original Message</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm break-words">{lastResult.message}</p>
                </div>
              </div>
              
              {/* Signature */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Signature</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-gray-50 rounded-lg text-xs break-all">
                    {lastResult.signature}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(lastResult.signature, 'Signature')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Verification Details */}
              {lastResult.verificationResult && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Verification Details</Label>
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge variant={lastResult.verificationResult.isValid ? "default" : "destructive"}>
                        {lastResult.verificationResult.isValid ? "Valid" : "Invalid"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Recovered Signer:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs">{lastResult.verificationResult?.signer}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(lastResult.verificationResult?.signer || '', 'Signer address')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Signed At:</span>
                      <span>{new Date(lastResult.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}