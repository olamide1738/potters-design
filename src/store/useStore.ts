import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product } from "@/types";
import { priceFloor } from "@/lib/format";

interface StoreState {
  cart: CartLine[];
  wishlist: number[];
  compare: number[];

  addToCart: (product: Product, opts?: { size?: string; color?: string; length?: string; quantity?: number }) => void;
  removeFromCart: (productId: number, size?: string, color?: string, length?: string) => void;
  setQuantity: (productId: number, quantity: number, size?: string, color?: string, length?: string) => void;
  clearCart: () => void;

  toggleWishlist: (productId: number) => void;
  toggleCompare: (productId: number) => void;

  cartCount: () => number;
  cartSubtotal: () => number;
}

const sameLine = (l: CartLine, productId: number, size?: string, color?: string, length?: string) =>
  l.productId === productId && l.size === size && l.color === color && l.length === length;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      compare: [],

      addToCart: (product, opts = {}) =>
        set((state) => {
          const { size, color, length, quantity = 1 } = opts;
          const existing = state.cart.find((l) => sameLine(l, product.id, size, color, length));
          if (existing) {
            return {
              cart: state.cart.map((l) =>
                sameLine(l, product.id, size, color, length)
                  ? { ...l, quantity: l.quantity + quantity }
                  : l,
              ),
            };
          }
          const colorImgs = color && product.hasColorImages ? product.colorImages?.[color] : null;
          const lengthImgs = length && product.hasLengthImages ? product.lengthImages?.[length] : null;
          const commonImgs = colorImgs && lengthImgs ? colorImgs.filter((img) => lengthImgs.includes(img)) : null;

          const combKey3 = color && size && length ? `${color}_${size}_${length}` : null;
          const combKey2Size = color && size ? `${color}_${size}` : null;
          const combKey2Length = color && length ? `${color}_${length}` : null;

          const combImgs = product.hasCombinedVariantImages && product.combinedVariantImages
            ? (combKey3 && product.combinedVariantImages[combKey3]?.length
                ? product.combinedVariantImages[combKey3]
                : combKey2Size && product.combinedVariantImages[combKey2Size]?.length
                ? product.combinedVariantImages[combKey2Size]
                : combKey2Length && product.combinedVariantImages[combKey2Length]?.length
                ? product.combinedVariantImages[combKey2Length]
                : null)
            : null;

          const lineImage =
            combImgs && combImgs.length > 0
              ? combImgs[0]
              : commonImgs && commonImgs.length > 0
              ? commonImgs[0]
              : colorImgs && colorImgs.length > 0
              ? colorImgs[0]
              : lengthImgs && lengthImgs.length > 0
              ? lengthImgs[0]
              : product.image;

          const line: CartLine = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            unitPrice: priceFloor(product.price),
            image: lineImage,
            size,
            color,
            length,
            quantity,
          };
          return { cart: [...state.cart, line] };
        }),

      removeFromCart: (productId, size, color, length) =>
        set((state) => ({
          cart: state.cart.filter((l) => !sameLine(l, productId, size, color, length)),
        })),

      setQuantity: (productId, quantity, size, color, length) =>
        set((state) => ({
          cart: state.cart
            .map((l) =>
              sameLine(l, productId, size, color, length)
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
