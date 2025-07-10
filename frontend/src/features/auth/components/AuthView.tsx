import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { toast } from "sonner";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { IconContainer } from "../../../components/ui/IconContainer";
import { useAuthStore } from "../../../stores/authStore";
import { Shield } from "lucide-react";

export function AuthView() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowAuthFlow, primaryWallet, user, showAuthFlow } =
    useDynamicContext();
  const { setUserData } = useAuthStore();

  useEffect(() => {
    if (primaryWallet && user) {
      setUserData(user.email || "", primaryWallet.address);
      toast.success("Successfully authenticated!");
      setIsLoading(false);

      // Redirect to the intended page or wallet dashboard
      const from = location.state?.from?.pathname || "/wallet";
      navigate(from, { replace: true });
    }
  }, [primaryWallet, user, setUserData, navigate, location.state]);

  const handleSignIn = () => {
    setIsLoading(true);
    setShowAuthFlow(true);
    toast.info("Opening authentication modal...");
  };

  // Reset loading state if auth flow is closed without completing
  useEffect(() => {
    if (!showAuthFlow && isLoading) {
      setIsLoading(false);
    }
  }, [showAuthFlow, isLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <IconContainer size="md">
              <Shield className="w-8 h-8" />
            </IconContainer>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Dynamic Wallet
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in with your email to get started
          </p>
        </div>

        <Card>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-6">
                Connect your wallet or sign in with email to continue
              </p>
            </div>

            <Button
              onClick={handleSignIn}
              className="w-full"
              size="lg"
              disabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? "Opening..." : "Sign In"}
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            By continuing, you agree to create a secure embedded wallet
          </div>
        </Card>
      </div>
    </div>
  );
}
