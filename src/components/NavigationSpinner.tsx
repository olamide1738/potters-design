import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export function NavigationSpinner() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const prevPath = useRef(location.pathname);

  // Route change listener
  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;

      // Immediately hide previous spinner
      setShow(false);

      // Only schedule spinner if page transition takes longer than 1.0s (1000ms)
      const showTimer = setTimeout(() => {
        setShow(true);

        // Auto-dismiss safety cleanup
        setTimeout(() => {
          setShow(false);
        }, 1200);
      }, 1000);

      return () => {
        clearTimeout(showTimer);
      };
    } else {
      setShow(false);
    }
  }, [location.pathname]);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] flex items-center justify-center animate-fade-in">
      <div className="h-10 w-10 animate-spin rounded-full border-3 border-gold/20 border-t-gold" />
    </div>
  );
}
