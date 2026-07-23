import { Resend } from "resend";

interface OrderEmailData {
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  items: { name: string; price: number; qty: number }[];
  total: number;
  deliveryFee: number;
  city: string;
  address: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !data.customerEmail) return;

  const resend = new Resend(apiKey);
  const itemsHtml = data.items
    .map((it) => `<tr><td style="padding:6px 0;">${it.name} × ${it.qty}</td><td style="text-align:right;">${(it.price * it.qty).toLocaleString("ru-RU")} ₸</td></tr>`)
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;">
      <h2 style="color:#0B3D2E;">ABA Group — Тапсырыс қабылданды</h2>
      <p>Құрметті ${data.customerName}, сіздің тапсырысыңыз қабылданды.</p>
      <p><b>Тапсырыс №:</b> ${data.orderNumber}</p>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        ${itemsHtml}
        <tr><td style="padding-top:8px;">Жеткізу</td><td style="text-align:right; padding-top:8px;">${data.deliveryFee.toLocaleString("ru-RU")} ₸</td></tr>
        <tr><td style="font-weight:bold; padding-top:8px; border-top:1px solid #ddd;">Жалпы сома</td><td style="text-align:right; font-weight:bold; padding-top:8px; border-top:1px solid #ddd;">${data.total.toLocaleString("ru-RU")} ₸</td></tr>
      </table>
      <p><b>Жеткізу мекенжайы:</b> ${data.city}, ${data.address}</p>
      <p style="color:#5B6B65; font-size:13px;">Жақын арада сізбен байланысамыз. Рахмет!</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "ABA Group <onboarding@resend.dev>",
      to: data.customerEmail,
      subject: `Тапсырыс №${data.orderNumber} қабылданды — ABA Group`,
      html,
    });
  } catch (err) {
    console.error("Email send failed:", err);
  }
}
