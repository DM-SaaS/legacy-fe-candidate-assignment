import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HistoryCard } from "../HistoryCard";

describe("HistoryCard Component", () => {
  it("toggles history view", () => {
    const toggle = vi.fn();
    render(
      <HistoryCard
        history={[
          {
            message: "msg",
            signature: "sig",
            result: { isValid: true, signer: "0xabc", originalMessage: "msg" },
          },
        ]}
        isOpen={true}
        onToggle={toggle}
      />
    );
    expect(screen.getByText(/message:/i)).toBeInTheDocument();
  });
});
