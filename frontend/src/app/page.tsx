'use client';
import { useEffect } from 'react';
import { WalletConnectButton } from '@/components/ui/wallet-connect-button';
import { MessageSigner } from '@/components/message-signer';
import { SigningHistory } from '@/components/signing-history';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  MessageSquare, 
  History, 
  CheckCircle,
  Zap,
  Lock,
  Globe,
  Github,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Users,
  TrendingUp
} from 'lucide-react';

export default function HomePage() {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar-scroll');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 navbar-scroll">
        <div className="container mx-auto">
          <div className="navbar-container">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="logo-icon h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="logo-text text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    MessageSafe
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">Enterprise Web3 Security</p>
                </div>
              </div>
              <div className="flex items-center gap-4 h-full">
                <WalletConnectButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-indigo-200/40 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-semibold text-slate-700">Powered by Dynamic.xyz</span>
              </div>
              <div className="h-4 w-px bg-slate-300"></div>
              <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 text-xs font-bold">
                Enterprise Ready
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent">
                Secure Message
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Verification
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Professional-grade Web3 message signing and verification platform. 
              Connect any wallet, sign messages, and verify signatures with enterprise security.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
                onClick={() => window.open('https://github.com/DM-SaaS/legacy-fe-candidate-assignment', '_blank')}
              >
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span className="text-3xl font-bold text-slate-900">10K+</span>
                </div>
                <p className="text-slate-600 font-medium">Active Users</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-3xl font-bold text-slate-900">100%</span>
                </div>
                <p className="text-slate-600 font-medium">Secure Verification</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-3xl font-bold text-slate-900">99.9%</span>
                </div>
                <p className="text-slate-600 font-medium">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built for security, designed for scale, optimized for developer experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Military-Grade Security</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  Cryptographic message signing using elliptic curve digital signatures with enterprise-level security protocols
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  Real-time signature verification with sub-second response times and instant cryptographic proof validation
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <History className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Complete Audit Trail</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  Comprehensive signing history with detailed analytics, export capabilities, and forensic-grade audit logging
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Application */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Start Signing Messages
              </h2>
              <p className="text-xl text-slate-600">
                Connect your wallet and experience enterprise-grade message verification
              </p>
            </div>
            
            {/* Sidebar Layout */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
              <Tabs defaultValue="signer" orientation="vertical">
                <div className="flex min-h-[700px]">
                  {/* Sidebar Navigation */}
                  <div className="w-80 bg-gradient-to-b from-slate-50 to-slate-100/80 border-r border-slate-200/50 p-6 flex-shrink-0">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-6 px-4">Navigation</h3>
                      
                      <TabsList className="flex flex-col h-auto bg-transparent space-y-3 p-0 w-full">
                        <TabsTrigger 
                          value="signer" 
                          className="w-full justify-start gap-3 h-12 px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold text-slate-600 hover:bg-slate-200/50 transition-all duration-300 border-0 bg-transparent"
                        >
                          <MessageSquare className="h-5 w-5" />
                          Sign Message
                        </TabsTrigger>
                        <TabsTrigger 
                          value="history" 
                          className="w-full justify-start gap-3 h-12 px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold text-slate-600 hover:bg-slate-200/50 transition-all duration-300 border-0 bg-transparent"
                        >
                          <History className="h-5 w-5" />
                          History
                        </TabsTrigger>
                      </TabsList>
                      
                      {/* Sidebar Info Panel */}
                      <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                        <h4 className="font-semibold text-slate-900 mb-2">Quick Info</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Sign custom messages</li>
                          <li>• Verify signatures</li>
                          <li>• View audit trail</li>
                          <li>• Export data</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 flex flex-col">
                    <TabsContent value="signer" className="flex-1 p-8 m-0 overflow-y-auto">
                      <div className="max-w-4xl mx-auto">
                        <MessageSigner />
                      </div>
                    </TabsContent>

                    <TabsContent value="history" className="flex-1 p-8 m-0 overflow-hidden">
                      <div className="max-w-4xl mx-auto h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-2xl font-bold text-slate-900">Signing History</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <History className="h-4 w-4" />
                            <span>Audit Trail</span>
                          </div>
                        </div>
                        
                        {/* History with max height and scrolling */}
                        <div className="flex-1 max-h-[500px] overflow-y-auto pr-2">
                          <SigningHistory />
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    MessageSafe
                  </h3>
                  <p className="text-slate-400 text-sm">Enterprise Web3 Security</p>
                </div>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-md">
                Professional-grade Web3 message signing and verification platform built for enterprise security and developer experience.
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-emerald-600 text-white border-0">
                  <div className="h-2 w-2 rounded-full bg-emerald-200 mr-2 animate-pulse"></div>
                  System Online
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  v1.0.0
                </Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Technology</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
                  Next.js 15
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                  TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                  Dynamic.xyz
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-400"></div>
                  Tailwind CSS
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://dynamic.xyz" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Dynamic.xyz Docs
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="https://github.com/DM-SaaS/legacy-fe-candidate-assignment" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub Repository
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-400 text-sm">
                © 2025 MessageSafe. Built with enterprise-grade security for Web3 message verification.
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  All systems operational
                </span>
                <span>99.9% uptime</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}