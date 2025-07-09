import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "danger" | "ghost";
  size?: "sm" | "md";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "hover:bg-gray-100 text-gray-400 hover:text-gray-600",
      danger: "hover:bg-red-50 text-gray-400 hover:text-red-500",
      ghost: "hover:bg-gray-100 text-gray-600",
    };

    const sizes = {
      sm: "p-1",
      md: "p-2",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

IconButton.displayName = "IconButton";
