import * as admin from "firebase-admin";
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import axios from "axios";
import { Resend } from "resend";
import * as crypto from "crypto";

admin.initializeApp();
const db = admin.firestore();

// ── Environment variables (set in functions/.env) ──────────────────────────
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";
const RESEND_KEY = process.env.RESEND_API_KEY ?? "";
const EMAIL_FROM = process.env.EMAIL_FROM ?? "orders@pottersdesign.com";
const STORE_EMAIL = process.env.STORE_EMAIL ?? "pottersdesignltd@gmail.com";

// ── Types ──────────────────────────────────────────────────────────────────
interface CartLine {
  productId: number;
  slug: string;
  name: string;
  unitPrice: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface OrderPayload {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  fulfillment: "delivery" | "pickup";
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    countryCode: string;
    zip: string;
  };
  items: CartLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
  weightKg: number;
  orderNote: string;
  paymentMethod: "bank" | "paystack";
}

// ── Helpers ────────────────────────────────────────────────────────────────
function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `PD-${ts}-${rand}`;
}

function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

// ── 1. verifyPayment — callable from the frontend after Paystack popup ─────
export const verifyPayment = onCall<{
  reference: string;
  orderData: OrderPayload;
}>(async (request) => {
  const { reference, orderData } = request.data;

  if (!reference || !orderData) {
    throw new HttpsError("invalid-argument", "Missing reference or order data");
  }

  // Verify with Paystack
  let paystackData: Record<string, unknown>;
  try {
    const { data } = await axios.get(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } },
    );
    paystackData = data.data as Record<string, unknown>;
  } catch {
    throw new HttpsError("internal", "Could not reach Paystack — please contact support");
  }

  if (paystackData.status !== "success") {
    throw new HttpsError("failed-precondition", "Payment was not successful");
  }

  // Amount guard — compare kobo, allow ±₦1 rounding
  const expectedKobo = Math.round(orderData.total * 100);
  const paidKobo = paystackData.amount as number;
  if (Math.abs(paidKobo - expectedKobo) > 100) {
    throw new HttpsError("failed-precondition", "Paid amount does not match order total");
  }

  const orderId = generateOrderId();
  await db.collection("orders").doc(orderId).set({
    ...orderData,
    id: orderId,
    reference,
    status: "paid",
    paystackChannel: paystackData.channel,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    paidAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, orderId };
});

// ── 2. createBankOrder — callable, saves a pending bank-transfer order ─────
export const createBankOrder = onCall<{ orderData: OrderPayload }>(async (request) => {
  const { orderData } = request.data;

  if (!orderData) {
    throw new HttpsError("invalid-argument", "Missing order data");
  }

  const orderId = generateOrderId();
  await db.collection("orders").doc(orderId).set({
    ...orderData,
    id: orderId,
    reference: `bank-${orderId}`,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    paidAt: null,
  });

  return { success: true, orderId };
});

