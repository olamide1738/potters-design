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
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-card border border-mist bg-bone p-8 dark:border-edge dark:bg-ink"
      >
        <h1 className="font-display text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-2 text-sm text-ink/60 dark:text-bone/60">
          Manage products, inventory and pricing.
        </p>

        <label className="mt-6 block text-sm font-semibold" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field mt-1"
        />

        <label className="mt-4 block text-sm font-semibold" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field mt-1"
        />

        {error && <p className="mt-3 text-sm text-sale">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full disabled:opacity-60">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
