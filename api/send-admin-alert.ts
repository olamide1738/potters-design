import type { VercelRequest, VercelResponse } from "@vercel/node";
import { resend, EMAIL_FROM, STORE_EMAIL, formatNGN } from "./_lib.js";
import type { OrderPayload } from "./_lib.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { orderData } = req.body as { orderData: OrderPayload & { id: string } };
  if (!orderData || !orderData.id) {
    return res.status(400).json({ error: "Missing order data or ID" });
  }

  const order = orderData;
  const customerName = `${order.customer.firstName} ${order.customer.lastName}`;
  const isBank = order.paymentMethod === "bank";
  const adminDashboardUrl = process.env.ADMIN_URL ?? "https://pottersdesign.com/admin";

  const adminHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;color:#111">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:14px;overflow:hidden;max-width:600px;width:100%;border:1px solid #e5e5e5;box-shadow:0 4px 12px rgba(0,0,0,0.05)">
      <tr><td style="background:#111;padding:28px 32px;text-align:center">
        <p style="margin:0;color:#d4af37;font-size:20px;font-weight:700;letter-spacing:0.06em">POTTER'S DESIGN ADMIN</p>
        <p style="margin:6px 0 0;color:#fff;font-size:12px;opacity:0.8">New Customer Order Alert</p>
      </td></tr>
      <tr><td style="padding:32px">
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;margin:0 0 24px;text-align:center">
          <p style="margin:0;font-size:18px;font-weight:700;color:#b45309">🚨 Somebody just placed a new order!</p>
          <p style="margin:4px 0 0;font-size:13px;color:#78350f">Order Ref: <strong>#${order.id}</strong></p>
        </div>

        <h3 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;color:#d4af37">Customer Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#f9f9f9;border-radius:8px;padding:14px">
          <tr><td style="padding:4px 0;font-size:13px;color:#555">Customer Name:</td><td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right">${customerName}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#555">Customer Email:</td><td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right"><a href="mailto:${order.customer.email}" style="color:#d4af37">${order.customer.email}</a></td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#555">Customer Phone:</td><td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right;font-family:monospace">${order.customer.phone}</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#555">Payment Method:</td><td style="padding:4px 0;font-size:13px;font-weight:700;text-align:right;text-transform:uppercase">${order.paymentMethod} (${isBank ? "Pending Bank Transfer" : "Paid via Paystack"})</td></tr>
          <tr><td style="padding:4px 0;font-size:13px;color:#555">Fulfillment:</td><td style="padding:4px 0;font-size:13px;font-weight:600;text-align:right">${order.fulfillment === "pickup" ? "Store Pickup" : "Nationwide / International Delivery"}</td></tr>
        </table>

        <h3 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;color:#d4af37">Items Ordered (${order.items ? order.items.length : 0})</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
          ${(order.items || [])
            .map(
              (line) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;font-weight:600">
                ${line.name}
                <div style="font-size:12px;color:#666;font-weight:normal;margin-top:2px">
                  ${[line.size && `Size: ${line.size}`, line.color && `Color: ${line.color}`, line.length && `Length: ${line.length}`].filter(Boolean).join(" · ")}
                </div>
                ${line.expressProduction ? `<div style="color:#b45309;font-weight:600;font-size:12px;margin-top:2px">⚡ 3-Day Express Production (+${formatNGN(20000 * line.quantity)})</div>` : ""}
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-family:monospace;font-size:14px">
                ${line.quantity} × ${formatNGN(line.unitPrice)}<br>
                <strong>${formatNGN(line.unitPrice * line.quantity)}</strong>
              </td>
            </tr>
          `,
            )
            .join("")}
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#f9f9f9;border-radius:8px;padding:14px">
          <tr><td style="padding:4px 0;color:#555;font-size:13px">Subtotal</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-size:13px">${formatNGN(order.subtotal || 0)}</td></tr>
          <tr><td style="padding:4px 0;color:#555;font-size:13px">Shipping Fee</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-size:13px">${order.shippingFee === 0 ? "Free (pickup)" : formatNGN(order.shippingFee || 0)}</td></tr>
          ${order.expressProduction ? `<tr><td style="padding:4px 0;color:#b45309;font-weight:700;font-size:13px">⚡ Express Production (3 Days)</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-weight:700;font-size:13px;color:#b45309">+${formatNGN(order.expressProductionFee ?? 20000)}</td></tr>` : ""}
          <tr style="border-top:1.5px solid #ddd"><td style="padding:8px 0 0;font-weight:700;font-size:16px;color:#111">Total Order Value</td><td style="padding:8px 0 0;text-align:right;font-family:monospace;font-weight:700;font-size:18px;color:#d4af37">${formatNGN(order.total || 0)}</td></tr>
        </table>

        ${order.orderNote ? `
          <div style="background:#f4f4f4;border-left:3px solid #d4af37;padding:12px 16px;margin:0 0 24px;font-size:13px;color:#333">
            <strong>Customer Note:</strong> "${order.orderNote}"
          </div>
        ` : ""}

        <div style="text-align:center;margin:32px 0 10px">
          <a href="${adminDashboardUrl}" target="_blank" style="background:#111;color:#d4af37;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;border:1px solid #d4af37">
            CONFIRM ORDER IN ADMIN DASHBOARD →
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

  try {
    const dispatch = await resend.emails.send({
      from: EMAIL_FROM,
      to: STORE_EMAIL, // pottersdesigning@gmail.com
      subject: `🚨 NEW ORDER RECEIVED! — #${order.id} — ${formatNGN(order.total || 0)} (${customerName})`,
      html: adminHtml,
    });
    return res.status(200).json({ success: true, dispatch });
  } catch (err: unknown) {
    console.error("Admin alert endpoint error:", err);
    return res.status(500).json({ error: "Failed to dispatch admin email" });
  }
}
