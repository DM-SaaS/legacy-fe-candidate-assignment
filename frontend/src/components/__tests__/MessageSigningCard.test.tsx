import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MessageSigningCard } from "../MessageSigningCard";

describe("MessageSigningCard", () => {
  it("renders the input and button", () => {
    render(
      <MessageSigningCard
        message=""
        onMessageChange={() => {}}
        onSign={() => {}}
        loading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(
      /Enter the message you want to sign.../i
    );
    const button = screen.getByRole("button", {
      name: /Sign & Verify Message/i,
    });

    expect(textarea).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("calls onMessageChange when typing", () => {
    const onChange = vi.fn();
    render(
      <MessageSigningCard
        message=""
        onMessageChange={onChange}
        onSign={() => {}}
        loading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(
      /Enter the message you want to sign.../i
    );
    fireEvent.change(textarea, { target: { value: "Hello world" } });

    expect(onChange).toHaveBeenCalledWith("Hello world");
  });

  it("calls onSign when button is clicked", () => {
    const onSign = vi.fn();
    render(
      <MessageSigningCard
        message="Hello"
        onMessageChange={() => {}}
        onSign={onSign}
        loading={false}
      />
    );

    const button = screen.getByRole("button", {
      name: /Sign & Verify Message/i,
    });
    fireEvent.click(button);

    expect(onSign).toHaveBeenCalled();
  });

  it("disables the button while loading", () => {
    render(
      <MessageSigningCard
        message="Loading..."
        onMessageChange={() => {}}
        onSign={() => {}}
        loading={true}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
