import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const DISMISS_KEY = "pd-promo-dismissed";

// Editorial image — Iwalade dress in three prints, warm tones matching the panel
const PROMO_IMAGE = "/images/promo-iwalade.jpg";

const OPTIONS = [
  "Culture-rich designs with identity and heritage",
  "Minimal luxury staples for everyday wear",
  "Bold fashion-forward statement pieces",
];

export function PromoPopup() {
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Show on the homepage, once per user, 4s after opening the site
  useEffect(() => {
    if (pathname !== "/") return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    const t = setTimeout(() => {
      localStorage.setItem(DISMISS_KEY, "1"); // shown once — never again for this user
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    }, 4000);
    return () => clearTimeout(t);
  }, [pathname]);

  // Esc to close + lock body scroll while open
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mounted]);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setTimeout(() => setMounted(false), 200);
  }

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="10% off your first order"
      className="fixed inset-0 z-[70] overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={dismiss}
        className={`fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Scroll + centering wrapper — centers when it fits, scrolls when it doesn't */}
      <div className="relative flex min-h-full items-center justify-center p-4">
      {/* Panel */}
      <div
        className={`relative grid w-full max-w-[1000px] overflow-hidden rounded-2xl border border-mist bg-bone shadow-2xl transition-all duration-200 dark:border-edge dark:bg-carbon md:grid-cols-2 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/25 text-white backdrop-blur transition-colors hover:bg-black/45"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Left — offer */}
        <div className="order-2 flex flex-col items-center justify-center bg-bone px-6 py-8 text-center text-ink dark:bg-carbon dark:text-bone sm:px-10 sm:py-10 md:order-1">
          <img
            src="/logo.png"
            alt="The Potter's Design"
            className="mb-5 h-10 w-auto sm:mb-7 sm:h-12"
          />

          <div className="flex flex-wrap items-baseline justify-center gap-x-3 font-display leading-none">
            <span className="text-2xl font-bold sm:text-4xl">You&apos;ve Got</span>
            <span className="text-[2.75rem] font-extrabold tracking-tight text-gold sm:text-6xl">10% OFF</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold sm:text-4xl">Your First Order</p>

          <p className="mt-5 text-base font-semibold sm:mt-6 sm:text-lg">Tell us one thing first.</p>
          <p className="text-base font-semibold text-ink/70 dark:text-bone/70 sm:text-lg">
            What matters most when choosing your ready-to-wear pieces?
          </p>

          <div className="mt-6 w-full space-y-3 sm:mt-7 sm:space-y-4">
            {OPTIONS.map((option) => (
              <button
                key={option}
                onClick={dismiss}
                className="w-full rounded-lg bg-gold px-5 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-[#fda437] hover:text-white sm:px-6 sm:py-4 sm:text-base"
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={dismiss}
            className="mt-5 text-sm font-medium text-ink/60 underline-offset-4 hover:text-ink hover:underline dark:text-bone/60 dark:hover:text-bone sm:mt-6"
          >
            I hate discounts.
          </button>
        </div>

        {/* Right — editorial image: full & uncropped on mobile, fills the column on desktop */}
        <div className="relative order-1 md:order-2">
          <img
            src={PROMO_IMAGE}
            alt="The Potter's Design editorial"
            className="block h-auto w-full object-contain md:absolute md:inset-0 md:h-full md:object-cover md:object-top"
          />
        </div>
      </div>
      </div>
    </div>
  );
}
