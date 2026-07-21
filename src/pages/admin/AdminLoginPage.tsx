import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export function AdminLoginPage() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const signIn = useAuthStore((s) => s.signIn);
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  if (!loading && user) return <Navigate to={from} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shell flex min-h-[75vh] items-center justify-center py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-card border border-mist bg-bone/90 p-8 sm:p-10 shadow-xl shadow-ink/5 dark:border-edge dark:bg-carbon/95 dark:shadow-none"
      >
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Potter's Design"
            className="mx-auto h-12 w-auto mix-blend-multiply dark:mix-blend-screen"
          />
          <span className="eyebrow tracking-[0.2em] text-gold uppercase text-[11px] font-semibold block mt-4">
            Storefront Management
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wide text-ink dark:text-bone mt-1">
            Admin Portal
          </h1>
          <span className="mx-auto mt-3 block h-1 w-12 rounded-full bg-gold" />
          <p className="mt-3 text-xs sm:text-sm text-ink/65 dark:text-bone/65">
            Sign in to manage catalog, inventory, orders & production.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 dark:text-bone/75 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@pottersdesign.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 dark:text-bone/75 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-xs font-semibold text-sale bg-sale/10 border border-sale/20 rounded-card p-3 text-center">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-accent mt-6 w-full py-3.5 text-xs font-semibold uppercase tracking-widest disabled:opacity-60">
          {submitting ? "Signing in…" : "Sign In to Admin"}
        </button>
      </form>
    </div>
  );
}
