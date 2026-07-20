export type Currency = "NGN";

export interface ProductVariantOption {
  /** e.g. "Size" or "Color" */
  name: string;
  values: string[];
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  /** Single price, or [min, max] for variable products */
  price: number | [number, number];
  image: string;
  hoverImage?: string;
  /** All gallery images (first should match `image`) */
  gallery?: string[];
  category: ProductCategory;
  tags: string[];
  colors: string[];
  sizes: string[];
  inStock: boolean;
  onSale: boolean;
  featured: boolean;
  /** true when the product has selectable variants ("Select options") */
  hasVariants: boolean;
  /** Fine-grained stock toggling for variant options */
  variantStock?: {
    sizes?: Record<string, boolean>;
    colors?: Record<string, boolean>;
  };
  description?: string;
  fabric?: string;
  careInstructions?: string;
  /** e.g. "1.2 – 1.4 kg (incl. packaging)" — display string */
  weightKg?: string;
  /** Total per-unit shipping weight in kg (product + packaging box) */
  shippingWeightKg?: number;
  /** e.g. "Length: 118 cm · Width: 31 cm" */
  dimensions?: string;
  /** Price breakdown note, e.g. "Sizes 6–12: ₦130,000 · Sizes 14–26: ₦150,000" */
  priceNote?: string;
}

export type ProductCategory =
  | "2-pieces"
  | "Bubu"
  | "Dresses"
  | "Pants"
  | "Skirt"
  | "Top";

export interface CartLine {
  productId: number;
  slug: string;
  name: string;
  unitPrice: number;
  image: string;
  size?: string;
  color?: string;
  length?: string;
  quantity: number;
}

export interface ShopFilterState {
  search: string;
  categories: ProductCategory[];
  tags: string[];
  colors: string[];
  sizes: string[];
  priceMin: number | null;
  priceMax: number | null;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sort: SortKey;
}

export type SortKey =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "newest";

export type OrderStatus = "pending" | "paid" | "failed";
export type PaymentMethod = "bank" | "paystack";
export type FulfillmentMethod = "delivery" | "pickup";

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OrderShipping {
  address: string;
  city: string;
  state: string;
  countryCode: string;
  zip: string;
}

export type OrderProductionStatus = "pending" | "received" | "production" | "ready" | "completed";

export interface Order {
  id: string;
  reference: string;
  status: OrderStatus;
  productionStatus?: OrderProductionStatus;
  paymentMethod: PaymentMethod;
  customer: OrderCustomer;
  fulfillment: FulfillmentMethod;
  shippingAddress?: OrderShipping;
  items: CartLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
  weightKg: number;
  orderNote: string;
  createdAt: Date;
  paidAt?: Date;
}
