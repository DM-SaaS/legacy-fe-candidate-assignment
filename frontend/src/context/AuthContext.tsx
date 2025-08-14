import { TOKEN_STORAGE_KEY, EMAIL_STORAGE_KEY } from '../constants';
import React, { createContext, useState, useContext } from 'react';
import { localStorageUtils } from '../services';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token: string, email: string) => {
    localStorageUtils.setItem(EMAIL_STORAGE_KEY, email);
    localStorageUtils.setItem(TOKEN_STORAGE_KEY, token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorageUtils.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
