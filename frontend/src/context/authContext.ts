import { createContext, useContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  walletAddress: string | null;
  signMessage: (message: string) => Promise<string | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  walletAddress: null,
  signMessage: async () => null,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext); 