import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product } from "@/types";
import { getItemUnitPrice } from "@/lib/format";

export interface AppliedDiscount {
  code: string;
  percentage: number;
  email?: string;
}

interface StoreState {
  cart: CartLine[];
  wishlist: number[];
  compare: number[];
  appliedDiscount: AppliedDiscount | null;

  addToCart: (product: Product, opts?: { size?: string; color?: string; length?: string; quantity?: number; expressProduction?: boolean }) => void;
  removeFromCart: (productId: number, size?: string, color?: string, length?: string) => void;
  setQuantity: (productId: number, quantity: number, size?: string, color?: string, length?: string) => void;
  clearCart: () => void;

  toggleCartLineExpressProduction: (index: number) => void;
  setCartLineExpressProduction: (index: number, val: boolean) => void;

  toggleWishlist: (productId: number) => void;
  toggleCompare: (productId: number) => void;

  applyDiscount: (discount: AppliedDiscount) => void;
  removeDiscount: () => void;

  cartCount: () => number;
  cartSubtotal: () => number;
  cartExpressProductionFee: () => number;
  cartDiscountAmount: () => number;
}

const sameLine = (l: CartLine, productId: number, size?: string, color?: string, length?: string) =>
  l.productId === productId && l.size === size && l.color === color && l.length === length;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      compare: [],
      appliedDiscount: null,

      addToCart: (product, opts = {}) =>
        set((state) => {
          const { size, color, length, quantity = 1, expressProduction = false } = opts;
          const existing = state.cart.find(
            (l) => sameLine(l, product.id, size, color, length) && !!l.expressProduction === !!expressProduction
          );
          if (existing) {
            return {
              cart: state.cart.map((l) =>
                sameLine(l, product.id, size, color, length) && !!l.expressProduction === !!expressProduction
                  ? { ...l, quantity: l.quantity + quantity }
                  : l,
              ),
            };
          }
          const colorImgs = color && product.hasColorImages ? product.colorImages?.[color] : null;
          const lengthImgs = length && product.hasLengthImages ? product.lengthImages?.[length] : null;
          const commonImgs = colorImgs && lengthImgs ? colorImgs.filter((img) => lengthImgs.includes(img)) : null;

          const combKey3 = color && size && length ? `${color}_${size}_${length}` : null;
          const combKey2Length = color && length ? `${color}_${length}` : null;
          const combKey2Size = color && size ? `${color}_${size}` : null;

          const combImgs = product.hasCombinedVariantImages && product.combinedVariantImages
            ? (combKey3 && product.combinedVariantImages[combKey3]?.length
                ? product.combinedVariantImages[combKey3]
                : combKey2Length && product.combinedVariantImages[combKey2Length]?.length
                ? product.combinedVariantImages[combKey2Length]
                : combKey2Size && product.combinedVariantImages[combKey2Size]?.length
                ? product.combinedVariantImages[combKey2Size]
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
            unitPrice: getItemUnitPrice(product.price, size),
            image: lineImage,
            size,
            color,
            length,
            quantity,
            expressProduction: expressProduction ? true : undefined,
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

      toggleCartLineExpressProduction: (index: number) =>
        set((state) => ({
          cart: state.cart.map((line, i) =>
            i === index ? { ...line, expressProduction: !line.expressProduction } : line,
          ),
        })),

      setCartLineExpressProduction: (index: number, val: boolean) =>
        set((state) => ({
          cart: state.cart.map((line, i) =>
            i === index ? { ...line, expressProduction: val } : line,
          ),
        })),

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

      applyDiscount: (discount) => set({ appliedDiscount: discount }),
      removeDiscount: () => set({ appliedDiscount: null }),

      cartCount: () => get().cart.reduce((n, l) => n + l.quantity, 0),
      cartSubtotal: () => get().cart.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
      cartExpressProductionFee: () =>
        get().cart.reduce((sum, l) => sum + (l.expressProduction ? 20000 * l.quantity : 0), 0),
      cartDiscountAmount: () => {
        const sub = get().cartSubtotal();
        const disc = get().appliedDiscount;
        if (!disc || !disc.percentage) return 0;
        return Math.round(sub * (disc.percentage / 100));
      },
    }),
    { name: "potters-design-store" },
  ),
);
