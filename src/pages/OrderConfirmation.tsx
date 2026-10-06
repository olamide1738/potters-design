import { useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import type { OrderPayload } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { trackPurchase } from "@/lib/meta-pixel";

interface ConfirmationState {
  orderId: string;
  paymentMethod: "bank" | "paystack";
  email: string;
  order?: OrderPayload;
}

export function OrderConfirmation() {
  const location = useLocation();
  const state = location.state as ConfirmationState | null;

  // Attempt to recover order from state or localStorage
  const recoveredData = useMemo(() => {
    if (state?.orderId && state?.order) {
      return {
        orderId: state.orderId,
        paymentMethod: state.paymentMethod,
        email: state.email,
        order: state.order,
      };
    }

    try {
      const saved = localStorage.getItem("pd-last-order");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (state?.orderId && parsed.orderId === state.orderId) {
          return {
            orderId: parsed.orderId,
            paymentMethod: parsed.paymentMethod || state?.paymentMethod || "bank",
            email: parsed.email || state?.email,
            order: parsed.orderData as OrderPayload,
          };
        } else if (!state?.orderId && parsed.orderId) {
          return {
            orderId: parsed.orderId,
            paymentMethod: parsed.paymentMethod || "bank",
            email: parsed.email,
            order: parsed.orderData as OrderPayload,
          };
        }
      }
    } catch {}

    return {
      orderId: state?.orderId || "",
      paymentMethod: state?.paymentMethod || "bank",
      email: state?.email || "",
      order: undefined,
    };
  }, [state]);

  const { orderId, paymentMethod, email, order } = recoveredData;
  const isBank = paymentMethod === "bank";

  if (!orderId) {
    return (
      <div className="shell py-24 text-center">
        <p className="font-display text-xl">No order found.</p>
        <Link to="/shop" className="btn-primary mt-6">
          Start shopping
        </Link>
      </div>
    );
  }

  useEffect(() => {
    if (orderId) {
      trackPurchase(orderId, order);
    }
  }, [orderId, order]);

  const currentDate = new Date().toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const whatsappMessage = encodeURIComponent(
    `Hello Potter's Design, I just placed order ${orderId}. Here is my payment confirmation details.`
  );

  return (
    <div className="shell max-w-3xl py-12 lg:py-16">
      {/* Top Header Badge */}
      <div className="text-center print:hidden">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <CheckIcon />
        </div>

        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          {isBank ? "Order Received!" : "Payment Confirmed!"}
        </h1>

        <p className="mt-2 text-sm text-ink/70 dark:text-bone/70 sm:text-base">
          {isBank
            ? "Your order has been saved in our database. Please complete your bank transfer to begin production."
            : "Your payment was successful. We've recorded your order and will begin crafting your pieces right away."}
        </p>

        <p className="mt-1 text-xs text-ink/50 dark:text-bone/50">
          An official confirmation receipt has also been sent to{" "}
          <strong className="text-ink dark:text-bone">{email}</strong>.
        </p>
      </div>

      {/* Printable Receipt Card */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-mist/80 bg-white shadow-sm dark:border-edge dark:bg-edge/15 print:border-none print:shadow-none print:m-0 print:p-0">
        {/* Receipt Header Banner */}
        <div className="border-b border-mist/60 bg-surface/50 p-6 sm:p-8 dark:border-edge/60 dark:bg-edge/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold">
                The Potter's Design
              </p>
              <h2 className="mt-0.5 font-display text-xl font-bold sm:text-2xl">
                Official Order Receipt
              </h2>
              <p className="text-xs text-ink/50 dark:text-bone/50">{currentDate}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink/40 dark:text-bone/40">
                Order Reference
              </span>
              <p className="font-mono text-xl font-bold tracking-tight text-ink dark:text-bone sm:text-2xl">
                {orderId}
              </p>
              <span
                className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                  isBank
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }`}
              >
                {isBank ? "Pending Bank Transfer" : "Paid via Paystack"}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Fulfillment Info */}
        <div className="grid gap-6 border-b border-mist/60 p-6 text-sm sm:grid-cols-2 sm:p-8 dark:border-edge/60">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink/40 dark:text-bone/40">
              Customer Details
            </h3>
            <p className="mt-2 font-semibold text-ink dark:text-bone">
              {order?.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Valued Customer"}
            </p>
            <p className="text-xs text-ink/70 dark:text-bone/70">{email}</p>
            {order?.customer?.phone && (
              <p className="font-mono text-xs text-ink/70 dark:text-bone/70">
                {order.customer.phone}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink/40 dark:text-bone/40">
              Fulfillment & Delivery
            </h3>
            {order?.fulfillment === "pickup" ? (
              <div className="mt-2">
                <span className="inline-block rounded bg-mist/40 px-2 py-0.5 text-xs font-semibold dark:bg-edge">
                  Store Pickup
                </span>
                <p className="mt-1 text-xs text-ink/70 dark:text-bone/70">
                  No 4, Akinsanmi Street, Obanikoro Estate, Mainland Lagos
                </p>
              </div>
            ) : order?.shippingAddress ? (
              <div className="mt-2 space-y-0.5 text-xs text-ink/80 dark:text-bone/80">
                <p className="font-medium text-ink dark:text-bone">{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>
                  {order.shippingAddress.countryCode} {order.shippingAddress.zip ? `· ${order.shippingAddress.zip}` : ""}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-xs text-ink/50 dark:text-bone/50">
                Standard Shipping
              </p>
            )}
          </div>
        </div>

        {/* Itemized Order Table */}
        <div className="p-6 sm:p-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink/40 dark:text-bone/40 mb-4">
            Items Ordered {order?.items?.length ? `(${order.items.length})` : ""}
          </h3>

          {order?.items && order.items.length > 0 ? (
            <div className="divide-y divide-mist/50 dark:divide-edge/50">
              {order.items.map((line, idx) => (
                <div key={idx} className="flex items-start gap-4 py-3.5">
                  {line.image && (
                    <img
                      src={line.image}
                      alt={line.name}
                      className="h-16 w-14 rounded-md object-cover border border-mist/40 dark:border-edge/40 shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-ink dark:text-bone">{line.name}</p>
                    <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-ink/60 dark:text-bone/60">
                      {line.size && <span>Size: {line.size}</span>}
                      {line.color && <span>· Color: {line.color}</span>}
                      {line.length && <span>· Length: {line.length}</span>}
                      <span>· Qty: {line.quantity}</span>
                    </div>
                    {line.expressProduction && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                        ⚡ 3-Day Express Production (+{formatPrice(20000 * line.quantity)})
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-ink dark:text-bone">
                      {formatPrice(line.unitPrice * line.quantity)}
                    </p>
                    <p className="text-[11px] text-ink/40 dark:text-bone/40">
                      {line.quantity} × {formatPrice(line.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-surface/50 p-4 text-xs text-ink/60 dark:bg-edge/20 dark:text-bone/60">
              Items recorded under Order Ref <strong className="font-mono">{orderId}</strong>
            </div>
          )}

          {/* Pricing Totals Breakdown */}
          {order && (
            <div className="mt-6 border-t border-mist/80 pt-5 dark:border-edge/80">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-ink/70 dark:text-bone/70">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(order.subtotal)}</span>
                </div>

                <div className="flex justify-between text-ink/70 dark:text-bone/70">
                  <span>Shipping Fee</span>
                  <span className="font-mono">
                    {order.shippingFee === 0 ? "Free (Store Pickup)" : formatPrice(order.shippingFee)}
                  </span>
                </div>

                {order.expressProduction && (
                  <div className="flex justify-between font-medium text-amber-700 dark:text-amber-400">
                    <span>⚡ Express Production Surcharge</span>
                    <span className="font-mono">+{formatPrice(order.expressProductionFee ?? 20000)}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-mist/80 pt-3 text-base font-bold text-ink dark:text-bone dark:border-edge/80">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg text-gold sm:text-xl">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Customer Order Note */}
          {order?.orderNote && (
            <div className="mt-6 rounded-lg border border-mist/60 bg-surface/40 p-4 text-xs dark:border-edge/60 dark:bg-edge/20">
              <span className="font-semibold text-ink dark:text-bone">Order Notes:</span>
              <p className="mt-1 italic text-ink/70 dark:text-bone/70">"{order.orderNote}"</p>
            </div>
          )}
        </div>

        {/* Bank Transfer Instructions (if Bank Transfer) */}
        {isBank && (
          <div className="border-t border-amber-200/80 bg-amber-50/70 p-6 sm:p-8 dark:border-amber-900/30 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <span className="text-xl">🏦</span>
              <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-200">
                  Next Step: Complete Your Bank Transfer
                </h3>
                <p className="mt-1 text-xs text-amber-800/90 leading-relaxed dark:text-amber-300/90">
                  Transfer your total order amount to any of our designated accounts below.
                  Include your Order Reference <strong className="font-mono font-bold text-ink dark:text-bone">{orderId}</strong> in the transfer remarks.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-lg bg-white/80 p-3.5 border border-amber-200/60 dark:bg-edge/40 dark:border-amber-900/30">
                    <p className="font-semibold text-ink dark:text-bone">NGN Account (Wema Bank)</p>
                    <p className="mt-1 text-ink/70 dark:text-bone/70">Account Name: The Potter's Design Ltd</p>
                    <p className="font-mono text-sm font-bold text-amber-800 dark:text-amber-300">0127024387</p>
                  </div>
                  <div className="rounded-lg bg-white/80 p-3.5 border border-amber-200/60 dark:bg-edge/40 dark:border-amber-900/30">
                    <p className="font-semibold text-ink dark:text-bone">NGN Account (First Bank)</p>
                    <p className="mt-1 text-ink/70 dark:text-bone/70">Account Name: The Potters Design Limited</p>
                    <p className="font-mono text-sm font-bold text-amber-800 dark:text-amber-300">2046299408</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/2347017377822?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-green-700 shadow-sm"
                  >
                    <span>💬</span> Send Receipt on WhatsApp (+234 701 737 7822)
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center print:hidden">
        <button
          onClick={() => window.print()}
          className="btn-accent inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider py-3 px-6"
        >
          <span>🖨️</span> Print / Save Receipt
        </button>

        <Link
          to="/shop"
          className="btn-primary inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider py-3 px-6"
        >
          Continue Shopping
        </Link>

        <a
          href={`https://wa.me/2347017377822?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider py-3 px-6"
        >
          Contact Support on WhatsApp
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
