import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "@/store/useAuthStore";

/** Gate for admin routes — redirects to the login screen when signed out. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const location = useLocation();

  if (loading) {
    return (
      <div className="shell flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-ink/50 dark:text-bone/50">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
