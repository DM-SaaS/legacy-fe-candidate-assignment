import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "../../utils/cn";

interface StatusBadgeProps {
  status: "success" | "error" | "pending" | "warning";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  size = "md",
  className,
  showIcon = true,
}: StatusBadgeProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    pending: Clock,
    warning: AlertCircle,
  };

  const styles = {
    success: "text-green-500",
    error: "text-red-500",
    pending: "text-gray-400",
    warning: "text-amber-500",
  };

  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const Icon = icons[status];

  if (!showIcon) return null;

  return <Icon className={cn(sizes[size], styles[status], className)} />;
}
