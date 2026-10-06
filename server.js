import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createHmac, createHash } from "crypto";
import admin from "firebase-admin";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Environment Configuration ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "orders@pottersdesign.com";
const STORE_EMAIL = process.env.STORE_EMAIL || "pottersdesigning@gmail.com";
const META_PIXEL_ID = process.env.META_PIXEL_ID || "";
const META_CAPI_TOKEN = process.env.META_CONVERSION_API_TOKEN || "";

// ── Firebase Admin Initialization ──────────────────────────────────────────
function getDb() {
  if (!admin.apps.length) {
    const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (sa) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(sa)),
        });
      } catch (err) {
        console.warn("[Firebase] Could not parse FIREBASE_SERVICE_ACCOUNT string, using default init:", err);
        admin.initializeApp({ projectId: "pottersdesign-f0ab8" });
      }
    } else {
      admin.initializeApp({ projectId: "pottersdesign-f0ab8" });
    }
  }
  return admin.firestore();
}

const FieldValue = admin.firestore.FieldValue;
const resend = new Resend(RESEND_API_KEY);

// ── Helpers ────────────────────────────────────────────────────────────────
function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PD-${ts}-${rand}`;
}

function formatNGN(amount) {
  return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
}

function sha256(val) {
  return createHash("sha256").update(String(val || "").trim().toLowerCase()).digest("hex");
}

// ── Server-Side Meta Conversions API (CAPI) ────────────────────────────────
async function sendMetaConversionApiPurchase(order) {
  if (!META_CAPI_TOKEN || !META_PIXEL_ID) return;

  try {
    const payload = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: order.id,
          action_source: "website",
          event_source_url: "https://pottersdesign.com/order-confirmation",
          user_data: {
            em: [sha256(order.customer?.email)],
            ph: [sha256(order.customer?.phone?.replace(/[^0-9]/g, ""))],
            fn: [sha256(order.customer?.firstName)],
            ln: [sha256(order.customer?.lastName)],
          },
          custom_data: {
            currency: "NGN",
            value: order.total,
            content_type: "product",
            content_ids: (order.items || []).map((i) => String(i.productId)),
            num_items: (order.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0),
            order_id: order.id,
          },
        },
      ],
    };

    const res = await fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("[Meta CAPI] Server event error:", errText);
    } else {
      console.log(`[Meta CAPI] Server purchase event successfully sent for #${order.id}`);
    }
  } catch (err) {
    console.warn("[Meta CAPI] Network error sending conversion event:", err);
  }
}

