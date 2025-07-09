import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../../stores/authStore";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("authStore", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();

    // Reset the store to initial state
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.clearAuth();
    });
  });

  describe("Initial State", () => {
    it("should have correct initial state when no data in localStorage", () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.userEmail).toBeNull();
      expect(result.current.walletAddress).toBeNull();
      expect(result.current.messageHistory).toEqual([]);
    });
  });

  describe("setUserData", () => {
    it("should set user data and mark as authenticated", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUserData("test@example.com", "0x123...");
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.userEmail).toBe("test@example.com");
      expect(result.current.walletAddress).toBe("0x123...");
    });

    it("should handle empty email", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUserData("", "0x123...");
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.userEmail).toBe("");
      expect(result.current.walletAddress).toBe("0x123...");
    });

    it("should handle empty wallet address", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUserData("test@example.com", "");
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.userEmail).toBe("test@example.com");
      expect(result.current.walletAddress).toBe("");
    });
  });

  describe("setAuthenticated", () => {
    it("should update authentication status", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setAuthenticated(true);
      });

      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.setAuthenticated(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("clearAuth", () => {
    it("should clear user data and mark as unauthenticated", () => {
      const { result } = renderHook(() => useAuthStore());

      // First set some user data
      act(() => {
        result.current.setUserData("test@example.com", "0x123...");
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then clear auth
      act(() => {
        result.current.clearAuth();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.userEmail).toBeNull();
      expect(result.current.walletAddress).toBeNull();
      expect(result.current.messageHistory).toEqual([]);
    });

    it("should handle clearAuth when already logged out", () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.isAuthenticated).toBe(false);

      // Clear auth when already logged out should not cause errors
      act(() => {
        result.current.clearAuth();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.userEmail).toBeNull();
    });
  });

  describe("Message History", () => {
    const mockMessage = {
      id: "1",
      message: "Hello World",
      signature: "0xsignature...",
      timestamp: Date.now(),
      signer: "0x123...",
      verified: true,
    };

    it("should add message to history", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.addMessage(mockMessage);
      });

      expect(result.current.messageHistory).toHaveLength(1);
      expect(result.current.messageHistory[0]).toEqual(mockMessage);
    });

    it("should persist message history to localStorage", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.addMessage(mockMessage);
      });

      const stored = localStorageMock.getItem("messageHistory");
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toEqual(mockMessage);
    });

    it("should delete message from history", () => {
      const { result } = renderHook(() => useAuthStore());

      // Add message first
      act(() => {
        result.current.addMessage(mockMessage);
      });

      expect(result.current.messageHistory).toHaveLength(1);

      // Delete message
      act(() => {
        result.current.deleteMessage("1");
      });

      expect(result.current.messageHistory).toHaveLength(0);
    });

    it("should load message history from localStorage", () => {
      // Pre-populate localStorage
      localStorageMock.setItem("messageHistory", JSON.stringify([mockMessage]));

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.loadMessageHistory();
      });

      expect(result.current.messageHistory).toHaveLength(1);
      expect(result.current.messageHistory[0]).toEqual(mockMessage);
    });

    it("should handle invalid JSON in localStorage gracefully", () => {
      // Set invalid JSON
      localStorageMock.setItem("messageHistory", "invalid json");

      const { result } = renderHook(() => useAuthStore());

      // Should not throw an error
      expect(() => {
        act(() => {
          result.current.loadMessageHistory();
        });
      }).not.toThrow();

      // Should keep existing state
      expect(result.current.messageHistory).toEqual([]);
    });
  });

  describe("State Reactivity", () => {
    it("should trigger re-renders when state changes", () => {
      const { result } = renderHook(() => useAuthStore());

      const initialAuth = result.current.isAuthenticated;
      expect(initialAuth).toBe(false);

      act(() => {
        result.current.setUserData("test@example.com", "0x123...");
      });

      // State should have changed
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isAuthenticated).not.toBe(initialAuth);
    });

    it("should maintain consistent state across multiple hook calls", () => {
      const { result: result1 } = renderHook(() => useAuthStore());
      const { result: result2 } = renderHook(() => useAuthStore());

      act(() => {
        result1.current.setUserData("test@example.com", "0x123...");
      });

      // Both hooks should see the same state
      expect(result1.current.isAuthenticated).toBe(true);
      expect(result2.current.isAuthenticated).toBe(true);
      expect(result1.current.userEmail).toBe(result2.current.userEmail);
      expect(result1.current.walletAddress).toBe(result2.current.walletAddress);
    });
  });
});
