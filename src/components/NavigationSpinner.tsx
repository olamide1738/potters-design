import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export function NavigationSpinner() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const prevPath = useRef(location.pathname);

  // Initial page load listener
  useEffect(() => {
    if (document.readyState === "complete") return;

    // Only show spinner if initial webpage load takes > 1.0s (1000ms)
    const timer = setTimeout(() => {
      if (document.readyState !== "complete") {
        setShow(true);
      }
    }, 1000);

    const handleLoad = () => {
      clearTimeout(timer);
      setShow(false);
    };

    window.addEventListener("load", handleLoad);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // Route change listener
  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;

      // Only show spinner if transition takes > 1.0s (1000ms)
      const timer = setTimeout(() => {
        setShow(true);
      }, 1000);

      // Hide immediately when route view is ready
      const hideTimer = setTimeout(() => {
        setShow(false);
      }, 300);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [location.pathname]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center gap-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
      <div className="rounded-2xl border border-mist/80 bg-bone/95 p-6 shadow-2xl dark:border-edge/80 dark:bg-carbon/95 flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-3 border-gold/20 border-t-gold" />
        <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-gold animate-pulse">
          Loading…
        </span>
      </div>
    </div>
  );
}
