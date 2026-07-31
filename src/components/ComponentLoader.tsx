import { useEffect, useState, type ReactNode } from "react";

interface ComponentLoaderProps {
  children: ReactNode;
  isLoading?: boolean;
  delayMs?: number; // Only show if load > 1.0s (1000ms)
}

export function ComponentLoader({
  children,
  isLoading = false,
  delayMs = 1000,
}: ComponentLoaderProps) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isLoading) {
      // Only show spinner if loading takes more than 1.0s (1000ms)
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
      <div className="flex min-h-[160px] w-full flex-col items-center justify-center py-10 animate-fade-in">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-gold/20 border-t-gold" />
      </div>
    );
  }

  return <>{children}</>;
}
