import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { PublicRoute } from "../components/auth/PublicRoute";
import { SignInPage } from "../components/pages/SignInPage";
import { WalletPage } from "../components/pages/WalletPage";
import { ComponentLibraryPage } from "../components/pages/ComponentLibraryPage";
import { NotFoundPage } from "../components/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/wallet" replace />,
  },
  {
    path: "/sign-in",
    element: (
      <PublicRoute>
        <SignInPage />
      </PublicRoute>
    ),
  },
  {
    path: "/wallet",
    element: (
      <ProtectedRoute>
        <WalletPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/components",
    element: <ComponentLibraryPage />,
  },
  {
    path: "/404",
    element: <NotFoundPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
