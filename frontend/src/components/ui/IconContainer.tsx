import { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface IconContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "accent";
  className?: string;
}

export function IconContainer({
  children,
  size = "md",
  variant = "primary",
  className,
}: IconContainerProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const variants = {
    primary: "bg-primary-100 text-primary-600",
    secondary: "bg-gray-100 text-gray-600",
    accent: "bg-blue-100 text-blue-600",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center",
        sizes[size],
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
