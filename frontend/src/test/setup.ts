import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      pathname: "/test",
      search: "",
      hash: "",
      state: null,
      key: "test",
    }),
  };
});

// Mock Dynamic Labs SDK
vi.mock("@dynamic-labs/sdk-react-core", () => ({
  useDynamicContext: () => ({
    user: null,
    primaryWallet: null,
    isAuthenticated: false,
    setShowAuthFlow: vi.fn(),
  }),
  DynamicContextProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  DynamicWidget: () => null,
}));

// Mock Zustand stores
vi.mock("@/stores/authStore", () => ({
  useAuthStore: () => ({
    isAuthenticated: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Global fetch mock
global.fetch = vi.fn();

// Mock window.matchMedia for responsive design testing
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
