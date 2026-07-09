import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, message } = body;

  if (!name || !phone || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // If Supabase is configured, persist the message. Otherwise, just accept it
  // so the site keeps working end-to-end before the database is connected.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      await supabase.from("contact_requests").insert({ name, phone, email, message });
    } catch (err) {
      console.error("Supabase insert failed:", err);
    }
  } else {
    console.log("[contact] Supabase not configured, received:", { name, phone, email, message });
  }

  return NextResponse.json({ ok: true });
}
