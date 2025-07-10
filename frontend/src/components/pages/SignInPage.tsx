import { AuthView } from "../../features/auth/components/AuthView";
import { AppLayout } from "../layouts/AppLayout";

export function SignInPage() {
  return (
    <AppLayout>
      <AuthView />
    </AppLayout>
  );
}
