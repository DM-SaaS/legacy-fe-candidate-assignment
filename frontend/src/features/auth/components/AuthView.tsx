import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { IconContainer } from "../../../components/ui/IconContainer";
import { useAuthStore } from "../../../stores/authStore";
import { Mail, Shield } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailForm = z.infer<typeof emailSchema>;

export function AuthView() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowAuthFlow, primaryWallet, user } = useDynamicContext();
  const { setUserData } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

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

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      setShowAuthFlow(true);
    } catch {
      toast.error("Authentication failed");
      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                {...register("email")}
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                error={errors.email?.message}
                disabled={isLoading}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              icon={Mail}
              isLoading={isLoading}
            >
              Continue with Email
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            By continuing, you agree to create a secure embedded wallet
          </div>
        </Card>
      </div>
    </div>
  );
}
