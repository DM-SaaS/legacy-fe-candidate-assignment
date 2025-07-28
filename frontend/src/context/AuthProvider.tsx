import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { DynamicContextProvider, useDynamicContext } from '@dynamic-labs/sdk-react';
import { AuthContext } from './authContext';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const DYNAMIC_ENVIRONMENT_ID = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID;

  const DynamicAuthHandler = () => {
    const dynamicContext = useDynamicContext();
    const { user, primaryWallet, isAuthenticated: isDynamicAuthenticated } = dynamicContext;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    
    useEffect(() => {
      if (isDynamicAuthenticated && primaryWallet?.address) {
        setIsAuthenticated(true);
        setWalletAddress(primaryWallet.address);
        console.log('User authenticated with wallet address:', primaryWallet.address);
      } else {
        setIsAuthenticated(false);
        setWalletAddress(null);
      }
    }, [isDynamicAuthenticated, primaryWallet, user]);

    const signMessage = async (message: string): Promise<string | null> => {
      if (!isAuthenticated || !walletAddress) return null;
      try {
        console.log('Signing message with wallet:', walletAddress);
        if (typeof (dynamicContext as any).handleSignMessage === 'function') {
          const signature = await (dynamicContext as any).handleSignMessage(message);
          console.log('Signed message with handleSignMessage:', signature);
          return signature || null;
        }
        if (dynamicContext.walletConnector) {
          const signature = await dynamicContext.walletConnector.signMessage(message);
          console.log('Signed message with walletConnector:', signature);
          return signature || null;
        } 
        if (primaryWallet) {
          const signature = typeof (primaryWallet.connector as any)?.signMessage === 'function' 
            ? await (primaryWallet.connector as any).signMessage(message) 
            : typeof (primaryWallet as any).sign === 'function'
              ? await (primaryWallet as any).sign(message)
              : null;
          if (signature) {
            console.log('Signed message with primaryWallet:', signature);
            return signature;
          }
        }
        console.error('No suitable signing method found on wallet');
        return null;
      } catch (error) {
        console.error('Error signing message with wallet:', error);
        return null;
      }
    };

    const logout = async () => {
      if (dynamicContext && typeof dynamicContext.handleLogOut === 'function') {
        await dynamicContext.handleLogOut();
        setIsAuthenticated(false);
        setWalletAddress(null);
        console.log('User logged out');
      } else {
        console.error('Logout function not available');
      }
    };

    return (
      <AuthContext.Provider
        value={{
          isAuthenticated,
          walletAddress,
          signMessage,
          logout
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENVIRONMENT_ID,
      }}
    >
      <DynamicAuthHandler />
    </DynamicContextProvider>
  );
};

export default AuthProvider; 