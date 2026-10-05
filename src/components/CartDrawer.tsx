import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useUIStore } from "@/store/useUIStore";
import { useProducts } from "@/store/useProductStore";
import { formatPrice } from "@/lib/format";

const PLACEHOLDER = "/hanger-placeholder.svg";

export function CartDrawer() {
  const cartOpen = useUIStore((s) => s.cartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const cart = useStore((s) => s.cart);
  const setQuantity = useStore((s) => s.setQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const subtotal = useStore((s) => s.cartSubtotal());
  const navigate = useNavigate();
  const products = useProducts();

  const cartIds = new Set(cart.map((l) => l.productId));
  const suggestions = products.filter((p) => !cartIds.has(p.id)).slice(0, 6);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  const appliedDiscount = useStore((s) => s.appliedDiscount);
  const removeDiscount = useStore((s) => s.removeDiscount);
  const discountAmount = useStore((s) => s.cartDiscountAmount());
  const cartExpressProductionFee = useStore((s) => s.cartExpressProductionFee());
  const toggleCartLineExpressProduction = useStore((s) => s.toggleCartLineExpressProduction);
  const finalSubtotal = Math.max(0, subtotal - discountAmount) + cartExpressProductionFee;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer — exactly 40% width on desktop */}
      <aside
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-bone shadow-2xl transition-transform duration-300 ease-in-out dark:bg-carbon lg:w-[40%] ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-mist px-6 dark:border-edge">
          <h2 className="font-display text-lg font-semibold">
            Cart
            {cart.length > 0 && (
              <span className="ml-2 text-sm font-normal text-ink/50 dark:text-bone/50">
                ({cart.reduce((n, l) => n + l.quantity, 0)})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full border border-mist text-ink/50 transition-colors hover:border-ink hover:text-ink dark:border-edge dark:text-bone/50 dark:hover:border-bone dark:hover:text-bone"
          >
            <XIcon />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <BagEmptyIcon />
              <p className="font-display text-xl text-ink/50 dark:text-bone/50">Your cart is empty</p>
              <button onClick={closeCart} className="btn-primary mt-2">
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="px-6">
              <ul className="divide-y divide-mist dark:divide-edge">
                {cart.map((line, idx) => (
                  <li
                    key={`${line.productId}-${line.size}-${line.color}-${line.length}-${line.expressProduction ? "exp" : "std"}`}
                    className="flex gap-4 py-5"
                  >
                    <Link
                      to={`/shop/${line.slug}`}
                      onClick={closeCart}
                      className="shrink-0"
                    >
                      <img
                        src={line.image}
                        alt={line.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER;
                        }}
                        className="h-24 w-[72px] rounded-card object-cover"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <div>
                          <Link
                            to={`/shop/${line.slug}`}
                            onClick={closeCart}
                            className="font-display text-sm font-medium leading-snug hover:text-gold"
                          >
                            {line.name}
                          </Link>
                          {(line.size || line.color || line.length) && (
                            <p className="mt-0.5 text-xs text-ink/50 dark:text-bone/50">
                              {[line.size, line.color, line.length].filter(Boolean).join(" / ")}
                            </p>
                          )}
                          <label className="mt-1.5 flex items-center gap-1.5 cursor-pointer text-[11px] text-ink/75 dark:text-bone/75 hover:text-gold">
                            <input
                              type="checkbox"
                              checked={!!line.expressProduction}
                              onChange={() => toggleCartLineExpressProduction(idx)}
                              className="h-3.5 w-3.5 rounded border-mist accent-gold dark:border-edge"
                            />
                            <span className="font-medium">⚡ Express (3 Days): +₦20k</span>
                          </label>
                        </div>
                        <p className="font-mono text-sm font-semibold">
                          {formatPrice(line.unitPrice * line.quantity)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-card border border-mist dark:border-edge">
                          <button
                            onClick={() =>
                              setQuantity(
                                line.productId,
                                line.quantity - 1,
                                line.size,
                                line.color,
                                line.length,
                              )
                            }
                            className="px-2 py-1 text-xs text-ink/50 hover:text-ink dark:text-bone/50 dark:hover:text-bone"
                          >
                            −
                          </button>
                          <span className="px-2 text-xs font-semibold">{line.quantity}</span>
                          <button
                            onClick={() =>
                              setQuantity(
                                line.productId,
                                line.quantity + 1,
                                line.size,
                                line.color,
                                line.length,
                              )
                            }
                            className="px-2 py-1 text-xs text-ink/50 hover:text-ink dark:text-bone/50 dark:hover:text-bone"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(
                              line.productId,
                              line.size,
                              line.color,
                              line.length,
                            )
                          }
                          className="text-xs text-ink/40 hover:text-red-500 dark:text-bone/40"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* You may also like */}
              {suggestions.length > 0 && (
                <div className="mt-2 border-t border-mist pb-4 pt-5 dark:border-edge">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-ink/50 dark:text-bone/50">
                    You may also like
                  </p>
                  <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {suggestions.map((p) => (
                      <Link
                        key={p.id}
                        to={`/shop/${p.slug}`}
                        onClick={closeCart}
                        className="group shrink-0"
                      >
                        <div className="h-20 w-[62px] overflow-hidden rounded-card bg-surface dark:bg-edge">
                          <img
                            src={p.image}
                            alt={p.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = PLACEHOLDER;
                            }}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <p className="mt-1.5 max-w-[62px] truncate text-[10px] font-medium">
                          {p.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="shrink-0 border-t border-mist px-6 py-5 dark:border-edge">
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-ink/70 dark:text-bone/70">Subtotal</span>
                <span className="font-mono font-medium">{formatPrice(subtotal)}</span>
              </div>

              {appliedDiscount && discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-green-600 dark:text-green-400">
                  <div className="flex items-center gap-1.5">
                    <span>10% Welcome Discount ({appliedDiscount.code})</span>
                    <button
                      onClick={removeDiscount}
                      className="text-[10px] text-ink/40 hover:text-red-500 dark:text-bone/40"
                    >
                      [Remove]
                    </button>
                  </div>
                  <span className="font-mono font-semibold">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              {cartExpressProductionFee > 0 && (
                <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span>⚡ Express Production Fee</span>
                  <span className="font-mono">+{formatPrice(cartExpressProductionFee)}</span>
                </div>
              )}

              <div className="flex items-baseline justify-between pt-1 border-t border-mist/40 dark:border-edge/40">
                <span className="font-semibold">Estimated Total</span>
                <span className="font-mono text-lg font-semibold text-gold">
                  {formatPrice(finalSubtotal)}
                </span>
              </div>
            </div>

            <p className="mt-1 text-xs text-ink/50 dark:text-bone/50">
              Taxes and shipping calculated at checkout
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={closeCart} className="btn-ghost text-center">
                Continue
              </button>
              <button
                onClick={() => {
                  closeCart();
                  navigate("/checkout");
                }}
                className="btn-primary"
              >
                Check out
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function BagEmptyIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-ink/20 dark:text-bone/20"
    >
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
