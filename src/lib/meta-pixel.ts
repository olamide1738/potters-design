declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const META_PIXEL_ID = "29164256683192279";

/**
 * Dispatches an event to the Meta (Facebook) Pixel.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      window.fbq("track", eventName, params);
    } catch (err) {
      console.warn(`[Meta Pixel] Failed to track ${eventName}:`, err);
    }
  }
}

/**
 * Standard Meta e-commerce events
 */
export function trackPageView() {
  trackEvent("PageView");
}

export function trackViewContent(product: {
  id: number;
  name: string;
  category?: string;
  price: number | [number, number];
}) {
  const priceVal = Array.isArray(product.price) ? product.price[0] : product.price;
  trackEvent("ViewContent", {
    content_name: product.name,
    content_category: product.category,
    content_ids: [String(product.id)],
    content_type: "product",
    value: priceVal,
    currency: "NGN",
  });
}

export function trackAddToCart(line: {
  productId: number;
  name: string;
  unitPrice: number;
  quantity: number;
}) {
  trackEvent("AddToCart", {
    content_name: line.name,
    content_ids: [String(line.productId)],
    content_type: "product",
    value: line.unitPrice * line.quantity,
    currency: "NGN",
  });
}

export function trackInitiateCheckout(
  items: Array<{ productId: number; name: string; unitPrice: number; quantity: number }>,
  total: number,
) {
  trackEvent("InitiateCheckout", {
    content_ids: items.map((i) => String(i.productId)),
    content_type: "product",
    num_items: items.reduce((acc, i) => acc + i.quantity, 0),
    value: total,
    currency: "NGN",
  });
}

export function trackPurchase(
  orderId: string,
  order?: { total: number; items: Array<{ productId: number; name: string; unitPrice: number; quantity: number }> },
) {
  if (!order) {
    trackEvent("Purchase", {
      order_id: orderId,
      currency: "NGN",
    });
    return;
  }
  trackEvent("Purchase", {
    content_ids: order.items.map((i) => String(i.productId)),
    content_type: "product",
    num_items: order.items.reduce((acc, i) => acc + i.quantity, 0),
    value: order.total,
    currency: "NGN",
    order_id: orderId,
  });
}
