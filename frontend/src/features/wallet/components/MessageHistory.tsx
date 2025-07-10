import { useState } from "react";
import { Card } from "../../../components/ui/Card";
import { useAuthStore } from "../../../stores/authStore";
import { format } from "date-fns";
import { Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "../../../components/ui/EmptyState";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { IconButton } from "../../../components/ui/IconButton";

export function MessageHistory() {
  const { messageHistory, deleteMessage } = useAuthStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      setDeletingId(id);
      setTimeout(() => {
        deleteMessage(id);
        toast.success("Message deleted");
        setDeletingId(null);
      }, 300);
    }
  };

  if (messageHistory.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No messages signed yet"
        description="Sign a message to see it here"
      />
    );
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto">
      {messageHistory.map(msg => (
        <Card
          key={msg.id}
          className={`p-4 transition-all duration-300 ${
            deletingId === msg.id
              ? "opacity-0 scale-95"
              : "opacity-100 scale-100 hover:shadow-md"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 mr-2">
              <p className="text-sm font-medium text-gray-900 break-words">
                {msg.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {format(msg.timestamp, "MMM d, yyyy HH:mm")}
              </p>
              <p className="text-xs font-mono text-gray-400 mt-1 truncate">
                {msg.signature.slice(0, 20)}...
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={msg.verified ? "success" : "error"} />
              <IconButton
                variant="danger"
                size="sm"
                onClick={() => handleDelete(msg.id)}
                title="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </IconButton>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
