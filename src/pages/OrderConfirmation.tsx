import { Link, useLocation } from "react-router-dom";

interface ConfirmationState {
  orderId: string;
  paymentMethod: "bank" | "paystack";
  email: string;
}

export function OrderConfirmation() {
  const location = useLocation();
  const state = location.state as ConfirmationState | null;

  if (!state?.orderId) {
    return (
      <div className="shell py-24 text-center">
        <p className="font-display text-xl">No order found.</p>
        <Link to="/shop" className="btn-primary mt-6">
          Start shopping
        </Link>
      </div>
    );
  }

  const { orderId, paymentMethod, email } = state;
  const isBank = paymentMethod === "bank";

  return (
    <div className="shell max-w-xl py-20 text-center">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <CheckIcon />
      </div>

      <h1 className="font-display text-3xl font-semibold">
        {isBank ? "Order received!" : "Payment confirmed!"}
      </h1>

      <p className="mt-3 text-ink/60 dark:text-bone/60">
        {isBank
          ? "Your order has been saved. Please complete your bank transfer to confirm production."
          : "Your payment was successful. We'll begin production right away."}
      </p>

      <div className="mt-8 rounded-card border border-mist bg-surface/60 p-6 text-left dark:border-edge dark:bg-edge/10">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink/40 dark:text-bone/40">
          Order reference
        </p>
        <p className="mt-1 font-mono text-xl font-semibold">{orderId}</p>

        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-ink/40 dark:text-bone/40">
          Confirmation sent to
        </p>
        <p className="mt-1 text-sm">{email}</p>

        {isBank && (
          <div className="mt-6 rounded-card border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-300">
            <p className="font-semibold">Next step — complete your transfer</p>
            <p className="mt-1.5 leading-relaxed">
              Transfer your order total to any of our accounts, then send your payment
              receipt and order reference{" "}
              <span className="font-semibold">{orderId}</span> to us on WhatsApp:{" "}
              <a
                href="https://wa.me/2347017377822"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2"
              >
                +234 701 737 7822
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/shop" className="btn-primary">
          Continue shopping
        </Link>
        <a
          href="https://wa.me/2347017377822"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          Chat with us on WhatsApp
        </a>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
