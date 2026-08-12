"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n/LanguageContext";
import { printInvoice } from "@/lib/invoice/generateInvoice";

interface TrackedOrder {
  order_number: number;
  customer_name: string;
  city: string;
  address: string;
  items: { id: number; name: string; price: number; qty: number }[];
  total: number;
  delivery_fee: number;
  status: string;
  payment_status: string;
  created_at: string;
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₸";
}

export default function TrackOrderPage() {
  const { t } = useLang();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  const STEPS = [
    { value: "new", label: t("step_new"), icon: "📝" },
    { value: "confirmed", label: t("step_confirmed"), icon: "✅" },
    { value: "shipped", label: t("step_shipped"), icon: "🚚" },
    { value: "delivered", label: t("step_delivered"), icon: "📦" },
  ];

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_order_for_tracking", {
      p_order_number: Number(orderNumber),
      p_phone: phone,
    });
    setLoading(false);
    if (error || !data || data.length === 0) {
      setNotFound(true);
      return;
    }
    setOrder(data[0]);
  }

  const currentStepIndex = order
    ? order.status === "cancelled"
      ? -1
      : STEPS.findIndex((s) => s.value === order.status)
    : -1;

  return (
    <section className="py-16 px-5 max-w-2xl mx-auto">
      <div className="text-center mb-9">
        <div className="text-xs font-extrabold uppercase tracking-wide text-blue mb-3">{t("track_eyebrow")}</div>
        <h2 className="font-display text-3xl font-extrabold text-deep-green tracking-tight">{t("track_title")}</h2>
        <p className="text-ink-soft mt-2 text-sm">{t("track_hint")}</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white border border-line rounded-2xl p-6 shadow-sm grid gap-3.5 mb-8">
        <div className="grid grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-ink-soft">{t("track_order_num")}</label>
            <input
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="5437"
              className="px-3.5 py-3 rounded-xl border border-line text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-ink-soft">{t("track_phone")}</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 700 000 00 00"
              className="px-3.5 py-3 rounded-xl border border-line text-sm"
            />
          </div>
        </div>
        <button disabled={loading} type="submit" className="bg-deep-green text-white rounded-full py-3 font-bold disabled:opacity-50">
          {loading ? t("track_checking") : t("track_check")}
        </button>
      </form>

      {notFound && (
        <div className="text-center py-8 text-ink-soft bg-bg-gray rounded-2xl">
          <div className="text-3xl mb-2">🔍</div>
          <p>{t("track_not_found")}</p>
        </div>
      )}

      {order && (
        <div className="bg-white border border-line rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="font-extrabold text-lg">#{order.order_number}</div>
              <div className="text-xs text-ink-soft">{new Date(order.created_at).toLocaleString("ru-RU")}</div>
            </div>
            <div className="font-extrabold text-deep-green text-lg">{fmt(Number(order.total))}</div>
          </div>

          {order.status === "cancelled" ? (
            <div className="bg-coral/10 text-coral rounded-xl p-4 text-center font-bold mb-6">{t("track_cancelled")}</div>
          ) : (
            <div className="flex justify-between items-center mb-8 relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-line" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-deep-green transition-all"
                style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
              />
              {STEPS.map((s, i) => (
                <div key={s.value} className="relative flex flex-col items-center gap-1.5 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      i <= currentStepIndex ? "bg-deep-green text-white" : "bg-bg-gray text-ink-soft"
                    }`}
                  >
                    {s.icon}
                  </div>
                  <span className="text-[10px] font-bold text-ink-soft text-center max-w-[60px]">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="bg-bg-gray rounded-xl p-4 mb-4">
            {order.items?.map((it, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span>{it.name} × {it.qty}</span>
                <span>{fmt(it.price * it.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm py-1 text-ink-soft">
              <span>{t("delivery_label")}</span>
              <span>{fmt(Number(order.delivery_fee || 0))}</span>
            </div>
          </div>

          <div className="text-sm text-ink-soft mb-4">
            <b className="text-ink block mb-0.5">{t("track_address_label")}</b>
            {order.city}, {order.address}
          </div>

          <button
            onClick={() =>
              printInvoice({
                orderNumber: order.order_number,
                customerName: order.customer_name,
                phone: phone,
                city: order.city,
                address: order.address,
                items: order.items,
                total: Number(order.total),
                deliveryFee: Number(order.delivery_fee || 0),
                createdAt: order.created_at,
              })
            }
            className="w-full border border-deep-green text-deep-green rounded-full py-3 font-bold text-sm"
          >
            {t("invoice_btn")}
          </button>
        </div>
      )}
    </section>
  );
}
