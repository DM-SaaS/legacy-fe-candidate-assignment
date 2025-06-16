import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MessageSigner from "../MessageSigner";
import type { Address } from "../../types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockAddress: Address = "0x1234567890abcdef1234567890abcdef12345678";
const queryClient = new QueryClient();

describe("MessageSigner", () => {
  it("renders all sections properly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MessageSigner address={mockAddress} />
      </QueryClientProvider>
    );

    expect(
      screen.getByText(/Your wallet is connected/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter the message you want to sign.../i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign & Verify Message/i })
    ).toBeInTheDocument();
  });

  it("disables button while loading", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MessageSigner address={mockAddress} />
      </QueryClientProvider>
    );

    const button = screen.getByRole("button", { name: /sign & verify/i });
    fireEvent.click(button);
    expect(button).toBeDisabled();
  });

  it("handles user input", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MessageSigner address={mockAddress} />
      </QueryClientProvider>
    );

    const textarea = screen.getByPlaceholderText(/Enter the message you want to sign.../i);
    fireEvent.change(textarea, { target: { value: "Hello world" } });

    await waitFor(() => {
      expect((textarea as HTMLTextAreaElement).value).toBe("Hello world");
    });
  });
});
