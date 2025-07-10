import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { IconContainer } from "../ui/IconContainer";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card variant="elevated" className="text-center">
          <div className="mb-6">
            <IconContainer
              variant="secondary"
              size="lg"
              className="mx-auto mb-4"
            >
              <AlertTriangle className="w-12 h-12" />
            </IconContainer>
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Page Not Found
            </h2>
            <p className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-3">
            <Button icon={Home} className="w-full" onClick={goHome}>
              Go to Home
            </Button>

            <Button
              icon={ArrowLeft}
              variant="secondary"
              className="w-full"
              onClick={goBack}
            >
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
