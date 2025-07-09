import { useState, useEffect, useRef } from "react";
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
  const { setShowAuthFlow, primaryWallet, user, showAuthFlow } =
    useDynamicContext();
  const { setUserData } = useAuthStore();
  const emailRef = useRef<string>("");
  const modalObserverRef = useRef<MutationObserver | null>(null);

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

  // Function to pre-fill email in Dynamic.xyz modal
  const preFillDynamicEmail = (email: string) => {
    // Try multiple times since the modal might take time to render
    let attempts = 0;
    const maxAttempts = 10;

    const fillEmail = () => {
      // Look for Dynamic.xyz email input field
      const emailInput = document.querySelector(
        'input[id="email_field"]'
      ) as HTMLInputElement;

      if (emailInput && email) {
        // Set the value
        emailInput.value = email;

        // Trigger various events to ensure the framework picks up the change
        emailInput.dispatchEvent(new Event("input", { bubbles: true }));
        emailInput.dispatchEvent(new Event("change", { bubbles: true }));
        emailInput.dispatchEvent(new Event("blur", { bubbles: true }));

        // Make the field readonly to prevent user changes
        emailInput.readOnly = true;
        emailInput.style.backgroundColor = "#f9f9f9";
        emailInput.style.cursor = "not-allowed";

        console.log("✅ Email pre-filled in Dynamic.xyz modal:", email);
        return true;
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(fillEmail, 500); // Try again in 500ms
      } else {
        console.warn(
          "❌ Could not find Dynamic.xyz email field after multiple attempts"
        );
      }

      return false;
    };

    // Start trying to fill email immediately
    setTimeout(fillEmail, 100);
  };

  // Monitor DOM for Dynamic.xyz modal appearance
  useEffect(() => {
    if (showAuthFlow && emailRef.current) {
      // Start monitoring for the modal
      preFillDynamicEmail(emailRef.current);

      // Also set up a MutationObserver to catch any new modal elements
      modalObserverRef.current = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                // Check if this is a Dynamic.xyz modal container
                if (
                  element.querySelector('input[id="email_field"]') ||
                  element.getAttribute("id")?.includes("dynamic") ||
                  element.className?.includes("dynamic")
                ) {
                  setTimeout(() => preFillDynamicEmail(emailRef.current), 100);
                }
              }
            });
          }
        });
      });

      // Start observing
      modalObserverRef.current.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Cleanup observer when modal closes
    if (!showAuthFlow && modalObserverRef.current) {
      modalObserverRef.current.disconnect();
      modalObserverRef.current = null;
    }

    return () => {
      if (modalObserverRef.current) {
        modalObserverRef.current.disconnect();
      }
    };
  }, [showAuthFlow]);

  const onSubmit = async (data: EmailForm) => {
    try {
      // Store the email for pre-filling
      emailRef.current = data.email;

      // Don't set loading state - this prevents the button from getting stuck
      // if the user closes the Dynamic.xyz modal without completing

      // Open Dynamic.xyz auth flow
      setShowAuthFlow(true);

      toast.info("Opening authentication modal...");
    } catch (error) {
      toast.error("Failed to open authentication modal");
      console.error("Auth flow error:", error);
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
              // Remove isLoading prop to prevent button from getting stuck
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
