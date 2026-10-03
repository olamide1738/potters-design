import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, sendOrderEmails } from "./_lib.js";
import type { OrderPayload } from "./_lib.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = req.query.secret || req.body?.secret;
  if (secret !== "potters-recover-september") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = getDb();

  // Order 1: n.gassamaa@gmail.com (PD-1790581966807) - ₦301,873.05
  const order1Id = "PD-1790581966807";
  const order1Data: OrderPayload = {
    customer: {
      firstName: "N.",
      lastName: "Gassama",
      email: "n.gassamaa@gmail.com",
      phone: "+2340000000000",
    },
    fulfillment: "delivery",
    shippingAddress: {
      address: "Delivery address pending customer confirmation",
      city: "International",
      state: "International",
      countryCode: "LT",
      zip: "",
    },
    items: [
      {
        productId: 36218,
        slug: "awero",
        name: "Store Product (Recovered Order)",
        unitPrice: 301873.05,
        image: "/images/products/awero-1.jpg",
        quantity: 1,
      },
    ],
    subtotal: 301873.05,
    shippingFee: 0,
    total: 301873.05,
    weightKg: 1.5,
    orderNote: "Recovered September 28 Paystack order (Revolut Bank Mastercard ending in 2754)",
    paymentMethod: "paystack",
  };

  // Order 2: tadeyemi@gmail.com (PD-1790441538961) - ₦188,000.00
  const order2Id = "PD-1790441538961";
  const order2Data: OrderPayload = {
    customer: {
      firstName: "Adeyemi Lucia",
      lastName: "Taiwo",
      email: "tadeyemi@gmail.com",
      phone: "+2340000000000",
    },
    fulfillment: "delivery",
    shippingAddress: {
      address: "Delivery address pending customer confirmation",
      city: "Lagos",
      state: "Lagos",
      countryCode: "NG",
      zip: "",
    },
    items: [
      {
        productId: 35728,
        slug: "bewaji",
        name: "Store Product (Recovered Order)",
        unitPrice: 188000,
        image: "/images/products/bewaji-1.jpg",
        quantity: 1,
      },
    ],
    subtotal: 188000,
    shippingFee: 0,
    total: 188000,
    weightKg: 1.5,
    orderNote: "Recovered September 26 Paystack order (GTBank Mastercard ending in 2010)",
    paymentMethod: "paystack",
  };

  // Insert both into Firestore
  await db.collection("orders").doc(order1Id).set({
    ...order1Data,
    id: order1Id,
    reference: order1Id,
    status: "paid",
    paystackChannel: "card",
    createdAt: new Date("2026-09-28T07:52:49.000Z"),
    paidAt: new Date("2026-09-28T07:55:09.000Z"),
  });

  await db.collection("orders").doc(order2Id).set({
    ...order2Data,
    id: order2Id,
    reference: order2Id,
    status: "paid",
    paystackChannel: "card",
    createdAt: new Date("2026-09-26T16:52:21.000Z"),
    paidAt: new Date("2026-09-26T16:53:34.000Z"),
  });

  // Send Order Emails for both
  let email1Sent = false;
  let email2Sent = false;

  try {
    await sendOrderEmails({ ...order1Data, id: order1Id });
    email1Sent = true;
  } catch (err) {
    console.error("Email 1 send error:", err);
  }

  try {
    await sendOrderEmails({ ...order2Data, id: order2Id });
    email2Sent = true;
  } catch (err) {
    console.error("Email 2 send error:", err);
  }

  return res.status(200).json({
    success: true,
    message: "Both September missing orders recovered and inserted into Firestore!",
    recoveredOrders: [
      { id: order1Id, email: order1Data.customer.email, total: order1Data.total, emailSent: email1Sent },
      { id: order2Id, email: order2Data.customer.email, total: order2Data.total, emailSent: email2Sent },
    ],
  });
}
