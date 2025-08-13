import { render, screen } from "@testing-library/react";
import { ResultCard } from "../ResultCard";
import { describe, it, expect } from "vitest";

describe("ResultCard", () => {
  it("displays result correctly", () => {
    render(
      <ResultCard
        result={{ isValid: true, signer: "0x1234", originalMessage: "test" }}
      />
    );

    expect(screen.getByText(/Valid Signature/i)).toBeInTheDocument();
    expect(screen.getByText(/0x1234/i)).toBeInTheDocument();
  });
});
