import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, FieldValue, sendOrderEmails } from "./_lib.js";
import type { OrderPayload } from "./_lib.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = req.query.secret || req.body?.secret;
  if (secret !== "potters-recover-2026") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = getDb();

  // 1. Fetch all orders currently in Firestore
  const snap = await db.collection("orders").get();
  const existingOrders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // 2. Define missing order details for PD-1789222025594
  const orderId = "PD-1789222025594";
  const orderData: OrderPayload = {
    customer: {
      firstName: "Khairat Damilola",
      lastName: "Olumoh",
      email: "kopemejiofficial@gmail.com",
      phone: "+2340000000000",
    },
    fulfillment: "delivery",
    shippingAddress: {
      address: "Delivery address pending customer confirmation",
      city: "Lagos",
      state: "Lagos",
      countryCode: "NG",
      zip: "100001",
    },
    items: [
      {
        productId: 36218,
        slug: "awero",
        name: "Awero / Store Order (Recovered)",
        unitPrice: 164000,
        image: "/images/products/awero-1.jpg",
        quantity: 1,
      },
    ],
    subtotal: 164000,
    shippingFee: 0,
    total: 164000,
    weightKg: 1.5,
    orderNote: "Paystack Bank Transfer order recovered from transaction PD-1789222025594 (3:08 PM WAT)",
    paymentMethod: "paystack",
  };

  // 3. Save order to Firestore
  await db.collection("orders").doc(orderId).set({
    ...orderData,
    id: orderId,
    reference: orderId,
    status: "paid",
    paystackChannel: "bank_transfer",
    createdAt: new Date("2026-09-12T14:07:09.000Z"),
    paidAt: new Date("2026-09-12T14:08:02.000Z"),
  });

  // 4. Send emails
  let emailSent = false;
  try {
    await sendOrderEmails({ ...orderData, id: orderId });
    emailSent = true;
  } catch (err) {
    console.error("Email send error:", err);
  }

  return res.status(200).json({
    success: true,
    message: `Order ${orderId} recovered and inserted into Firestore`,
    emailSent,
    existingOrdersCount: snap.size,
    existingOrders,
  });
}
