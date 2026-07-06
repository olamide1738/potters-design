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

async function postOrder(path: string, body: unknown): Promise<string> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { success?: boolean; orderId?: string; error?: string };
  if (!res.ok || !json.orderId) throw new Error(json.error ?? "Order request failed");
  return json.orderId;
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
