import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, FieldValue, generateOrderId, sendOrderEmails } from "./_lib.js";
import type { OrderPayload } from "./_lib.js";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = (req.headers.origin as string) || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { reference, orderData, orderId: clientOrderId } = req.body as {
    reference: string;
    orderData: OrderPayload;
    orderId?: string;
  };
  if (!reference || !orderData) {
    return res.status(400).json({ error: "Missing reference or order data" });
  }

  // Verify with Paystack
  let paystackData: Record<string, unknown>;
  try {
    const r = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } },
    );
    const json = (await r.json()) as { data: Record<string, unknown> };
    paystackData = json.data;
  } catch {
    return res.status(502).json({ error: "Could not reach Paystack — please contact support" });
  }

  if (paystackData.status !== "success") {
    return res.status(402).json({ error: "Payment was not successful" });
  }

  // Amount guard — allow ±₦1 rounding
  const expectedKobo = Math.round(orderData.total * 100);
  const paidKobo = paystackData.amount as number;
  if (Math.abs(paidKobo - expectedKobo) > 100) {
    return res.status(402).json({ error: "Paid amount does not match order total" });
  }

  const orderId = clientOrderId || generateOrderId();
  try {
    const docRef = getDb().collection("orders").doc(orderId);
    const existingSnap = await docRef.get();
    if (existingSnap.exists) {
      await docRef.update({
        status: "paid",
        reference,
        paystackChannel: (paystackData.channel as string) || "card",
        paidAt: FieldValue.serverTimestamp(),
      });
    } else {
      await docRef.set({
        ...orderData,
        id: orderId,
        reference,
        status: "paid",
        paystackChannel: paystackData.channel,
        createdAt: FieldValue.serverTimestamp(),
        paidAt: FieldValue.serverTimestamp(),
      });
    }
  } catch (err) {
    console.error("Firestore write failed:", err);
    return res.status(500).json({ error: "Failed to save order" });
  }

  try {
    await sendOrderEmails({ ...orderData, id: orderId });
  } catch (err) {
    console.error("Email failed:", err);
  }

  return res.status(200).json({ success: true, orderId });
}
