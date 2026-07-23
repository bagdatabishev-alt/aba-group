export interface InvoiceData {
  orderNumber: number;
  customerName: string;
  phone: string;
  email?: string | null;
  city: string;
  address: string;
  items: { name: string; price: number; qty: number }[];
  total: number;
  deliveryFee: number;
  createdAt: string;
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₸";
}

export function buildInvoiceHtml(order: InvoiceData): string {
  const subtotal = order.items.reduce((s, it) => s + it.price * it.qty, 0);
  const rows = order.items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #E4E9E6;">${it.name}</td>
        <td style="padding:8px; border-bottom:1px solid #E4E9E6; text-align:center;">${it.qty}</td>
        <td style="padding:8px; border-bottom:1px solid #E4E9E6; text-align:right;">${fmt(it.price)}</td>
        <td style="padding:8px; border-bottom:1px solid #E4E9E6; text-align:right;">${fmt(it.price * it.qty)}</td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="kk">
<head>
<meta charset="UTF-8">
<title>Есеп-шот №${order.orderNumber}</title>
<style>
  body { font-family: Arial, sans-serif; color: #0E1B16; max-width: 700px; margin: 40px auto; padding: 0 20px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0B3D2E; padding-bottom: 20px; margin-bottom: 24px; }
  .logo { font-size: 22px; font-weight: 800; color: #0B3D2E; }
  .invoice-title { text-align: right; }
  .invoice-title h1 { margin: 0; font-size: 20px; color: #0B3D2E; }
  .invoice-title p { margin: 4px 0 0; color: #5B6B65; font-size: 13px; }
  .info-grid { display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 13px; }
  .info-grid b { display: block; color: #5B6B65; font-size: 11px; text-transform: uppercase; margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th { background: #F4F6F5; padding: 8px; text-align: left; font-size: 12px; text-transform: uppercase; color: #5B6B65; }
  th:nth-child(2) { text-align: center; }
  th:nth-child(3), th:nth-child(4) { text-align: right; }
  .totals { margin-left: auto; width: 260px; font-size: 14px; }
  .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
  .totals .grand { font-weight: bold; font-size: 16px; border-top: 2px solid #0B3D2E; margin-top: 6px; padding-top: 8px; color: #0B3D2E; }
  .footer { margin-top: 40px; font-size: 12px; color: #5B6B65; text-align: center; }
  @media print { body { margin: 10px auto; } }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">🌐 ABA Group</div>
    <div class="invoice-title">
      <h1>Есеп-шот / Invoice</h1>
      <p>№ ${order.orderNumber} · ${new Date(order.createdAt).toLocaleDateString("ru-RU")}</p>
    </div>
  </div>

  <div class="info-grid">
    <div>
      <b>Клиент</b>
      ${order.customerName}<br>
      ${order.phone}<br>
      ${order.email || ""}
    </div>
    <div>
      <b>Жеткізу мекенжайы</b>
      ${order.city}<br>
      ${order.address}
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Тауар</th><th>Саны</th><th>Бағасы</th><th>Сомасы</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <div><span>Тауарлар сомасы</span><span>${fmt(subtotal)}</span></div>
    <div><span>Жеткізу</span><span>${fmt(order.deliveryFee)}</span></div>
    <div class="grand"><span>Жалпы сома</span><span>${fmt(order.total)}</span></div>
  </div>

  <div class="footer">
    ABA Group — Халықаралық бизнес платформасы · info@abagroup.kz
  </div>
</body>
</html>`;
}

export function printInvoice(order: InvoiceData) {
  const html = buildInvoiceHtml(order);
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.onload = () => win.print();
}
