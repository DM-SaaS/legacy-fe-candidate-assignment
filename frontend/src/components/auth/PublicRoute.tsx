import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to the intended page or wallet dashboard
    const from = location.state?.from?.pathname || "/wallet";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
