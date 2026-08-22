"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/cart/CartContext";
import { useProducts } from "@/lib/products/ProductsContext";
import { useSettings } from "@/lib/settings/SettingsContext";
import { calculateDeliveryFee } from "@/lib/supabase/settings";
import { printInvoice } from "@/lib/invoice/generateInvoice";
import { getCurrentCustomerSession, fetchMyProfile } from "@/lib/supabase/customerAuth";

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₸";
}

export default function CheckoutPage() {
  const { lang, t } = useLang();
  const { cart, clearCart } = useCart();
  const { products } = useProducts();
  const { settings } = useSettings();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastOrderData, setLastOrderData] = useState<{
    items: { id: number; name: string; price: number; qty: number }[];
    total: number;
    deliveryFee: number;
    city: string;
    address: string;
    createdAt: string;
  } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", country: "Қазақстан", city: "", address: "", notes: "" });

  useEffect(() => {
    (async () => {
      const session = await getCurrentCustomerSession();
      if (session) {
        setUserId(session.user.id);
        const profile = await fetchMyProfile();
        if (profile) {
          setForm((prev) => ({
            ...prev,
            name: profile.name || prev.name,
            phone: profile.phone || prev.phone,
            email: profile.email || prev.email,
          }));
        }
      }
    })();
  }, []);

  const ids = Object.keys(cart).map(Number);
  const subtotal = ids.reduce((sum, id) => {
    const p = products.find((x) => x.id === id);
    return sum + (p ? p.price * cart[id] : 0);
  }, 0);
  const deliveryFee = settings ? calculateDeliveryFee(settings, form.city, subtotal) : 0;
  const cartTotal = subtotal + deliveryFee;

  if (ids.length === 0 && orderNumber === null) {
    return (
      <div className="text-center py-24 px-5">
        <div className="text-4xl mb-3.5">🛒</div>
        <p className="text-ink-soft mb-5">{t("cart_empty")}</p>
        <button onClick={() => router.push("/shop")} className="bg-deep-green text-white rounded-full px-6 py-3 font-bold">
          {t("continue")}
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const items = ids.map((id) => {
      const p = products.find((x) => x.id === id)!;
      return { id, name: p.name[lang], price: p.price, qty: cart[id] };
    });
    const createdAt = new Date().toISOString();
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, total: cartTotal, deliveryFee, userId }),
      });
      const data = await res.json();
      const num = data.orderNumber ?? 1000;
      setOrderNumber(num);
      setLastOrderData({ items, total: cartTotal, deliveryFee, city: form.city, address: form.address, createdAt });
    } catch {
      setOrderNumber(1000);
    } finally {
      setLoading(false);
      clearCart();
    }
  }

  function handlePrintInvoice() {
    if (!orderNumber || !lastOrderData) return;
    printInvoice({
      orderNumber,
      customerName: form.name,
      phone: form.phone,
      email: form.email,
      city: lastOrderData.city,
      address: lastOrderData.address,
      items: lastOrderData.items,
      total: lastOrderData.total,
      deliveryFee: lastOrderData.deliveryFee,
      createdAt: lastOrderData.createdAt,
    });
  }

  if (orderNumber !== null) {
    return (
      <div className="text-center py-24 px-5">
        <div className="w-16 h-16 rounded-full bg-green/10 text-green text-3xl flex items-center justify-center mx-auto mb-4.5">✓</div>
        <h3 className="font-extrabold text-xl mb-2">{t("os_title")}</h3>
        <p className="text-ink-soft mb-6">{t("os_text").replace("{id}", String(orderNumber))}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={handlePrintInvoice} className="border border-deep-green text-deep-green rounded-full px-6 py-3 font-bold">
            {t("invoice_btn")}
          </button>
          <button onClick={() => router.push("/track")} className="border border-deep-green text-deep-green rounded-full px-6 py-3 font-bold">
            {t("track_order_btn")}
          </button>
          {userId && (
            <button onClick={() => router.push("/account")} className="border border-deep-green text-deep-green rounded-full px-6 py-3 font-bold">
              👤 Кабинетім
            </button>
          )}
          <button onClick={() => router.push("/")} className="bg-deep-green text-white rounded-full px-6 py-3 font-bold">
            {t("nav_home")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-14 px-5 max-w-2xl mx-auto">
      <h2 className="font-display text-2xl font-extrabold mb-6">{t("co_title")}</h2>

      {!userId && (
        <div className="bg-blue/10 text-deep-green rounded-xl p-3.5 text-sm mb-5 flex items-center justify-between flex-wrap gap-2">
          <span>Тіркелсеңіз тапсырыс тарихыңызды кабинетте көре аласыз</span>
          <button onClick={() => router.push("/account")} className="font-bold underline">Кіру / Тіркелу</button>
        </div>
      )}

      <div className="bg-bg-gray rounded-2xl p-5 mb-6">
        {ids.map((id) => {
          const p = products.find((x) => x.id === id);
          if (!p) return null;
          return (
            <div key={id} className="flex justify-between text-sm py-1.5">
              <span>{p.name[lang]} × {cart[id]}</span>
              <span className="font-semibold">{fmt(p.price * cart[id])}</span>
            </div>
          );
        })}
        <div className="flex justify-between text-sm py-1.5 text-ink-soft">
          <span>{t("delivery_label")}{form.city ? "" : t("delivery_hint")}</span>
          <span>{fmt(deliveryFee)}</span>
        </div>
        <div className="flex justify-between font-extrabold text-base mt-2.5 pt-2.5 border-t border-line">
          <span>{t("total")}</span>
          <span>{fmt(cartTotal)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3.5">
        <div className="grid grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-ink-soft">{t("ol_name")}</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3.5 py-3 rounded-xl border border-line text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-ink-soft">{t("ol_phone")}</label>
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-3.5 py-3 rounded-xl border border-line text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-ink-soft">{t("ol_email")}</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3.5 py-3 rounded-xl border border-line text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-ink-soft">{t("ol_country")}</label>
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="px-3.5 py-3 rounded-xl border border-line text-sm" />
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-xs font-bold text-ink-soft">{t("ol_city")}</label>
            <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="px-3.5 py-3 rounded-xl border border-line text-sm" />
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-xs font-bold text-ink-soft">{t("ol_address")}</label>
            <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="px-3.5 py-3 rounded-xl border border-line text-sm" />
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-xs font-bold text-ink-soft">{t("ol_notes")}</label>
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="px-3.5 py-3 rounded-xl border border-line text-sm resize-y" />
          </div>
        </div>
        <button disabled={loading} type="submit" className="bg-deep-green text-white rounded-full py-3.5 font-bold disabled:opacity-50">
          {loading ? "..." : t("order_submit")}
        </button>
      </form>
    </section>
  );
}