// ── Email Notification System ──────────────────────────────────────────────
async function sendOrderEmails(order) {
  const customerName = `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim() || "Valued Customer";
  const isBank = order.paymentMethod === "bank";
  const adminDashboardUrl = process.env.ADMIN_URL || "https://pottersdesign.com/admin";
  const orderDateStr = new Date().toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const customerSubject = isBank
    ? `Order Confirmation — #${order.id} | The Potter's Design`
    : `Payment & Order Receipt — #${order.id} | The Potter's Design`;

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
          <p style="margin:0;font-size:14px;font-weight:600;color:#111">${order.shippingAddress.address || ""}</p>
          <p style="margin:3px 0 0;font-size:13px;color:#555">${order.shippingAddress.city || ""}, ${order.shippingAddress.state || ""}, ${order.shippingAddress.countryCode || "NG"} ${order.shippingAddress.zip ? `· ${order.shippingAddress.zip}` : ""}</p>
        </div>`
      : "";

  const itemsHtml = (order.items || [])
    .map((line) => {
      const options = [
        line.size && `Size: ${line.size}`,
        line.color && `Color: ${line.color}`,
        line.length && `Length: ${line.length}`,
      ]
        .filter(Boolean)
        .join(" · ");

      return `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee;vertical-align:top">
          <div style="font-size:14px;font-weight:600;color:#111">${line.name}</div>
          ${options ? `<div style="font-size:12px;color:#666;margin-top:2px">${options}</div>` : ""}
          <div style="font-size:12px;color:#888;margin-top:2px">Qty: ${line.quantity} × ${formatNGN(line.unitPrice)}</div>
          ${
            line.expressProduction
              ? `<div style="color:#b45309;font-weight:600;font-size:12px;margin-top:4px">⚡ 3-Day Express Production (+${formatNGN(20000 * line.quantity)})</div>`
              : ""
          }
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;font-family:monospace;font-size:14px;font-weight:600;vertical-align:top;color:#111">
          ${formatNGN(line.unitPrice * line.quantity)}
        </td>
      </tr>`;
    })
    .join("");

  const customerHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;color:#111">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;border:1px solid #e0e0e0;box-shadow:0 4px 12px rgba(0,0,0,0.04)">
      <tr><td style="background:#16130f;padding:32px 40px;text-align:center">
        <p style="margin:0;color:#c8852b;font-size:22px;font-weight:700;letter-spacing:0.06em">POTTER'S DESIGN</p>
        <p style="margin:6px 0 0;color:#fff;font-size:13px;opacity:0.75">Heritage. Reimagined.</p>
      </td></tr>
      <tr><td style="padding:36px 40px">
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#16130f">${isBank ? "Order Received" : "Payment Confirmed"} 🎉</h1>
        <p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.6">
          Hi ${customerName}, ${
            isBank
              ? "thank you for choosing Potter's Design. Your order details have been recorded in our system. Please complete your bank transfer to begin production."
              : "thank you for your payment! Your transaction was confirmed and we are beginning to craft your order."
          }
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fbf9f6;border:1px solid #ebdcc6;border-radius:10px;padding:16px 20px;margin:0 0 24px">
          <tr>
            <td style="padding:4px 0">
              <span style="font-size:11px;color:#8c7853;text-transform:uppercase;font-weight:700;letter-spacing:0.06em">Order Reference</span><br>
              <strong style="font-size:18px;font-family:monospace;color:#16130f">${order.id}</strong>
            </td>
            <td style="padding:4px 0;text-align:right">
              <span style="font-size:11px;color:#8c7853;text-transform:uppercase;font-weight:700;letter-spacing:0.06em">Status</span><br>
              <span style="display:inline-block;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:700;${
                isBank ? "background:#fef3c7;color:#92400e" : "background:#d1fae5;color:#065f46"
              }">
                ${isBank ? "Awaiting Transfer" : "Paid & Confirmed"}
              </span>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:10px;border-top:1px solid #eee;font-size:12px;color:#666">
              Date: <strong>${orderDateStr}</strong> &nbsp;·&nbsp; Payment Method: <strong>${
                isBank ? "Direct Bank Transfer" : "Paystack Online Payment"
              }</strong>
            </td>
          </tr>
        </table>

        <h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:#c8852b">Customer & Delivery Information</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;background:#f9f9f9;border-radius:8px;padding:14px 16px;font-size:13px">
          <tr><td style="padding:3px 0;color:#666">Customer:</td><td style="padding:3px 0;font-weight:600;text-align:right">${customerName}</td></tr>
          <tr><td style="padding:3px 0;color:#666">Email:</td><td style="padding:3px 0;font-weight:600;text-align:right">${order.customer?.email}</td></tr>
          <tr><td style="padding:3px 0;color:#666">Phone:</td><td style="padding:3px 0;font-weight:600;font-family:monospace;text-align:right">${order.customer?.phone}</td></tr>
        </table>

        ${fulfillmentDetailsHtml}

        <h3 style="margin:20px 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:#c8852b">Ordered Items (${(order.items || []).length})</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
          <thead>
            <tr>
              <th align="left" style="font-size:11px;text-transform:uppercase;color:#888;padding-bottom:8px;border-bottom:1px solid #ddd">Item</th>
              <th align="right" style="font-size:11px;text-transform:uppercase;color:#888;padding-bottom:8px;border-bottom:1px solid #ddd">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#fbf9f6;border-radius:8px;padding:16px">
          <tr><td style="padding:5px 0;color:#555;font-size:14px">Subtotal</td><td style="padding:5px 0;text-align:right;font-family:monospace;font-size:14px">${formatNGN(order.subtotal)}</td></tr>
          <tr><td style="padding:5px 0;color:#555;font-size:14px">Shipping Fee</td><td style="padding:5px 0;text-align:right;font-family:monospace;font-size:14px">${order.shippingFee === 0 ? "Free (Pickup)" : formatNGN(order.shippingFee)}</td></tr>
          ${
            order.expressProduction
              ? `<tr><td style="padding:5px 0;color:#b45309;font-weight:600;font-size:14px">⚡ Express Production (3 Days)</td><td style="padding:5px 0;text-align:right;font-family:monospace;font-weight:600;font-size:14px;color:#b45309">+${formatNGN(order.expressProductionFee ?? 20000)}</td></tr>`
              : ""
          }
          <tr style="border-top:1.5px solid #16130f"><td style="padding:10px 0 0;font-weight:700;font-size:16px;color:#16130f">Total</td><td style="padding:10px 0 0;text-align:right;font-family:monospace;font-weight:700;font-size:17px;color:#c8852b">${formatNGN(order.total)}</td></tr>
        </table>

        ${
          order.orderNote
            ? `<div style="background:#f4f4f4;border-left:3px solid #c8852b;padding:12px 16px;margin:0 0 24px;font-size:13px;color:#333">
                <strong>Order Notes:</strong> "${order.orderNote}"
              </div>`
            : ""
        }

        ${
          isBank
            ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:20px;margin:0 0 24px">
                <p style="margin:0 0 8px;font-weight:700;font-size:15px;color:#92400e">Bank Transfer Details</p>
                <p style="margin:0 0 14px;font-size:13px;color:#78350f;line-height:1.6">
                  Please transfer <strong>${formatNGN(order.total)}</strong> to any of the accounts below, and include your Order Reference <strong>${order.id}</strong> in your transfer description.
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;background:#fff;border-radius:6px;padding:12px;border:1px solid #fef3c7;font-size:13px">
                  <tr><td style="padding:4px 0;color:#78350f"><strong>Wema Bank:</strong></td><td style="padding:4px 0;font-family:monospace;font-weight:700;color:#92400e;text-align:right">0127024387</td></tr>
                  <tr><td style="padding:4px 0;color:#78350f">Account Name:</td><td style="padding:4px 0;color:#78350f;text-align:right">The Potter's Design Ltd</td></tr>
                  <tr><td colspan="2" style="border-top:1px dashed #fde68a;padding-top:6px;margin-top:6px"></td></tr>
                  <tr><td style="padding:4px 0;color:#78350f"><strong>First Bank:</strong></td><td style="padding:4px 0;font-family:monospace;font-weight:700;color:#92400e;text-align:right">2046299408</td></tr>
                  <tr><td style="padding:4px 0;color:#78350f">Account Name:</td><td style="padding:4px 0;color:#78350f;text-align:right">The Potters Design Limited</td></tr>
                </table>
                <p style="margin:0;font-size:13px;color:#78350f">
                  After payment, send your proof of payment on WhatsApp:
                  <a href="https://wa.me/2347017377822?text=Hello%2C%20I%20just%20placed%20order%20${order.id}%20on%20Potters%20Design.%20Here%20is%20my%20payment%20receipt." style="color:#059669;font-weight:700;text-decoration:underline">+234 701 737 7822</a>
                </p>
              </div>`
            : ""
        }

        <p style="margin:0;font-size:13px;color:#666;line-height:1.7">
          Have questions or need assistance? Reply to this email or chat with us on WhatsApp at
          <a href="https://wa.me/2347017377822" style="color:#c8852b;font-weight:600">+234 701 737 7822</a>.
        </p>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #eee">
        <p style="margin:0;font-size:12px;color:#999">
          © ${new Date().getFullYear()} The Potter's Design Limited · No 4, Akinsanmi Street, Obanikoro Estate, Mainland Lagos, Nigeria
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const adminHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;color:#111">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:14px;overflow:hidden;max-width:600px;width:100%;border:1px solid #e5e5e5;box-shadow:0 4px 12px rgba(0,0,0,0.05)">
      <tr><td style="background:#16130f;padding:28px 32px;text-align:center">
        <p style="margin:0;color:#c8852b;font-size:20px;font-weight:700;letter-spacing:0.06em">POTTER'S DESIGN ADMIN</p>
        <p style="margin:6px 0 0;color:#fff;font-size:12px;opacity:0.8">New Customer Order Alert</p>
      </td></tr>
      <tr><td style="padding:32px">
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;margin:0 0 24px;text-align:center">
          <p style="margin:0;font-size:18px;font-weight:700;color:#b45309">🚨 New Customer Order Received!</p>
          <p style="margin:4px 0 0;font-size:13px;color:#78350f">Order Ref: <strong>#${order.id}</strong> · <strong>${formatNGN(order.total)}</strong></p>
        </div>

        <h3 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;color:#c8852b">Customer Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#f9f9f9;border-radius:8px;padding:14px">
          <tr><td style="padding:4px 0;font-size:13px;color:#555">Customer Name:</td><td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right">${customerName}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#555">Customer Email:</td><td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right"><a href="mailto:${order.customer?.email}" style="color:#c8852b">${order.customer?.email}</a></td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#555">Customer Phone:</td><td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right;font-family:monospace">${order.customer?.phone}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#555">Payment Method:</td><td style="padding:4px 0;font-size:13px;font-weight:700;text-align:right;text-transform:uppercase">${order.paymentMethod} (${isBank ? "Pending Bank Transfer" : "Paid via Paystack"})</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#555">Fulfillment:</td><td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right">${order.fulfillment === "pickup" ? "Store Pickup" : "Nationwide / International Delivery"}</td></tr>
        </table>

        ${fulfillmentDetailsHtml}

        <h3 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;color:#c8852b">Items Ordered (${(order.items || []).length})</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
          ${itemsHtml}
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#f9f9f9;border-radius:8px;padding:14px">
          <tr><td style="padding:4px 0;color:#555;font-size:13px">Subtotal</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-size:13px">${formatNGN(order.subtotal)}</td></tr>
          <tr><td style="padding:4px 0;color:#555;font-size:13px">Shipping Fee</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-size:13px">${order.shippingFee === 0 ? "Free (pickup)" : formatNGN(order.shippingFee)}</td></tr>
          ${order.expressProduction ? `<tr><td style="padding:4px 0;color:#b45309;font-weight:700;font-size:13px">⚡ Express Production (3 Days)</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-weight:700;font-size:13px;color:#b45309">+${formatNGN(order.expressProductionFee ?? 20000)}</td></tr>` : ""}
          <tr style="border-top:1.5px solid #ddd"><td style="padding:8px 0 0;font-weight:700;font-size:16px;color:#111">Total Order Value</td><td style="padding:8px 0 0;text-align:right;font-family:monospace;font-weight:700;font-size:18px;color:#c8852b">${formatNGN(order.total)}</td></tr>
        </table>

        ${order.orderNote ? `
          <div style="background:#f4f4f4;border-left:3px solid #c8852b;padding:12px 16px;margin:0 0 24px;font-size:13px;color:#333">
            <strong>Customer Note:</strong> "${order.orderNote}"
          </div>
        ` : ""}

        <div style="text-align:center;margin:32px 0 10px">
          <a href="${adminDashboardUrl}" target="_blank" style="background:#16130f;color:#c8852b;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;border:1px solid #c8852b">
            VIEW ORDER IN ADMIN DASHBOARD →
          </a>
        </div>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
        <p style="margin:0;font-size:12px;color:#999">The Potter's Design Limited · Admin Notification</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const customerPromise = resend.emails
    .send({
      from: EMAIL_FROM,
      to: order.customer?.email,
      subject: customerSubject,
      html: customerHtml,
    })
    .catch(async (err) => {
      console.warn("Customer email primary dispatch failed, falling back to registered account:", err);
      return resend.emails.send({
        from: EMAIL_FROM,
        to: "lammiejay02@gmail.com",
        subject: `[CUSTOMER COPY to ${order.customer?.email}] ${customerSubject}`,
        html: customerHtml,
      }).catch(() => null);
    });

  const adminPromise = resend.emails
    .send({
      from: EMAIL_FROM,
      to: STORE_EMAIL,
      subject: `🚨 NEW ORDER RECEIVED! — #${order.id} — ${formatNGN(order.total)} (${customerName})`,
      html: adminHtml,
    })
    .catch(async (err) => {
      console.warn("Admin store email primary dispatch failed, falling back to registered account:", err);
      return resend.emails.send({
        from: EMAIL_FROM,
        to: "lammiejay02@gmail.com",
        subject: `[ADMIN FORWARD to ${STORE_EMAIL}] 🚨 NEW ORDER RECEIVED! — #${order.id} — ${formatNGN(order.total)} (${customerName})`,
        html: adminHtml,
      }).catch(() => null);
    });

  const capiPromise = sendMetaConversionApiPurchase(order).catch((err) => {
    console.warn("[Meta CAPI] Dispatch error:", err);
  });

  await Promise.allSettled([customerPromise, adminPromise, capiPromise]);
}

