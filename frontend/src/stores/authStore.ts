import { create } from "zustand";
import { SignedMessage } from "../types";

interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  walletAddress: string | null;
  messageHistory: SignedMessage[];

  setAuthenticated: (authenticated: boolean) => void;
  setUserData: (email: string, address: string) => void;
  addMessage: (message: SignedMessage) => void;
  deleteMessage: (id: string) => void;
  loadMessageHistory: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  userEmail: null,
  walletAddress: null,
  messageHistory: [],

  setAuthenticated: authenticated => set({ isAuthenticated: authenticated }),

  setUserData: (email, address) =>
    set({
      userEmail: email,
      walletAddress: address,
      isAuthenticated: true,
    }),

  addMessage: message =>
    set(state => {
      const newHistory = [message, ...state.messageHistory];
      localStorage.setItem("messageHistory", JSON.stringify(newHistory));
      return { messageHistory: newHistory };
    }),

  deleteMessage: id =>
    set(state => {
      const newHistory = state.messageHistory.filter(msg => msg.id !== id);
      localStorage.setItem("messageHistory", JSON.stringify(newHistory));
      return { messageHistory: newHistory };
    }),

  loadMessageHistory: () => {
    const stored = localStorage.getItem("messageHistory");
    if (stored) {
      try {
        const history = JSON.parse(stored);
        set({ messageHistory: history });
      } catch (error) {
        console.error("Failed to load message history:", error);
      }
    }
  },

  clearAuth: () => {
    localStorage.removeItem("messageHistory");
    set({
      isAuthenticated: false,
      userEmail: null,
      walletAddress: null,
      messageHistory: [],
    });
  },
}));

// Listen for storage changes (sync between tabs)
window.addEventListener("storage", e => {
  if (e.key === "messageHistory") {
    const state = useAuthStore.getState();
    state.loadMessageHistory();
  }
});
