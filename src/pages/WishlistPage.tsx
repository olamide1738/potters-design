import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export function WishlistPage() {
  const wishlist = useStore((s) => s.wishlist);
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="shell py-16">
      <span className="eyebrow">Saved pieces</span>
      <h1 className="mt-3 text-4xl font-semibold">Wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-card border border-dashed border-mist py-20 text-center dark:border-edge">
          <p className="font-display text-xl">Your wishlist is empty.</p>
          <p className="mt-2 text-sm text-ink/60 dark:text-bone/60">Tap the heart on any piece to save it here.</p>
          <Link to="/shop" className="btn-primary mt-6">Browse the shop</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
