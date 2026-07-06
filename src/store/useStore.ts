import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product } from "@/types";
import { priceFloor } from "@/lib/format";

interface StoreState {
  cart: CartLine[];
  wishlist: number[];
  compare: number[];

  addToCart: (product: Product, opts?: { size?: string; color?: string; quantity?: number }) => void;
  removeFromCart: (productId: number, size?: string, color?: string) => void;
  setQuantity: (productId: number, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;

  toggleWishlist: (productId: number) => void;
  toggleCompare: (productId: number) => void;

  cartCount: () => number;
  cartSubtotal: () => number;
}

const sameLine = (l: CartLine, productId: number, size?: string, color?: string) =>
  l.productId === productId && l.size === size && l.color === color;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      compare: [],

      addToCart: (product, opts = {}) =>
        set((state) => {
          const { size, color, quantity = 1 } = opts;
          const existing = state.cart.find((l) => sameLine(l, product.id, size, color));
          if (existing) {
            return {
              cart: state.cart.map((l) =>
                sameLine(l, product.id, size, color)
                  ? { ...l, quantity: l.quantity + quantity }
                  : l,
              ),
            };
          }
          const line: CartLine = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            unitPrice: priceFloor(product.price),
            image: product.image,
            size,
            color,
            quantity,
          };
          return { cart: [...state.cart, line] };
        }),

      removeFromCart: (productId, size, color) =>
        set((state) => ({
          cart: state.cart.filter((l) => !sameLine(l, productId, size, color)),
        })),

      setQuantity: (productId, quantity, size, color) =>
        set((state) => ({
          cart: state.cart
            .map((l) =>
              sameLine(l, productId, size, color)
                ? { ...l, quantity: Math.max(1, quantity) }
                : l,
            )
            .filter((l) => l.quantity > 0),
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),

      toggleCompare: (productId) =>
        set((state) => ({
          compare: state.compare.includes(productId)
            ? state.compare.filter((id) => id !== productId)
            : [...state.compare, productId],
        })),

      cartCount: () => get().cart.reduce((n, l) => n + l.quantity, 0),
      cartSubtotal: () => get().cart.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    }),
    { name: "potters-design-store" },
  ),
);
