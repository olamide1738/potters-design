import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac } from "crypto";
import { getDb, FieldValue } from "./_lib.js";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";

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
    data: { reference: string; amount: number };
  };

  if (body.event === "charge.success") {
    const db = getDb();
    const snap = await db
      .collection("orders")
      .where("reference", "==", body.data.reference)
      .limit(1)
      .get();

    if (!snap.empty) {
      await snap.docs[0].ref.update({
        status: "paid",
        paidAt: FieldValue.serverTimestamp(),
      });
    }
  }

  return res.status(200).send("OK");
}
