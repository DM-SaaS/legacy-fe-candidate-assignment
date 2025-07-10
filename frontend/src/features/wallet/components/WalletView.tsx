import { useEffect } from "react";
import { MessageForm } from "./MessageForm";
import { MessageHistory } from "./MessageHistory";
import { WalletInfo } from "./WalletInfo";
import { useAuthStore } from "../../../stores/authStore";
import { SectionHeader } from "../../../components/ui/SectionHeader";

export function WalletView() {
  const { loadMessageHistory } = useAuthStore();

  useEffect(() => {
    loadMessageHistory();
  }, [loadMessageHistory]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <SectionHeader level={1} className="text-center mb-8 text-gray-900">
        Dynamic Wallet Dashboard
      </SectionHeader>

      <WalletInfo />

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <SectionHeader>Sign Message</SectionHeader>
          <MessageForm />
        </div>

        <div>
          <SectionHeader>Message History</SectionHeader>
          <MessageHistory />
        </div>
      </div>
    </div>
  );
}
