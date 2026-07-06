import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, FieldValue, generateOrderId, sendOrderEmails } from "./_lib.js";
import type { OrderPayload } from "./_lib.js";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { reference, orderData } = req.body as { reference: string; orderData: OrderPayload };
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

  const orderId = generateOrderId();
  try {
    await getDb().collection("orders").doc(orderId).set({
      ...orderData,
      id: orderId,
      reference,
      status: "paid",
      paystackChannel: paystackData.channel,
      createdAt: FieldValue.serverTimestamp(),
      paidAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("Firestore write failed:", err);
    return res.status(500).json({ error: "Failed to save order" });
  }

  // Emails — non-blocking, don't fail the order if email fails
  sendOrderEmails({ ...orderData, id: orderId }).catch((err) =>
    console.error("Email failed:", err),
  );

  return res.status(200).json({ success: true, orderId });
}
