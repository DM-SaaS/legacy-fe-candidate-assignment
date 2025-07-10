import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";
import { Spinner } from "./Spinner";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      icon: Icon,
      iconPosition = "left",
      iconOnly = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25",
      secondary:
        "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
      ghost: "bg-transparent hover:bg-gray-100",
    };

    const sizes = {
      sm: iconOnly ? "p-1.5" : "px-3 py-1.5 text-sm",
      md: iconOnly ? "p-2" : "px-4 py-2",
      lg: iconOnly ? "p-3" : "px-6 py-3 text-lg",
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const renderIcon = () => {
      if (!Icon) return null;
      return (
        <Icon
          className={cn(
            iconSizes[size],
            children && !iconOnly && (iconPosition === "left" ? "mr-2" : "ml-2")
          )}
        />
      );
    };

    const renderContent = () => {
      if (isLoading) {
        return (
          <>
            <Spinner
              size="sm"
              className={cn(children && !iconOnly ? "mr-2" : "")}
            />
            {!iconOnly && "Loading..."}
          </>
        );
      }

      if (iconOnly && Icon) {
        return renderIcon();
      }

      if (iconPosition === "right") {
        return (
          <>
            {children}
            {renderIcon()}
          </>
        );
      }

      return (
        <>
          {renderIcon()}
          {children}
        </>
      );
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

Button.displayName = "Button";
