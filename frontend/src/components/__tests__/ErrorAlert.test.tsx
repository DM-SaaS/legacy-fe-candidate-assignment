import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorAlert } from "../ErrorAlert";

describe("ErrorAlert Component", () => {
  it("displays and dismisses error alert", () => {
    const dismiss = vi.fn();
    render(<ErrorAlert error="Test error" onDismiss={dismiss} />);
    expect(screen.getByText(/test error/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(dismiss).toHaveBeenCalled();
  });

  it("renders with correct styles", () => {
    const { container } = render(
      <ErrorAlert error="Test error" onDismiss={() => {}} />
    );
    expect(container.firstChild).toHaveClass(
      "bg-red-50 border border-red-200 rounded-xl p-4"
    );
    expect(screen.getByText(/test error/i)).toHaveClass("text-red-800 text-sm");
  });
});