// ── Express Server Setup ───────────────────────────────────────────────────
const app = express();

// Enable CORS for all incoming origins
app.use(cors({ origin: true, credentials: true }));

// Parse raw buffer for Paystack HMAC verification, plus JSON
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// ── 1. Health Check Endpoint ───────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Potter's Design Backend API",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ── 2. Create Bank Order ───────────────────────────────────────────────────
app.post("/api/create-bank-order", async (req, res) => {
  try {
    const { orderData, orderId: clientOrderId } = req.body || {};
    if (!orderData) {
      return res.status(400).json({ error: "Missing order data" });
    }

    const orderId = clientOrderId || generateOrderId();
    const docRef = getDb().collection("orders").doc(orderId);
    const existingSnap = await docRef.get();

    if (!existingSnap.exists) {
      await docRef.set({
        ...orderData,
        id: orderId,
        reference: `bank-${orderId}`,
        status: "pending",
        createdAt: FieldValue.serverTimestamp(),
        paidAt: null,
      });
    }

    // Trigger emails & Meta CAPI in background
    sendOrderEmails({ ...orderData, id: orderId }).catch((err) => {
      console.error("[Email] Background dispatch failed:", err);
    });

    return res.status(200).json({ success: true, orderId });
  } catch (err) {
    console.error("[API] create-bank-order error:", err);
    return res.status(500).json({ error: "Internal server error saving bank order" });
  }
});

