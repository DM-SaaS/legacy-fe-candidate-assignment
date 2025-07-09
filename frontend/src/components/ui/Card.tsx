import { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outlined" | "elevated" | "gradient";
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "xl";
}

export function Card({
  children,
  className,
  variant = "default",
  padding = "md",
  rounded = "xl",
}: CardProps) {
  const variants = {
    default: "bg-white shadow-sm border border-gray-100",
    outlined: "bg-white border-2 border-gray-200",
    elevated: "bg-white shadow-lg border border-gray-100",
    gradient:
      "bg-gradient-to-br from-white to-gray-50 shadow-sm border border-gray-100",
  };

  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  const roundings = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
  };

  return (
    <div
      className={cn(
        variants[variant],
        paddings[padding],
        roundings[rounded],
        className
      )}
    >
      {children}
    </div>
  );
}
