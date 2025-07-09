import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuthStore } from "../../../stores/authStore";
import { LogOut, User, Wallet } from "lucide-react";
import { InfoRow } from "../../../components/ui/InfoRow";
import { AddressDisplay } from "../../../components/ui/AddressDisplay";

export function WalletInfo() {
  const { primaryWallet, user, handleLogOut } = useDynamicContext();
  const { clearAuth } = useAuthStore();

  const logout = async () => {
    await handleLogOut();
    clearAuth();
  };

  return (
    <Card className="bg-gradient-to-r from-primary-50 to-blue-50">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <InfoRow
            icon={User}
            label="Email"
            value={<span className="font-medium">{user?.email}</span>}
          />

          <InfoRow
            icon={Wallet}
            label="Wallet"
            value={
              primaryWallet?.address ? (
                <AddressDisplay address={primaryWallet.address} />
              ) : (
                <span className="text-gray-400">Not connected</span>
              )
            }
          />
        </div>

        <Button variant="secondary" size="sm" icon={LogOut} onClick={logout}>
          Logout
        </Button>
      </div>
    </Card>
  );
}
