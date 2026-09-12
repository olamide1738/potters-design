import type { CartLine, OrderCustomer, OrderShipping, FulfillmentMethod, PaymentMethod } from "@/types";

export interface OrderPayload {
  customer: OrderCustomer;
  fulfillment: FulfillmentMethod;
  shippingAddress?: OrderShipping;
  items: CartLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
  weightKg: number;
  orderNote: string;
  paymentMethod: PaymentMethod;
}

const VERCEL_BACKEND = "https://potters-design.vercel.app";

async function postOrder(path: string, body: unknown): Promise<string> {
  const isCustomDomain =
    typeof window !== "undefined" &&
    (window.location.hostname.includes("pottersdesign.com") ||
      (window.location.hostname !== "localhost" && !window.location.hostname.includes("vercel.app")));

  const primaryUrl = isCustomDomain ? `${VERCEL_BACKEND}${path}` : path;

  try {
    const res = await fetch(primaryUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as { success?: boolean; orderId?: string; error?: string };
    if (res.ok && json.orderId) return json.orderId;
  } catch (err) {
    console.warn("Primary API request failed, attempting Vercel backend fallback:", err);
  }

  // Fallback retry using Vercel backend URL
  if (!primaryUrl.startsWith(VERCEL_BACKEND)) {
    try {
      const fallbackRes = await fetch(`${VERCEL_BACKEND}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const fallbackJson = (await fallbackRes.json()) as { success?: boolean; orderId?: string; error?: string };
      if (fallbackRes.ok && fallbackJson.orderId) return fallbackJson.orderId;
    } catch (fallbackErr) {
      console.error("Vercel backend fallback failed:", fallbackErr);
    }
  }

  throw new Error("Order request failed");
}

export async function verifyAndSavePaystackOrder(
  reference: string,
  orderData: OrderPayload,
): Promise<string> {
  return postOrder("/api/verify-payment", { reference, orderData });
}

export async function saveBankOrder(orderData: OrderPayload): Promise<string> {
  return postOrder("/api/create-bank-order", { orderData });
}
