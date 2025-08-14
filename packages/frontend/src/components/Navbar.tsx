import React from 'react';
import { LogOut, User, Copy, CheckCircle, ChevronDown, Shield, Settings } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';
import { formatAddress } from '../utils';
import { useDynamicHeadlessAuth } from '../hooks/useDynamicHeadlessAuth';

interface NavbarProps {
  onNavigateToSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToSettings }) => {
  const { 
    isAuthenticated,
    wallet,
    emailAddress,
    logout
  } = useDynamicHeadlessAuth();

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const { copied, copy } = useClipboard();

  const handleCopyAddress = () => {
    if (wallet?.address) {
      copy(wallet.address, 'Address');
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.wallet-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Web3 Message Signer
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative wallet-dropdown">
                <button
                  onClick={handleDropdownToggle}
                  className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-2 transition-colors duration-150"
                >
                  <div className="w-8 h-8 bg-accent-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{emailAddress}</p>
                    <p className="text-xs text-gray-500">
                      {wallet?.address ? formatAddress(wallet.address) : 'Loading...'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{emailAddress}</p>
                          <p className="text-xs text-gray-500">Authenticated via email verification</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Embedded Wallet
                          </span>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-green-600">Active</span>
                          </div>
                        </div>
                        
                        {wallet?.address && (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <span className="text-sm font-mono text-gray-700">
                              {formatAddress(wallet.address)}
                            </span>
                            <button
                              onClick={handleCopyAddress}
                              className="text-xs text-accent-600 hover:text-accent-700 transition-colors flex items-center space-x-1"
                            >
                              {copied ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-2 py-1 space-y-1">
                      {onNavigateToSettings && (
                        <button
                          onClick={() => {
                            onNavigateToSettings();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Not authenticated</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 