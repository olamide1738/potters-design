import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * Chrome for the /admin area — deliberately separate from the storefront's
 * RootLayout (no header, footer, cart, translate widget, etc.).
 */
export function AdminLayout() {
  const theme = useThemeStore((s) => s.theme);
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const onLogin = location.pathname === "/admin/login";

  return (
    <div className="flex min-h-screen flex-col bg-surface dark:bg-carbon">
      <header className="border-b border-mist bg-bone dark:border-edge dark:bg-ink">
        <div className="shell flex h-16 items-center justify-between">
          <Link to="/admin" className="font-display text-lg font-semibold">
            Potter&apos;s Design
            <span className="ml-2 rounded-card bg-gold px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-ink">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink/60 hover:text-gold dark:text-bone/60"
            >
              View store
            </a>
            {user && !onLogin && (
              <button
                type="button"
                onClick={() => void signOut()}
                className="font-semibold text-ink hover:text-gold dark:text-bone"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
