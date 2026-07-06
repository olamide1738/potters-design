import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export function NavigationSpinner() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      setShow(true);
      const t = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold/20 border-t-gold" />
    </div>
  );
}
