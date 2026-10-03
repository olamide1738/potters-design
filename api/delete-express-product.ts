import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./_lib.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = req.query.secret || req.body?.secret;
  if (secret !== "potters-delete-36231") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = getDb();
  await db.collection("products").doc("36231").delete();

  return res.status(200).json({
    success: true,
    message: "Product ID 36231 (3-Day Express Production) deleted successfully from Firestore catalog",
  });
}
