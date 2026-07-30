import { useEffect, useState, type ReactNode } from "react";

interface ComponentLoaderProps {
  children: ReactNode;
  isLoading?: boolean;
  minDurationMs?: number; // Default 2000ms (2 seconds)
  loadingText?: string;
}

export function ComponentLoader({
  children,
  isLoading = false,
  minDurationMs = 2000,
  loadingText = "Loading…",
}: ComponentLoaderProps) {
  const [showSpinner, setShowSpinner] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowSpinner(true);
      const timer = setTimeout(() => {
        setShowSpinner(false);
      }, minDurationMs);
      return () => clearTimeout(timer);
    } else {
      setShowSpinner(false);
    }
  }, [isLoading, minDurationMs]);

  if (showSpinner) {
    return (
      <div className="flex min-h-[220px] w-full flex-col items-center justify-center gap-3.5 py-12 animate-fade-in">
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-3 border-gold/20 border-t-gold" />
          <div className="absolute h-6 w-6 rounded-full bg-gold/10 blur-xs" />
        </div>
        <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold animate-pulse">
          {loadingText}
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
