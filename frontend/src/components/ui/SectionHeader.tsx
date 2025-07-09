import { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface SectionHeaderProps {
  children: ReactNode;
  className?: string;
  level?: 1 | 2 | 3;
}

export function SectionHeader({
  children,
  className,
  level = 2,
}: SectionHeaderProps) {
  const baseClasses = "font-semibold text-gray-800 mb-4";

  const levelClasses = {
    1: "text-3xl",
    2: "text-xl",
    3: "text-lg",
  };

  const combinedClassName = cn(baseClasses, levelClasses[level], className);

  if (level === 1) {
    return <h1 className={combinedClassName}>{children}</h1>;
  }

  if (level === 3) {
    return <h3 className={combinedClassName}>{children}</h3>;
  }

  return <h2 className={combinedClassName}>{children}</h2>;
}
