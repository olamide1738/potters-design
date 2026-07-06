import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="shell grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <span className="font-display text-7xl font-semibold text-ochre">404</span>
        <h1 className="mt-4 text-2xl font-semibold">This page wandered off.</h1>
        <p className="mt-2 text-ink/60">The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
        <Link to="/" className="btn-primary mt-6">Back home</Link>
      </div>
    </div>
  );
}
