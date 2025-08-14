import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { SignedMessage, DynamicWallet } from '../types';
import type { MfaSession } from '../hooks/useMfaAuth';

interface DynamicAuthState {
  isAuthenticating: boolean;
  authStep: 'email' | 'otp' | 'mfa' | 'authenticated' | null;
  emailAddress: string | null;
  wallet: DynamicWallet | null;
  authToken: string | null;
}

interface MfaState {
  session: MfaSession | null;
  isRequired: boolean;
  showModal: boolean;
}

interface AppState {
  isLoading: boolean;
  error: string | null;
  signatureHistory: SignedMessage[];
  verifyingIds: Set<string>;
  dynamicAuth: DynamicAuthState;
  mfa: MfaState;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_SIGNATURE'; payload: SignedMessage }
  | { type: 'UPDATE_SIGNATURE'; payload: { id: string; updates: Partial<SignedMessage> } }
  | { type: 'REMOVE_SIGNATURE'; payload: string }
  | { type: 'CLEAR_SIGNATURES' }
  | { type: 'SET_VERIFYING'; payload: { id: string; isVerifying: boolean } }
  | { type: 'SET_AUTH_STEP'; payload: DynamicAuthState['authStep'] }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_WALLET'; payload: DynamicWallet | null }
  | { type: 'SET_AUTH_TOKEN'; payload: string }
  | { type: 'SET_AUTHENTICATING'; payload: boolean }
  | { type: 'RESET_AUTH' }
  | { type: 'SET_MFA_SESSION'; payload: MfaSession | null }
  | { type: 'SET_MFA_REQUIRED'; payload: boolean }
  | { type: 'SET_MFA_MODAL'; payload: boolean }
  | { type: 'CLEAR_MFA' };

const initialState: AppState = {
  isLoading: false,
  error: null,
  signatureHistory: [],
  verifyingIds: new Set(),
  dynamicAuth: {
    isAuthenticating: false,
    authStep: null,
    emailAddress: null,
    wallet: null,
    authToken: null,
  },
  mfa: {
    session: null,
    isRequired: false,
    showModal: false,
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'ADD_SIGNATURE':
      return {
        ...state,
        signatureHistory: [action.payload, ...state.signatureHistory].slice(0, 50),
      };
    
    case 'UPDATE_SIGNATURE':
      return {
        ...state,
        signatureHistory: state.signatureHistory.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, ...action.payload.updates }
            : msg
        ),
      };
    
    case 'REMOVE_SIGNATURE':
      return {
        ...state,
        signatureHistory: state.signatureHistory.filter(msg => msg.id !== action.payload),
      };
    
    case 'CLEAR_SIGNATURES':
      return { ...state, signatureHistory: [] };
    
    case 'SET_VERIFYING':
      const newVerifyingIds = new Set(state.verifyingIds);
      if (action.payload.isVerifying) {
        newVerifyingIds.add(action.payload.id);
      } else {
        newVerifyingIds.delete(action.payload.id);
      }
      return { ...state, verifyingIds: newVerifyingIds };
    
    case 'SET_AUTH_STEP':
      return {
        ...state,
        dynamicAuth: { ...state.dynamicAuth, authStep: action.payload }
      };
    
    case 'SET_EMAIL':
      return {
        ...state,
        dynamicAuth: { ...state.dynamicAuth, emailAddress: action.payload }
      };
    
    case 'SET_WALLET':
      return {
        ...state,
        dynamicAuth: { ...state.dynamicAuth, wallet: action.payload }
      };
    
    case 'SET_AUTH_TOKEN':
      return {
        ...state,
        dynamicAuth: { ...state.dynamicAuth, authToken: action.payload }
      };
    
    case 'SET_AUTHENTICATING':
      return {
        ...state,
        dynamicAuth: { ...state.dynamicAuth, isAuthenticating: action.payload }
      };
    
    case 'RESET_AUTH':
      return {
        ...state,
        dynamicAuth: {
          isAuthenticating: false,
          authStep: null,
          emailAddress: null,
          wallet: null,
          authToken: null,
        }
      };
    
    case 'SET_MFA_SESSION':
      return {
        ...state,
        mfa: { ...state.mfa, session: action.payload }
      };
    
    case 'SET_MFA_REQUIRED':
      return {
        ...state,
        mfa: { ...state.mfa, isRequired: action.payload }
      };
    
    case 'SET_MFA_MODAL':
      return {
        ...state,
        mfa: { ...state.mfa, showModal: action.payload }
      };
    
    case 'CLEAR_MFA':
      return {
        ...state,
        mfa: {
          session: null,
          isRequired: false,
          showModal: false,
        }
      };
    
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addSignature: (signature: SignedMessage) => void;
    updateSignature: (id: string, updates: Partial<SignedMessage>) => void;
    removeSignature: (id: string) => void;
    clearSignatures: () => void;
    setVerifying: (id: string, isVerifying: boolean) => void;
    setAuthStep: (step: DynamicAuthState['authStep']) => void;
    setEmail: (email: string) => void;
    setWallet: (wallet: DynamicWallet | null) => void;
    setAuthToken: (token: string) => void;
    setAuthenticating: (authenticating: boolean) => void;
    resetAuth: () => void;
    setMfaSession: (session: MfaSession | null) => void;
    setMfaRequired: (required: boolean) => void;
    setMfaModal: (show: boolean) => void;
    clearMfa: () => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    addSignature: (signature: SignedMessage) => dispatch({ type: 'ADD_SIGNATURE', payload: signature }),
    updateSignature: (id: string, updates: Partial<SignedMessage>) =>
      dispatch({ type: 'UPDATE_SIGNATURE', payload: { id, updates } }),
    removeSignature: (id: string) => dispatch({ type: 'REMOVE_SIGNATURE', payload: id }),
    clearSignatures: () => dispatch({ type: 'CLEAR_SIGNATURES' }),
    setVerifying: (id: string, isVerifying: boolean) =>
      dispatch({ type: 'SET_VERIFYING', payload: { id, isVerifying } }),
    setAuthStep: (step: DynamicAuthState['authStep']) =>
      dispatch({ type: 'SET_AUTH_STEP', payload: step }),
    setEmail: (email: string) => dispatch({ type: 'SET_EMAIL', payload: email }),
    setWallet: (wallet: DynamicWallet | null) => dispatch({ type: 'SET_WALLET', payload: wallet }),
    setAuthToken: (token: string) => dispatch({ type: 'SET_AUTH_TOKEN', payload: token }),
    setAuthenticating: (authenticating: boolean) =>
      dispatch({ type: 'SET_AUTHENTICATING', payload: authenticating }),
    resetAuth: () => dispatch({ type: 'RESET_AUTH' }),
    setMfaSession: (session: MfaSession | null) => dispatch({ type: 'SET_MFA_SESSION', payload: session }),
    setMfaRequired: (required: boolean) => dispatch({ type: 'SET_MFA_REQUIRED', payload: required }),
    setMfaModal: (show: boolean) => dispatch({ type: 'SET_MFA_MODAL', payload: show }),
    clearMfa: () => dispatch({ type: 'CLEAR_MFA' }),
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 