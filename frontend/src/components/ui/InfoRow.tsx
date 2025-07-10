import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  className?: string;
}

export function InfoRow({ icon: Icon, label, value, className }: InfoRowProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-1">{value}</div>
    </div>
  );
}