// ── 3. paystackWebhook — raw HTTP, receives Paystack push events ───────────
export const paystackWebhook = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const sig = req.headers["x-paystack-signature"] as string;
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (!sig || hash !== sig) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { event, data } = req.body as {
    event: string;
    data: { reference: string; amount: number };
  };

  if (event === "charge.success") {
    const snap = await db
      .collection("orders")
      .where("reference", "==", data.reference)
      .limit(1)
      .get();

    if (!snap.empty) {
      await snap.docs[0].ref.update({
        status: "paid",
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  res.status(200).send("OK");
});

// ── 4. onOrderCreate — sends confirmation email via Resend ────────────────
export const onOrderCreated = onDocumentCreated("orders/{orderId}", async (event) => {
  const order = event.data?.data() as (OrderPayload & {
    id: string;
    status: string;
  }) | undefined;

  if (!order || !RESEND_KEY) return;

  const resend = new Resend(RESEND_KEY);
  const customerName = `${order.customer.firstName} ${order.customer.lastName}`;
  const isBank = order.paymentMethod === "bank";
  const subject = isBank
    ? `Order received — ${order.id} | Potter's Design`
    : `Payment confirmed — ${order.id} | Potter's Design`;

  const fulfillmentDetailsHtml =
    order.fulfillment === "pickup"
      ? `<div style="background:#fdf8f0;border:1px solid #fae8cb;border-radius:8px;padding:14px 16px;margin:0 0 20px">
          <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#c8852b;text-transform:uppercase;letter-spacing:0.05em">Fulfillment Method</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#111">Store Pickup</p>
          <p style="margin:4px 0 0;font-size:13px;color:#555">No 4, Akinsanmi Street, Obanikoro Estate, Mainland Lagos, Nigeria</p>
        </div>`
      : order.shippingAddress
      ? `<div style="background:#f9f9f9;border:1px solid #eee;border-radius:8px;padding:14px 16px;margin:0 0 20px">
          <p style="margin:0 0 2px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.05em">Delivery Address</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#111">${order.shippingAddress.address}</p>
          <p style="margin:3px 0 0;font-size:13px;color:#555">${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.countryCode} ${order.shippingAddress.zip ? `· ${order.shippingAddress.zip}` : ""}</p>
        </div>`
      : "";

  const itemsHtml = order.items
    .map(
      (line) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px">
          <strong>${line.name}</strong>${line.size ? ` · Size: ${line.size}` : ""}${line.color ? ` · Color: ${line.color}` : ""}
          <div style="font-size:12px;color:#666;margin-top:2px">Qty: ${line.quantity} × ${formatNGN(line.unitPrice)}</div>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-family:monospace;font-size:14px;font-weight:600">
          ${formatNGN(line.unitPrice * line.quantity)}
        </td>
      </tr>`,
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;color:#111">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;border:1px solid #e0e0e0">

      <!-- Header -->
      <tr>
        <td style="background:#16130f;padding:32px 40px;text-align:center">
          <p style="margin:0;color:#c8852b;font-size:22px;font-weight:700;letter-spacing:0.04em">POTTER'S DESIGN</p>
          <p style="margin:8px 0 0;color:#fff;font-size:13px;opacity:0.75">Heritage. Reimagined.</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:36px 40px">
          <h1 style="margin:0 0 8px;font-size:24px;font-weight:700">${isBank ? "Order Received" : "Payment Confirmed"} 🎉</h1>
          <p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.6">Hi ${customerName}, ${isBank
    ? "your order has been saved. Please complete your bank transfer to begin production."
    : "your payment was successful. We'll begin crafting your order right away."}</p>

          <!-- Order ref -->
          <div style="background:#fbf9f6;border:1px solid #ebdcc6;border-radius:8px;padding:16px 20px;margin:0 0 24px">
            <p style="margin:0 0 4px;font-size:11px;color:#8c7853;text-transform:uppercase;letter-spacing:0.1em;font-weight:700">Order Reference</p>
            <p style="margin:0;font-size:20px;font-weight:700;font-family:monospace;color:#16130f">${order.id}</p>
          </div>

          <!-- Customer details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;background:#f9f9f9;border-radius:8px;padding:14px 16px;font-size:13px">
            <tr><td style="padding:3px 0;color:#666">Customer:</td><td style="padding:3px 0;font-weight:600;text-align:right">${customerName}</td></tr>
            <tr><td style="padding:3px 0;color:#666">Email:</td><td style="padding:3px 0;font-weight:600;text-align:right">${order.customer.email}</td></tr>
            <tr><td style="padding:3px 0;color:#666">Phone:</td><td style="padding:3px 0;font-weight:600;font-family:monospace;text-align:right">${order.customer.phone}</td></tr>
          </table>

          ${fulfillmentDetailsHtml}

          <!-- Items -->
          <h3 style="margin:20px 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:#c8852b">Ordered Items (${order.items.length})</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px">
            ${itemsHtml}
          </table>

          <!-- Totals -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#fbf9f6;border-radius:8px;padding:16px">
            <tr>
              <td style="padding:6px 0;color:#555;font-size:14px">Subtotal</td>
              <td style="padding:6px 0;text-align:right;font-family:monospace;font-size:14px">${formatNGN(order.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#555;font-size:14px">Shipping</td>
              <td style="padding:6px 0;text-align:right;font-family:monospace;font-size:14px">${order.shippingFee === 0 ? "Free (Pickup)" : formatNGN(order.shippingFee)}</td>
            </tr>
            <tr style="border-top:1.5px solid #16130f">
              <td style="padding:10px 0 0;font-weight:700;font-size:16px">Total</td>
              <td style="padding:10px 0 0;text-align:right;font-family:monospace;font-weight:700;font-size:17px;color:#c8852b">${formatNGN(order.total)}</td>
            </tr>
          </table>

          ${isBank ? `
          <!-- Bank transfer instructions -->
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:20px;margin:0 0 24px">
            <p style="margin:0 0 8px;font-weight:700;color:#92400e">Complete your transfer</p>
            <p style="margin:0 0 12px;font-size:14px;color:#78350f;line-height:1.6">
              Transfer <strong>${formatNGN(order.total)}</strong> to any of the accounts below, then send your receipt and order reference <strong>${order.id}</strong> via WhatsApp to <strong>+234 701 737 7822</strong>.
            </p>
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#78350f">NGN Accounts</p>
            <p style="margin:0 0 2px;font-size:13px;color:#78350f">The Potter's Design Ltd · Wema Bank · <strong>0127024387</strong></p>
            <p style="margin:0 0 12px;font-size:13px;color:#78350f">The Potters Design Limited · First Bank · <strong>2046299408</strong></p>
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#78350f">USD Account</p>
            <p style="margin:0;font-size:13px;color:#78350f">The Potter's Design Ltd · First Bank · <strong>2046300632</strong></p>
          </div>
          ` : ""}

          <p style="margin:0;font-size:14px;color:#555;line-height:1.7">
            Questions? Reply to this email or chat with us on WhatsApp at
            <a href="https://wa.me/2347017377822" style="color:#c8852b;font-weight:600">+234 701 737 7822</a>.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0;font-size:12px;color:#999">
            © ${new Date().getFullYear()} The Potter's Design Limited · No 4, Akinsanmi Street, Obanikoro Estate, Mainland Lagos
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  // Send to customer
  await resend.emails.send({
    from: EMAIL_FROM,
    to: order.customer.email,
    subject,
    html,
  });

  // Send notification to the store
  await resend.emails.send({
    from: EMAIL_FROM,
    to: STORE_EMAIL,
    subject: `🚨 NEW ORDER RECEIVED! — #${order.id} — ${formatNGN(order.total)} (${customerName})`,
    html,
  });
});
