import { useEffect, useState, type ReactNode } from "react";

interface ComponentLoaderProps {
  children: ReactNode;
  isLoading?: boolean;
  delayMs?: number; // Only show if load > 0.5s (500ms)
  loadingText?: string;
}

export function ComponentLoader({
  children,
  isLoading = false,
  delayMs = 500,
  loadingText = "Loading…",
}: ComponentLoaderProps) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isLoading) {
      // Only show spinner if loading takes more than 0.5s (500ms)
      timer = setTimeout(() => {
        setShowSpinner(true);
      }, delayMs);
    } else {
      // Immediately hide spinner when webpage/component is loaded
      setShowSpinner(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, delayMs]);

  if (isLoading && showSpinner) {
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
