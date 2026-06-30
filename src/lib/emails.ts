import { Resend } from "resend";

function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY ?? "");
}
const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

type OrderItem = {
  name: string;
  size: string;
  quantity: number;
  price: number;
};

type ShippingInfo = {
  fullName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

function itemsHtml(items: OrderItem[]): string {
  return items
    .map(
      (item) =>
        `<tr>
      <td style="padding:8px 0;color:#ECE6D8;font-size:13px;">${item.name} (${item.size}) &times; ${item.quantity}</td>
      <td style="padding:8px 0;color:#A39C8C;font-size:13px;text-align:right;">$${(item.price * item.quantity).toLocaleString()}</td>
    </tr>`
    )
    .join("");
}

export async function sendOrderConfirmation({
  orderNumber,
  customerName,
  items,
  shipping,
  total,
}: {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  shipping: ShippingInfo;
  total: number;
}) {
  const firstName = customerName.split(" ")[0];
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0E1410;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <p style="color:#B8A887;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 24px;">Luxe Atelier</p>
    <h1 style="color:#ECE6D8;font-size:28px;font-weight:600;margin:0 0 8px;">Thank you, ${firstName}.</h1>
    <p style="color:#A39C8C;font-size:13px;margin:0 0 32px;">Order <span style="color:#ECE6D8;">${orderNumber}</span> has been placed.</p>
    <table style="width:100%;border-top:1px solid rgba(184,168,135,0.2);padding-top:24px;" cellpadding="0" cellspacing="0">
      ${itemsHtml(items)}
      <tr>
        <td style="padding:16px 0 0;border-top:1px solid rgba(184,168,135,0.2);color:#ECE6D8;font-size:14px;font-weight:600;">Total</td>
        <td style="padding:16px 0 0;border-top:1px solid rgba(184,168,135,0.2);color:#D4C28F;font-size:14px;font-weight:600;text-align:right;">$${total.toLocaleString()}</td>
      </tr>
    </table>
    <div style="margin-top:32px;padding:20px;border:1px solid rgba(184,168,135,0.2);">
      <p style="color:#B8A887;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 12px;">Shipping to</p>
      <p style="color:#A39C8C;font-size:13px;line-height:1.6;margin:0;">
        ${shipping.fullName}<br/>
        ${shipping.addressLine1}${shipping.addressLine2 ? "<br/>" + shipping.addressLine2 : ""}<br/>
        ${shipping.city}, ${shipping.state} ${shipping.postalCode}<br/>
        ${shipping.country}
      </p>
    </div>
    <p style="color:#A39C8C;font-size:12px;margin-top:40px;">Questions? Write to studio@luxeatelier.com</p>
  </div>
</body>
</html>`;

  await getResend().emails.send({
    from: FROM,
    to: shipping.email,
    subject: `Your Luxe Atelier order — ${orderNumber}`,
    html,
  });
}

export async function sendNewOrderAdmin({
  orderNumber,
  customerName,
  customerEmail,
  items,
  total,
  orderId,
}: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  orderId: string;
}) {
  if (!ADMIN_EMAIL) return;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0E1410;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <p style="color:#B8A887;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 24px;">Luxe Atelier Admin</p>
    <h1 style="color:#ECE6D8;font-size:24px;font-weight:600;margin:0 0 8px;">New order — ${orderNumber}</h1>
    <p style="color:#A39C8C;font-size:13px;margin:0 0 24px;">${customerName} (${customerEmail})</p>
    <table style="width:100%;border-top:1px solid rgba(184,168,135,0.2);padding-top:16px;" cellpadding="0" cellspacing="0">
      ${itemsHtml(items)}
      <tr>
        <td style="padding:16px 0 0;border-top:1px solid rgba(184,168,135,0.2);color:#ECE6D8;font-size:13px;font-weight:600;">Total</td>
        <td style="padding:16px 0 0;border-top:1px solid rgba(184,168,135,0.2);color:#D4C28F;font-size:13px;font-weight:600;text-align:right;">$${total.toLocaleString()}</td>
      </tr>
    </table>
    <a href="${baseUrl}/admin/orders/${orderId}" style="display:inline-block;margin-top:32px;border:1px solid #B8A887;padding:10px 20px;color:#D4C28F;font-size:12px;letter-spacing:0.1em;text-decoration:none;">View order in admin &rarr;</a>
  </div>
</body>
</html>`;

  await getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New order — ${orderNumber}`,
    html,
  });
}

export async function sendBackInStock({
  email,
  productName,
  productSlug,
}: {
  email: string;
  productName: string;
  productSlug: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0E1410;font-family:Georgia,serif;">
  <div style="max-width:480px;margin:0 auto;padding:48px 24px;">
    <p style="color:#B8A887;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 24px;">Luxe Atelier</p>
    <h1 style="color:#ECE6D8;font-size:24px;font-weight:600;margin:0 0 8px;">Back in stock</h1>
    <p style="color:#A39C8C;font-size:13px;margin:0 0 24px;">${productName} is available again.</p>
    <a href="${baseUrl}/shop/${productSlug}" style="display:inline-block;border:1px solid #B8A887;padding:10px 20px;color:#D4C28F;font-size:12px;letter-spacing:0.1em;text-decoration:none;">Shop now &rarr;</a>
  </div>
</body>
</html>`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Back in stock — ${productName}`,
    html,
  });
}
