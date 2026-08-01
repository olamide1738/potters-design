import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";

/**
 * Chrome for the /admin area — deliberately separate from the storefront's
 * RootLayout (no header, footer, cart, translate widget, etc.).
 */
export function AdminLayout() {
  const { theme, toggleTheme } = useThemeStore();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const onLogin = location.pathname === "/admin/login";

  return (
    <div className="flex min-h-screen flex-col bg-surface dark:bg-carbon text-ink dark:text-bone font-body transition-colors">
      {/* Admin Header Chrome */}
      <header className="sticky top-0 z-40 border-b border-mist/70 bg-bone/90 backdrop-blur dark:border-edge/70 dark:bg-ink/90">
        <div className="shell flex h-16 items-center justify-between lg:h-20">
          {/* Brand Logo & Tag */}
          <Link to="/admin" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Potter's Design"
              className="h-8 w-auto mix-blend-multiply dark:mix-blend-screen lg:h-9"
            />
            <span className="font-display text-lg font-semibold tracking-wide hidden sm:inline-block">
              Potter&apos;s Design
            </span>
            <span className="rounded-card bg-gold/15 border border-gold/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold">
              Admin Portal
            </span>
          </Link>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-5 text-xs font-semibold uppercase tracking-wider">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-card border border-mist/80 bg-transparent px-3 py-1.5 text-ink/75 hover:border-gold hover:text-gold dark:border-edge/80 dark:text-bone/75 dark:hover:border-gold dark:hover:text-gold transition-all"
            >
              <span>View Store</span>
              <ExternalLinkIcon />
            </a>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid h-8 w-8 place-items-center rounded-full border border-mist/80 text-ink/70 hover:border-gold hover:text-gold dark:border-edge/80 dark:text-bone/70 dark:hover:border-gold dark:hover:text-gold transition-colors"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {user && !onLogin && (
              <button
                type="button"
                onClick={() => void signOut()}
                className="btn-ghost py-1.5 px-3 text-xs"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-mist/60 bg-bone/50 py-6 text-center text-xs text-ink/50 dark:border-edge/60 dark:bg-ink/50 dark:text-bone/50">
        <div className="shell flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} The Potter&apos;s Design Limited · Admin Portal</p>
          <span className="font-mono text-[11px] text-gold uppercase tracking-wider">Heritage. Reimagined.</span>
        </div>
      </footer>
    </div>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
