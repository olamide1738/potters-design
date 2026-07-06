import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";

export function getDb() {
  if (!getApps().length) {
    const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!sa) throw new Error("FIREBASE_SERVICE_ACCOUNT is not configured");
    initializeApp({ credential: cert(JSON.parse(sa) as Parameters<typeof cert>[0]) });
  }
  return getFirestore();
}
export { FieldValue };
export const resend = new Resend(process.env.RESEND_API_KEY ?? "");
export const EMAIL_FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
export const STORE_EMAIL = process.env.STORE_EMAIL ?? "pottersdesignltd@gmail.com";

export interface CartLine {
  productId: number;
  slug: string;
  name: string;
  unitPrice: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface OrderPayload {
  customer: { firstName: string; lastName: string; email: string; phone: string };
  fulfillment: "delivery" | "pickup";
  shippingAddress?: { address: string; city: string; state: string; countryCode: string; zip: string };
  items: CartLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
  weightKg: number;
  orderNote: string;
  paymentMethod: "bank" | "paystack";
}

export function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `PD-${ts}-${rand}`;
}

export function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export async function sendOrderEmails(
  order: OrderPayload & { id: string },
): Promise<void> {
  const customerName = `${order.customer.firstName} ${order.customer.lastName}`;
  const isBank = order.paymentMethod === "bank";
  const subject = isBank
    ? `Order received — ${order.id} | Potter's Design`
    : `Payment confirmed — ${order.id} | Potter's Design`;

  const itemsHtml = order.items
    .map(
      (line) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee">${line.name}${line.size ? ` · ${line.size}` : ""}${line.color ? ` · ${line.color}` : ""}<span style="color:#666"> × ${line.quantity}</span></td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-family:monospace">${formatNGN(line.unitPrice * line.quantity)}</td>
        </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;color:#111">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px;width:100%">
      <tr><td style="background:#111;padding:32px 40px;text-align:center">
        <p style="margin:0;color:#d4af37;font-size:22px;font-weight:600;letter-spacing:0.04em">POTTER'S DESIGN</p>
        <p style="margin:8px 0 0;color:#fff;font-size:13px;opacity:0.7">Heritage. Reimagined.</p>
      </td></tr>
      <tr><td style="padding:40px">
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700">${isBank ? "Order received" : "Payment confirmed"} 🎉</h1>
        <p style="margin:0 0 24px;color:#555;font-size:15px">Hi ${customerName}, ${isBank ? "your order has been saved. Please complete your bank transfer to begin production." : "your payment was successful. We'll begin crafting your order right away."}</p>
        <div style="background:#f9f9f9;border-radius:8px;padding:16px 20px;margin:0 0 24px">
          <p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.1em">Order reference</p>
          <p style="margin:0;font-size:20px;font-weight:700;font-family:monospace;color:#111">${order.id}</p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px">${itemsHtml}</table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
          <tr><td style="padding:6px 0;color:#555;font-size:14px">Subtotal</td><td style="padding:6px 0;text-align:right;font-family:monospace;font-size:14px">${formatNGN(order.subtotal)}</td></tr>
          <tr><td style="padding:6px 0;color:#555;font-size:14px">Shipping</td><td style="padding:6px 0;text-align:right;font-family:monospace;font-size:14px">${order.shippingFee === 0 ? "Free (pickup)" : formatNGN(order.shippingFee)}</td></tr>
          <tr style="border-top:2px solid #111"><td style="padding:10px 0 0;font-weight:700;font-size:16px">Total</td><td style="padding:10px 0 0;text-align:right;font-family:monospace;font-weight:700;font-size:16px">${formatNGN(order.total)}</td></tr>
        </table>
        ${isBank ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:20px;margin:0 0 24px">
          <p style="margin:0 0 8px;font-weight:700;color:#92400e">Complete your transfer</p>
          <p style="margin:0 0 12px;font-size:14px;color:#78350f;line-height:1.6">Transfer <strong>${formatNGN(order.total)}</strong> to any account below, then send your receipt and order reference <strong>${order.id}</strong> via WhatsApp to <strong>+234 701 737 7822</strong>.</p>
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#78350f">NGN Accounts</p>
          <p style="margin:0 0 2px;font-size:13px;color:#78350f">The Potter's Design Ltd · Wema Bank · <strong>0127024387</strong></p>
          <p style="margin:0 0 12px;font-size:13px;color:#78350f">The Potters Design Limited · First Bank · <strong>2046299408</strong></p>
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#78350f">USD Account</p>
          <p style="margin:0;font-size:13px;color:#78350f">The Potter's Design Ltd · First Bank · <strong>2046300632</strong></p>
        </div>` : ""}
        <p style="margin:0;font-size:14px;color:#555;line-height:1.7">Questions? Chat with us on WhatsApp at <a href="https://wa.me/2347017377822" style="color:#d4af37;font-weight:600">+234 701 737 7822</a>.</p>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #eee">
        <p style="margin:0;font-size:12px;color:#999">© ${new Date().getFullYear()} The Potter's Design Limited · No 4, Akinsanmi Street, Obanikoro Estate, Mainland Lagos</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  await Promise.all([
    resend.emails.send({ from: EMAIL_FROM, to: order.customer.email, subject, html }),
    resend.emails.send({
      from: EMAIL_FROM,
      to: STORE_EMAIL,
      subject: `[NEW ORDER] ${order.id} — ${formatNGN(order.total)} — ${isBank ? "Bank transfer" : "Paystack"}`,
      html: `<p>New order from <strong>${customerName}</strong> (${order.customer.email})</p>
<p>Order ID: <strong>${order.id}</strong><br>Total: <strong>${formatNGN(order.total)}</strong><br>Payment: <strong>${isBank ? "Bank transfer (pending)" : "Paystack (paid)"}</strong><br>Fulfillment: <strong>${order.fulfillment}</strong></p>
<p>Items:<br>${order.items.map((l) => `${l.name} × ${l.quantity}${l.size ? ` (${l.size})` : ""}`).join("<br>")}</p>
${order.orderNote ? `<p>Customer note: <em>${order.orderNote}</em></p>` : ""}`,
    }),
  ]);
}
