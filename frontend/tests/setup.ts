import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Mock Dynamic.xyz
vi.mock('@dynamic-labs/sdk-react-core', () => ({
  useDynamicContext: () => ({
    isAuthenticated: true,
    primaryWallet: {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1234',
      signMessage: vi.fn().mockResolvedValue('0xmockedsignature'),
    },
    user: {
      email: 'test@example.com',
    },
    handleLogOut: vi.fn(),
    setShowAuthFlow: vi.fn(),
  }),
  DynamicContextProvider: ({ children }: any) => children,
}));
