import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./_lib.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = req.query.secret || req.body?.secret;
  if (secret !== "potters-recover-2026") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = getDb();
  const snap = await db.collection("orders").get();

  const keepOrderId = "PD-1789222025594";
  const deletedOrders: string[] = [];

  const batch = db.batch();
  snap.docs.forEach((d) => {
    if (d.id !== keepOrderId) {
      batch.delete(d.ref);
      deletedOrders.push(d.id);
    }
  });

  await batch.commit();

  const remainingSnap = await db.collection("orders").get();
  const remainingOrders = remainingSnap.docs.map((d) => ({ id: d.id, customer: d.data().customer, total: d.data().total }));

  return res.status(200).json({
    success: true,
    message: `Deleted ${deletedOrders.length} test orders. Kept real customer order ${keepOrderId}.`,
    deletedOrders,
    remainingOrdersCount: remainingSnap.size,
    remainingOrders,
  });
}
