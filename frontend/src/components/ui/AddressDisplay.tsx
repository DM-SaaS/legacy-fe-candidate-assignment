import { Copy } from "lucide-react";
import { toast } from "sonner";
import { IconButton } from "./IconButton";
import { cn } from "../../utils/cn";

interface AddressDisplayProps {
  address: string;
  startLength?: number;
  endLength?: number;
  copyable?: boolean;
  className?: string;
}

export function AddressDisplay({
  address,
  startLength = 6,
  endLength = 4,
  copyable = true,
  className,
}: AddressDisplayProps) {
  const truncated = `${address.slice(0, startLength)}...${address.slice(
    -endLength
  )}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="flex items-center gap-2">
      <code
        className={cn(
          "font-mono text-sm bg-white px-2 py-1 rounded border",
          className
        )}
      >
        {truncated}
      </code>
      {copyable && (
        <IconButton
          variant="ghost"
          size="sm"
          onClick={copyAddress}
          title="Copy address"
        >
          <Copy className="w-4 h-4" />
        </IconButton>
      )}
    </div>
  );
}
