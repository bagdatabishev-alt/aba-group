import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email/resend";
import { createServiceClient } from "@/lib/supabase/serviceClient";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, country, city, address, notes, items, total, deliveryFee, userId } = body;
  if (!name || !phone || !city || !address || !items?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const orderNumber = Math.floor(1000 + Math.random() * 9000);
  const fee = Number(deliveryFee) || 0;

  const service = createServiceClient();
  if (service) {
    try {
      await service.from("orders").insert({
        order_number: orderNumber,
        customer_name: name,
        phone,
        email,
        country,
        city,
        address,
        notes,
        items,
        total,
        delivery_fee: fee,
        status: "new",
        payment_status: "unpaid",
        user_id: userId || null,
      });
      await service.rpc("decrement_product_stock", {
        items: items.map((it: { id: number; qty: number }) => ({ id: it.id, qty: it.qty })),
      });
    } catch (err) {
      console.error("Order insert failed:", err);
    }
  } else if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      await supabase.from("orders").insert({
        order_number: orderNumber,
        customer_name: name,
        phone,
        email,
        country,
        city,
        address,
        notes,
        items,
        total,
        delivery_fee: fee,
        status: "new",
        payment_status: "unpaid",
        user_id: userId || null,
      });
    } catch (err) {
      console.error("Supabase insert failed:", err);
    }
  } else {
    console.log("[order] Supabase not configured, received:", { orderNumber, name, phone, city, items, total });
  }

  if (email) {
    sendOrderConfirmationEmail({ orderNumber, customerName: name, customerEmail: email, items, total, deliveryFee: fee, city, address }).catch((e) => console.error("Email error:", e));
  }

  return NextResponse.json({ ok: true, orderNumber });
}