// ── 3. Verify Payment (Paystack) ───────────────────────────────────────────
app.post("/api/verify-payment", async (req, res) => {
  try {
    const { reference, orderData, orderId: clientOrderId } = req.body || {};
    if (!reference || !orderData) {
      return res.status(400).json({ error: "Missing reference or order data" });
    }

    // Verify transaction with Paystack API
    let paystackData;
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
      );
      const json = await response.json();
      paystackData = json.data;
    } catch {
      return res.status(502).json({ error: "Could not reach Paystack — please contact support" });
    }

    if (!paystackData || paystackData.status !== "success") {
      return res.status(402).json({ error: "Payment was not successful" });
    }

    // Guard: amount in kobo check (allow ±₦1 rounding)
    const expectedKobo = Math.round(orderData.total * 100);
    const paidKobo = paystackData.amount;
    if (Math.abs(paidKobo - expectedKobo) > 100) {
      return res.status(402).json({ error: "Paid amount does not match order total" });
    }

    const orderId = clientOrderId || generateOrderId();
    const docRef = getDb().collection("orders").doc(orderId);
    const existingSnap = await docRef.get();

    if (existingSnap.exists) {
      await docRef.update({
        status: "paid",
        reference,
        paystackChannel: paystackData.channel || "card",
        paidAt: FieldValue.serverTimestamp(),
      });
    } else {
      await docRef.set({
        ...orderData,
        id: orderId,
        reference,
        status: "paid",
        paystackChannel: paystackData.channel || "card",
        createdAt: FieldValue.serverTimestamp(),
        paidAt: FieldValue.serverTimestamp(),
      });
    }

    // Dispatch receipt emails & Meta telemetry
    sendOrderEmails({ ...orderData, id: orderId }).catch((err) => {
      console.error("[Email] Payment email dispatch failed:", err);
    });

    return res.status(200).json({ success: true, orderId });
  } catch (err) {
    console.error("[API] verify-payment error:", err);
    return res.status(500).json({ error: "Internal server error verifying payment" });
  }
});

