import type { CartLine, OrderCustomer, OrderShipping, FulfillmentMethod, PaymentMethod } from "@/types";
import { createOrderInFirestore, markOrderPaidInFirestore } from "./orders-db";

export interface OrderPayload {
  customer: OrderCustomer;
  fulfillment: FulfillmentMethod;
  shippingAddress?: OrderShipping;
  items: CartLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
  weightKg: number;
  expressProduction?: boolean;
  expressProductionFee?: number;
  orderNote: string;
  paymentMethod: PaymentMethod;
}

const VERCEL_BACKEND = "https://potters-design.vercel.app";

/**
 * Generates a clean, unique, professional order reference.
 * Format: PD-<timestamp36>-<random4> (e.g. PD-M5G4X9-8K2Q)
 */
export function generateOrderId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PD-${Date.now().toString(36).toUpperCase()}-${suffix}`;
}

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

  throw new Error("Order API request failed");
}

/**
 * Saves a bank transfer order:
 * 1. Writes directly to Firestore first (instant reflection in admin dashboard).
 * 2. Asynchronously triggers email alerts via backend API.
 */
export async function saveBankOrder(
  orderData: OrderPayload,
  clientOrderId?: string,
): Promise<string> {
  const orderId = clientOrderId || generateOrderId();

  let dbSaved = false;

  // 1. Direct write to Firestore first — guarantees instant persistence in the DB
  try {
    await createOrderInFirestore(orderId, orderData, "pending");
    dbSaved = true;
    console.log(`[Order] Successfully saved order ${orderId} directly to Firestore`);
  } catch (dbErr) {
    console.warn(`[Order] Direct Firestore write failed (will rely on API fallback):`, dbErr);
  }

  // 2. Call backend API to trigger email alerts and backup persistence
  try {
    await postOrder("/api/create-bank-order", { orderId, orderData });
  } catch (apiErr) {
    console.warn(`[Order] Backend notification API call failed:`, apiErr);
    if (!dbSaved) {
      throw new Error("Unable to save order to database. Please check your connection.");
    }
  }

  return orderId;
}

/**
 * Verifies and records a successful Paystack order:
 * 1. Updates the pre-saved order to 'paid' in Firestore directly.
 * 2. Calls backend API to verify transaction with Paystack and send emails.
 */
export async function verifyAndSavePaystackOrder(
  reference: string,
  orderData: OrderPayload,
  clientOrderId?: string,
): Promise<string> {
  const orderId = clientOrderId || reference;

  let dbUpdated = false;

  // 1. Direct write to Firestore: update order status to "paid" immediately
  try {
    await markOrderPaidInFirestore(orderId, reference, "card");
    dbUpdated = true;
    console.log(`[Order] Marked order ${orderId} paid directly in Firestore`);
  } catch (dbErr) {
    console.warn(`[Order] Direct Firestore mark paid failed (will rely on API fallback):`, dbErr);
  }

  // 2. Call backend API to verify with Paystack and dispatch confirmation emails
  try {
    await postOrder("/api/verify-payment", { reference, orderId, orderData });
  } catch (apiErr) {
    console.warn(`[Order] Backend payment verification API failed:`, apiErr);
    if (!dbUpdated) {
      // If direct update failed AND API failed, try creating the paid order directly in DB
      try {
        await createOrderInFirestore(orderId, { ...orderData, paymentMethod: "paystack" }, "paid");
        dbUpdated = true;
      } catch (fallbackDbErr) {
        console.error(`[Order] Fallback paid write also failed:`, fallbackDbErr);
      }
    }
  }

  return orderId;
}

export async function triggerAdminAlertEmail(orderData: unknown): Promise<void> {
  try {
    await postOrder("/api/send-admin-alert", { orderData });
  } catch (err) {
    console.error("Failed to trigger admin email alert from dashboard:", err);
  }
}
