import { useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Textarea";
import { verifySignature } from "../../../lib/api";
import { useAuthStore } from "../../../stores/authStore";
import { PenTool } from "lucide-react";

const messageSchema = z.object({
  message: z.string().min(1, "Please enter a message to sign"),
});

type MessageFormData = z.infer<typeof messageSchema>;

export function MessageForm() {
  const [isSigning, setIsSigning] = useState(false);
  const { primaryWallet } = useDynamicContext();
  const { addMessage } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  const verifyMutation = useMutation({
    mutationFn: verifySignature,
    onSuccess: data => {
      if (data.isValid) {
        toast.success("Signature verified successfully!");
      } else {
        toast.error("Signature verification failed");
      }
    },
  });

  const onSubmit = async (data: MessageFormData) => {
    if (!primaryWallet) {
      toast.error("No wallet connected");
      return;
    }

    try {
      setIsSigning(true);

      // Sign the message using Dynamic wallet
      const signature = await primaryWallet.signMessage(data.message);

      if (!signature) {
        toast.error("Failed to sign message");
        return;
      }

      // Verify on backend
      const result = await verifyMutation.mutateAsync({
        message: data.message,
        signature,
      });

      // Add to history
      addMessage({
        id: crypto.randomUUID(),
        message: data.message,
        signature,
        signer: result.signer,
        timestamp: Date.now(),
        verified: result.isValid,
      });

      reset();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to sign message"
      );
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textarea
          {...register("message")}
          rows={4}
          placeholder="Enter your message here..."
          error={errors.message?.message}
        />

        <Button
          type="submit"
          className="w-full"
          icon={PenTool}
          isLoading={isSigning || verifyMutation.isPending}
        >
          Sign & Verify Message
        </Button>
      </form>
    </Card>
  );
}
