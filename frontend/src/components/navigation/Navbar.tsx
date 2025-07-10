import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../stores/authStore";
import { LogOut, Shield, Wallet, Palette } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogOut } = useDynamicContext();
  const { isAuthenticated, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    await handleLogOut();
    clearAuth();
    navigate("/sign-in");
  };

  // Don't show navbar on sign-in page or 404 page
  if (location.pathname === "/sign-in" || location.pathname === "/404") {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
            >
              <Shield className="w-6 h-6" />
              <span>Dynamic Wallet</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Component Library is always visible */}
            <Link
              to="/components"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/components"
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Components</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/wallet"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === "/wallet"
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Wallet</span>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/sign-in">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
