import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Dynamic.xyz
jest.mock("@dynamic-labs/sdk-react-core", () => ({
  DynamicContextProvider: ({ children }) => children,
  useDynamicContext: () => ({
    isAuthenticated: false,
    user: null,
    primaryWallet: null,
    setShowAuthFlow: jest.fn(),
    handleLogOut: jest.fn(),
  }),
}));

// Mock ethers.js
jest.mock("ethers", () => ({
  ethers: {
    verifyMessage: jest.fn(),
    hashMessage: jest.fn(),
  },
}));

// Mock Web APIs
global.navigator = {
  ...global.navigator,
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
