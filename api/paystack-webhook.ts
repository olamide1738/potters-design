import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac } from "crypto";
import { getDb, FieldValue, sendOrderEmails } from "./_lib.js";
import type { OrderPayload } from "./_lib.js";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  // Read raw body for HMAC verification
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string));
  }
  const rawBody = Buffer.concat(chunks).toString("utf8");

  const sig = req.headers["x-paystack-signature"] as string;
  const hash = createHmac("sha512", PAYSTACK_SECRET).update(rawBody).digest("hex");
  if (!sig || hash !== sig) return res.status(401).send("Unauthorized");

  const body = JSON.parse(rawBody) as {
    event: string;
    data: {
      reference: string;
      amount: number;
      channel?: string;
      metadata?: { orderData?: OrderPayload };
    };
  };

  if (body.event === "charge.success") {
    const db = getDb();
    const snap = await db
      .collection("orders")
      .where("reference", "==", body.data.reference)
      .limit(1)
      .get();

    let docRef: FirebaseFirestore.DocumentReference | null = null;
    let orderDocData: (OrderPayload & { id: string }) | null = null;

    if (!snap.empty) {
      docRef = snap.docs[0].ref;
      orderDocData = snap.docs[0].data() as OrderPayload & { id: string };
    } else {
      const byId = await db.collection("orders").doc(body.data.reference).get();
      if (byId.exists) {
        docRef = byId.ref;
        orderDocData = byId.data() as OrderPayload & { id: string };
      }
    }

    if (docRef && orderDocData) {
      await docRef.update({
        status: "paid",
        paidAt: FieldValue.serverTimestamp(),
        paystackChannel: body.data.channel || "card",
      });
      try {
        await sendOrderEmails({ ...orderDocData, id: docRef.id, paymentMethod: "paystack" });
      } catch (err) {
        console.error("Webhook email dispatch failed for existing doc:", err);
      }
    } else if (body.data.metadata?.orderData) {
      const orderData = body.data.metadata.orderData;
      const orderId = body.data.reference;
      await db.collection("orders").doc(orderId).set({
        ...orderData,
        id: orderId,
        reference: orderId,
        status: "paid",
        paystackChannel: body.data.channel,
        createdAt: FieldValue.serverTimestamp(),
        paidAt: FieldValue.serverTimestamp(),
      });
      try {
        await sendOrderEmails({ ...orderData, id: orderId, paymentMethod: "paystack" });
      } catch (err) {
        console.error("Webhook email dispatch failed:", err);
      }
    }
  }

  return res.status(200).send("OK");
}
