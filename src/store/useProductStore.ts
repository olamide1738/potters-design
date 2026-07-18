import { create } from "zustand";
import type { Product } from "@/types";
import { PRODUCTS } from "@/data/products";
import { subscribeToProducts } from "@/lib/products-db";

interface ProductStoreState {
  /** Live catalog. Seeded with the bundled static list, replaced by Firestore. */
  products: Product[];
  /** True once the first Firestore snapshot has arrived. */
  loaded: boolean;
  /** True while showing the bundled fallback (Firestore empty/offline). */
  usingFallback: boolean;
  subscribe: () => () => void;
}

// Keep the catalog in a stable order (ids are the original catalog order).
const byId = (a: Product, b: Product) => a.id - b.id;

export const useProductStore = create<ProductStoreState>((set) => {
  let unsub: (() => void) | null = null;

  return {
    products: [...PRODUCTS].sort(byId),
    loaded: false,
    usingFallback: true,

    subscribe: () => {
      // Guard against duplicate listeners (React StrictMode double-invoke).
      if (unsub) return unsub;
      unsub = subscribeToProducts(
        (list) => {
          // Empty collection → keep the bundled catalog visible.
          if (list.length === 0) {
            set({ loaded: true, usingFallback: true });
            return;
          }
          set({
            products: [...list].sort(byId),
            loaded: true,
            usingFallback: false,
          });
        },
        (err) => {
          console.error("Firestore products subscription error:", err);
          // Firestore error (offline / rules) → stay on the bundled catalog.
          set({ loaded: true, usingFallback: true });
        },
      );
      return () => {
        unsub?.();
        unsub = null;
      };
    },
  };
});

/** Convenience selector hooks. */
export const useProducts = () => useProductStore((s) => s.products);

export function useProductBySlug(slug: string | undefined): Product | undefined {
  return useProductStore((s) =>
    slug ? s.products.find((p) => p.slug === slug) : undefined,
  );
}
