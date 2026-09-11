import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useToastStore } from "@/store/useToastStore";
import { isNewCustomerEmail } from "@/lib/customer-check";

const DISMISS_KEY = "pd-promo-dismissed";
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

  const [email, setEmail] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const applyDiscount = useStore((s) => s.applyDiscount);
  const addToast = useToastStore((s) => s.addToast);

  // Show on the homepage, once per user, 4s after opening the site
  useEffect(() => {
    if (pathname !== "/") return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    const t = setTimeout(() => {
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

  async function handleClaim(option?: string) {
    if (option) setSelectedOption(option);
    setErrorMsg("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address to claim your 10% discount.");
      return;
    }

    setChecking(true);
    try {
      const isNew = await isNewCustomerEmail(trimmedEmail);
      if (!isNew) {
        setErrorMsg("This 10% discount is exclusively for new customers. This email has already placed an order with us.");
        addToast("Exclusively for new customers — email already registered with an existing order.");
        setChecking(false);
        return;
      }

      // Apply 10% discount on product prices
      applyDiscount({
        code: "WELCOME10",
        percentage: 10,
        email: trimmedEmail,
      });

      addToast("🎉 10% Welcome Discount applied to your cart!");
      dismiss();
    } catch (err) {
      console.error("Failed to verify customer discount status:", err);
      setErrorMsg("Failed to verify discount status. Please try again.");
    } finally {
      setChecking(false);
    }
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

      {/* Scroll + centering wrapper */}
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

          {/* Left — offer & email claim form */}
          <div className="order-2 flex flex-col items-center justify-center bg-bone px-6 py-8 text-center text-ink dark:bg-carbon dark:text-bone sm:px-10 sm:py-10 md:order-1">
            <img
              src="/logo.png"
              alt="The Potter's Design"
              className="mb-4 h-10 w-auto sm:mb-6 sm:h-12"
            />

            <div className="flex flex-wrap items-baseline justify-center gap-x-3 font-display leading-none">
              <span className="text-2xl font-bold sm:text-4xl">You&apos;ve Got</span>
              <span className="text-[2.75rem] font-extrabold tracking-tight text-gold sm:text-6xl">10% OFF</span>
            </div>
            <p className="mt-2 font-display text-xl font-bold sm:text-3xl">Your First Order</p>

            <p className="mt-4 text-sm font-medium text-ink/70 dark:text-bone/70 sm:text-base">
              Enter your email to claim your exclusive 10% new customer discount on your cart.
            </p>

            {/* Email Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleClaim();
              }}
              className="mt-5 w-full space-y-3"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address…"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full rounded-lg border border-mist bg-bone px-4 py-3 text-sm focus:border-gold focus:outline-none dark:border-edge dark:bg-carbon dark:text-bone"
              />

              <button
                type="submit"
                disabled={checking}
                className="w-full rounded-lg bg-gold px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#fda437] disabled:opacity-50 sm:text-base"
              >
                {checking ? "Verifying Email Status…" : "CLAIM MY 10% DISCOUNT"}
              </button>
            </form>

            {errorMsg && (
              <p className="mt-3 rounded-md bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-500">
                {errorMsg}
              </p>
            )}

            <div className="mt-5 w-full border-t border-mist/50 pt-4 dark:border-edge/50">
              <p className="mb-3 text-xs font-semibold text-ink/60 dark:text-bone/60">
                What matters most when choosing your ready-to-wear pieces?
              </p>
              <div className="space-y-2">
                {OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleClaim(option)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      selectedOption === option
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-mist bg-transparent hover:border-gold dark:border-edge"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={dismiss}
              className="mt-4 text-xs font-medium text-ink/50 underline-offset-4 hover:text-ink hover:underline dark:text-bone/50 dark:hover:text-bone"
            >
              No thanks, I'll pay full price.
            </button>
          </div>

          {/* Right — editorial image */}
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
