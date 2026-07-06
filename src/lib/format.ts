import type { Product } from "@/types";

const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return NGN.format(value);
}

/** Renders a single price or a "min – max" range for variable products. */
export function formatProductPrice(price: Product["price"]): string {
  if (Array.isArray(price)) {
    return `${formatPrice(price[0])} – ${formatPrice(price[1])}`;
  }
  return formatPrice(price);
}

/** The number used for sorting / filtering a product by price. */
export function priceFloor(price: Product["price"]): number {
  return Array.isArray(price) ? price[0] : price;
}

export function priceCeil(price: Product["price"]): number {
  return Array.isArray(price) ? price[1] : price;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
