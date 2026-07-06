import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { useStore } from "@/store/useStore";
import { useToastStore } from "@/store/useToastStore";
import { cn, formatProductPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const addToCart = useStore((s) => s.addToCart);
  const wishlisted = useStore((s) => s.wishlist.includes(product.id));
  const addToast = useToastStore((s) => s.addToast);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  const handleCart = () => {
    setCartLoading(true);
    addToCart(product);
    addToast("Added to cart");
    setTimeout(() => setCartLoading(false), 700);
  };

  const handleWishlist = () => {
    const adding = !wishlisted;
    setWishLoading(true);
    toggleWishlist(product.id);
    if (adding) addToast("Added to wishlist");
    setTimeout(() => setWishLoading(false), 600);
  };

  return (
    <article className="group relative flex flex-col">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-surface shadow-md dark:bg-carbon dark:shadow-none">
        <Link to={`/shop/${product.slug}`} aria-label={product.name}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/hanger-placeholder.svg";
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.onSale && (
            <span className="rounded-card bg-sale px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-bone">
              Sale
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-card bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-bone dark:bg-edge">
              Sold out
            </span>
          )}
          {product.featured && product.inStock && !product.onSale && (
            <span className="rounded-card bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-[#fda437] hover:text-white">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlist}
          disabled={wishLoading}
          className={cn(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-bone/85 text-ink backdrop-blur transition-colors hover:text-gold dark:bg-carbon/85 dark:text-bone dark:hover:text-gold",
            wishlisted && "text-sale hover:text-sale dark:text-sale dark:hover:text-sale",
          )}
        >
          {wishLoading ? (
            <SpinnerIcon size={16} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
              <path d="M12 20s-7-4.5-9-9a4.5 4.5 0 0 1 9-2 4.5 4.5 0 0 1 9 2c-2 4.5-9 9-9 9Z" />
            </svg>
          )}
        </button>

        {/* Action */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {product.hasVariants ? (
            <Link to={`/shop/${product.slug}`} className="btn-primary w-full shadow-md">
              Select options
            </Link>
          ) : (
            <button
              className="btn-accent w-full shadow-md"
              disabled={!product.inStock || cartLoading}
              onClick={handleCart}
            >
              {cartLoading ? (
                <SpinnerIcon size={16} />
              ) : product.inStock ? (
                "Add to cart"
              ) : (
                "Sold out"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3 flex flex-col gap-0.5">
        <span className="eyebrow text-[10px] tracking-[0.18em]">{product.category}</span>
        <Link to={`/shop/${product.slug}`} className="font-display text-lg font-medium leading-tight hover:text-gold">
          {product.name}
        </Link>
        <span className="text-sm font-semibold text-gold">
          {formatProductPrice(product.price)}
        </span>
      </div>
    </article>
  );
}

function SpinnerIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="animate-spin"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