// ── 4. Paystack Webhook Handler ────────────────────────────────────────────
app.post("/api/paystack-webhook", async (req, res) => {
  try {
    const rawBody = req.rawBody ? req.rawBody.toString("utf8") : JSON.stringify(req.body);
    const sig = req.headers["x-paystack-signature"];
    const hash = createHmac("sha512", PAYSTACK_SECRET).update(rawBody).digest("hex");

    if (!sig || hash !== sig) {
      return res.status(401).send("Unauthorized signature");
    }

    const body = req.body;
    if (body?.event === "charge.success") {
      const data = body.data;
      const db = getDb();
      let docRef = null;
      let orderDocData = null;

      const snap = await db.collection("orders").where("reference", "==", data.reference).limit(1).get();
      if (!snap.empty) {
        docRef = snap.docs[0].ref;
        orderDocData = snap.docs[0].data();
      } else {
        const byId = await db.collection("orders").doc(data.reference).get();
        if (byId.exists) {
          docRef = byId.ref;
          orderDocData = byId.data();
        }
      }

      if (docRef && orderDocData) {
        await docRef.update({
          status: "paid",
          paidAt: FieldValue.serverTimestamp(),
          paystackChannel: data.channel || "card",
        });
        sendOrderEmails({ ...orderDocData, id: docRef.id, paymentMethod: "paystack" }).catch((err) => {
          console.error("[Webhook Email] Failed:", err);
        });
      } else if (data.metadata?.orderData) {
        const orderData = data.metadata.orderData;
        const orderId = data.reference;
        await db.collection("orders").doc(orderId).set({
          ...orderData,
          id: orderId,
          reference: orderId,
          status: "paid",
          paystackChannel: data.channel || "card",
          createdAt: FieldValue.serverTimestamp(),
          paidAt: FieldValue.serverTimestamp(),
        });
        sendOrderEmails({ ...orderData, id: orderId, paymentMethod: "paystack" }).catch((err) => {
          console.error("[Webhook Email] Fallback failed:", err);
        });
      }
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("[Webhook] Processing error:", err);
    return res.status(500).send("Error processing webhook");
  }
});

// ── 5. Send Admin Alert Endpoint ───────────────────────────────────────────
app.post("/api/send-admin-alert", async (req, res) => {
  try {
    const { orderData } = req.body || {};
    if (!orderData || !orderData.id) {
      return res.status(400).json({ error: "Missing order data or ID" });
    }

    await sendOrderEmails(orderData);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[API] send-admin-alert error:", err);
    return res.status(500).json({ error: "Failed to dispatch alert" });
  }
});

// ── 6. Static Frontend Serving (Optional All-in-One Hostinger Setup) ───────
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// Fallback to index.html for Single-Page Application (SPA) client-side routes
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      res.status(200).send("The Potter's Design API Server is active.");
    }
  });
});

// ── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Potter's Design Server] Live and listening on port ${PORT}`);
  console.log(`[Potter's Design Server] Health check available at: http://localhost:${PORT}/api/health`);
});
