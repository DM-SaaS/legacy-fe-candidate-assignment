import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../test/test-utils";
import { AuthView } from "../../features/auth/components/AuthView";

// Mock toast - use factory function to avoid hoisting issues
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe("AuthView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the welcome message and sign in button", () => {
      render(<AuthView />);

      expect(screen.getByText("Welcome to Dynamic Wallet")).toBeInTheDocument();
      expect(
        screen.getByText("Sign in with your email to get started")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Connect your wallet or sign in with email to continue"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it("renders the terms and conditions text", () => {
      render(<AuthView />);

      expect(
        screen.getByText(
          "By continuing, you agree to create a secure embedded wallet"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Authentication Flow", () => {
    it("shows sign in button", () => {
      render(<AuthView />);

      const signInButton = screen.getByRole("button", { name: /sign in/i });
      expect(signInButton).toBeInTheDocument();
      expect(signInButton).not.toBeDisabled();
    });

    it("button changes when clicked", () => {
      render(<AuthView />);

      const signInButton = screen.getByRole("button", { name: /sign in/i });
      expect(signInButton).toHaveTextContent("Sign In");

      fireEvent.click(signInButton);

      // The button should be disabled after clicking
      expect(signInButton).toBeDisabled();
    });
  });

  describe("Component Structure", () => {
    it("has proper semantic structure", () => {
      render(<AuthView />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Welcome to Dynamic Wallet"
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("applies correct styling classes", () => {
      render(<AuthView />);

      const heading = screen.getByText("Welcome to Dynamic Wallet");
      const container = heading.closest("div");
      expect(container).toHaveClass("text-center");
    });
  });
});
