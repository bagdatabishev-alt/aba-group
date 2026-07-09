import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, country, city, address, notes, items, total } = body;

  if (!name || !phone || !city || !address || !items?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const orderNumber = Math.floor(1000 + Math.random() * 9000);

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
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
        status: "new",
      });
    } catch (err) {
      console.error("Supabase insert failed:", err);
    }
  } else {
    console.log("[order] Supabase not configured, received:", { orderNumber, name, phone, city, items, total });
  }

  return NextResponse.json({ ok: true, orderNumber });
}
