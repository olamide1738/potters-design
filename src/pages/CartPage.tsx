import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/lib/format";

export function CartPage() {
  const cart = useStore((s) => s.cart);
  const setQuantity = useStore((s) => s.setQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const subtotal = useStore((s) => s.cartSubtotal());
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const cartIds = new Set(cart.map((l) => l.productId));
  const suggestions = PRODUCTS.filter((p) => !cartIds.has(p.id)).slice(0, 5);

  if (cart.length === 0) {
    return (
      <div className="shell py-16">
        <div className="mx-auto max-w-xl">
          <h1 className="font-display text-2xl font-semibold">Shopping cart</h1>
          <div className="mt-10 rounded-card border border-dashed border-mist py-24 text-center dark:border-edge">
            <p className="font-display text-xl">Your cart is empty.</p>
            <p className="mt-2 text-sm text-ink/50 dark:text-bone/50">
              Add items to your cart to continue.
            </p>
            <Link to="/shop" className="btn-primary mt-6">
              Start shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-mist pb-5 dark:border-edge">
          <div>
            <h1 className="font-display text-2xl font-semibold">Shopping cart</h1>
            <p className="mt-0.5 text-sm text-ink/50 dark:text-bone/50">
              {cart.reduce((n, l) => n + l.quantity, 0)} item
              {cart.reduce((n, l) => n + l.quantity, 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            to="/shop"
            aria-label="Continue shopping"
            className="grid h-9 w-9 place-items-center rounded-full border border-mist text-ink/50 transition-colors hover:border-ink hover:text-ink dark:border-edge dark:text-bone/50 dark:hover:border-bone dark:hover:text-bone"
          >
            <XIcon />
          </Link>
        </div>

        {/* Cart lines */}
        <ul className="divide-y divide-mist dark:divide-edge">
          {cart.map((line) => (
            <li
              key={`${line.productId}-${line.size}-${line.color}`}
              className="flex gap-4 py-5"
            >
              <Link to={`/shop/${line.slug}`} className="shrink-0">
                <img
                  src={line.image}
                  alt={line.name}
                  className="h-[100px] w-[80px] rounded-card object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link
                      to={`/shop/${line.slug}`}
                      className="font-display text-[15px] font-medium leading-snug hover:text-gold"
                    >
                      {line.name}
                    </Link>
                    {(line.size || line.color) && (
                      <p className="mt-0.5 text-xs text-ink/50 dark:text-bone/50">
                        {[line.size, line.color].filter(Boolean).join(" / ")}
                      </p>
                    )}
                    <p className="mt-1.5 text-sm font-semibold">
                      {formatPrice(line.unitPrice)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-card border border-mist dark:border-edge">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() =>
                        setQuantity(
                          line.productId,
                          line.quantity - 1,
                          line.size,
                          line.color,
                        )
                      }
                      className="px-3 py-1.5 text-base leading-none hover:text-gold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {line.quantity}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() =>
                        setQuantity(
                          line.productId,
                          line.quantity + 1,
                          line.size,
                          line.color,
                        )
                      }
                      className="px-3 py-1.5 text-base leading-none hover:text-gold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      removeFromCart(line.productId, line.size, line.color)
                    }
                    className="text-xs text-ink/40 underline underline-offset-4 transition-colors hover:text-ink dark:text-bone/40 dark:hover:text-bone"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Customers also bought */}
        {suggestions.length > 0 && (
          <div className="mt-2 border-t border-mist pt-6 dark:border-edge">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink/50 dark:text-bone/50">
              Customers also bought
            </p>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {suggestions.map((p) => (
                <Link key={p.id} to={`/shop/${p.slug}`} className="group shrink-0">
                  <div className="h-[86px] w-[70px] overflow-hidden rounded-card bg-surface dark:bg-edge">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-1.5 max-w-[70px] truncate text-[11px] font-medium">
                    {p.name}
                  </p>
                  <p className="text-[10px] text-ink/50 dark:text-bone/50">
                    {formatPrice(
                      Array.isArray(p.price) ? p.price[0] : p.price,
                    )}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Subtotal */}
        <div className="mt-6 border-t border-mist pt-5 dark:border-edge">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Subtotal</span>
            <span className="font-mono text-base font-semibold text-gold">
              {formatPrice(subtotal)}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink/50 dark:text-bone/50">
            Taxes and shipping calculated at checkout
          </p>
        </div>

        {/* T&C checkbox */}
        <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-sm select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-px h-4 w-4 shrink-0 cursor-pointer rounded-sm accent-gold"
          />
          <span className="text-ink/70 dark:text-bone/70">
            I agree with the{" "}
            <Link
              to="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline underline-offset-4 hover:text-gold dark:text-bone"
            >
              terms and conditions
            </Link>
          </span>
        </label>

        {/* Action buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link to="/shop" className="btn-ghost text-center">
            View cart
          </Link>
          <button
            disabled={!agreed}
            onClick={() => navigate("/checkout")}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check out
          </button>
        </div>
      </div>
    </div>
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
