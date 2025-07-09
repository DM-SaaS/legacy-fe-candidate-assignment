import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../test/test-utils";
import { Button } from "../../components/ui/Button";
import { Mail } from "lucide-react";

describe("Button", () => {
  describe("Rendering", () => {
    it("renders button with text", () => {
      render(<Button>Click me</Button>);

      expect(
        screen.getByRole("button", { name: /click me/i })
      ).toBeInTheDocument();
    });

    it("renders button with icon", () => {
      render(<Button icon={Mail}>Send Email</Button>);

      const button = screen.getByRole("button", { name: /send email/i });
      expect(button).toBeInTheDocument();
    });

    it("renders loading state", () => {
      render(<Button isLoading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  describe("Variants", () => {
    it("applies primary variant classes", () => {
      render(<Button variant="primary">Primary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary-600");
    });

    it("applies secondary variant classes", () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-white", "border-gray-200");
    });

    it("applies ghost variant classes", () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-transparent");
    });
  });

  describe("Sizes", () => {
    it("applies small size classes", () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-3", "py-1.5", "text-sm");
    });

    it("applies medium size classes", () => {
      render(<Button size="md">Medium</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-4", "py-2");
    });

    it("applies large size classes", () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-6", "py-3", "text-lg");
    });
  });

  describe("Interactions", () => {
    it("calls onClick when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not call onClick when loading", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} isLoading>
          Loading
        </Button>
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("States", () => {
    it("shows disabled state", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("shows loading state with loading text", () => {
      render(<Button isLoading>Loading</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent("Loading...");
    });

    it("shows icon only mode", () => {
      render(<Button icon={Mail} iconOnly />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has correct button type", () => {
      render(<Button type="submit">Submit</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("supports custom className", () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("supports aria attributes", () => {
      render(<Button aria-label="Custom label">Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Custom label");
    });
  });
});
