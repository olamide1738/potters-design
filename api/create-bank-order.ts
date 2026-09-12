import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, FieldValue, generateOrderId, sendOrderEmails } from "./_lib.js";
import type { OrderPayload } from "./_lib.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { orderData } = req.body as { orderData: OrderPayload };
  if (!orderData) return res.status(400).json({ error: "Missing order data" });

  const orderId = generateOrderId();
  try {
    await getDb().collection("orders").doc(orderId).set({
      ...orderData,
      id: orderId,
      reference: `bank-${orderId}`,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      paidAt: null,
    });
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
