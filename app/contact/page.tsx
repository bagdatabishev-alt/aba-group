"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function ContactPage() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } finally {
      setLoading(false);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setForm({ name: "", phone: "", email: "", message: "" });
      }, 4000);
    }
  }

  const infoRows = [
    ["📞", "Телефон", "+7 700 000 00 00"],
    ["💬", "WhatsApp", "+7 700 000 00 00"],
    ["✈️", "Telegram", "@abagroup"],
    ["✉️", "Email", "info@abagroup.kz"],
    ["📍", "Address", "Astana, Kazakhstan"],
    ["🕐", "Hours", "Дс–Жм: 09:00–18:00"],
  ];

  return (
    <section className="py-20 px-5 max-w-6xl mx-auto">
      <div className="max-w-xl mx-auto text-center mb-11">
        <div className="text-xs font-extrabold uppercase tracking-wide text-blue mb-3">{t("contact_eyebrow")}</div>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-deep-green tracking-tight">{t("contact_title")}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3.5">
          {infoRows.map(([icon, label, value], i) => (
            <div key={i} className="flex gap-3.5 items-start bg-white border border-line rounded-2xl px-4 py-4">
              <div className="text-xl">{icon}</div>
              <div>
                <b className="block text-sm mb-0.5">{label}</b>
                <span className="text-sm text-ink-soft">{value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-line rounded-[20px] p-7 shadow-sm">
          {!sent ? (
            <form onSubmit={handleSubmit} className="grid gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-ink-soft">{t("lbl_name")}</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="px-3.5 py-3 rounded-xl border border-line text-sm focus:outline-none focus:border-blue"
                />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-ink-soft">{t("lbl_phone")}</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="px-3.5 py-3 rounded-xl border border-line text-sm focus:outline-none focus:border-blue"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-ink-soft">{t("lbl_email")}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="px-3.5 py-3 rounded-xl border border-line text-sm focus:outline-none focus:border-blue"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-ink-soft">{t("lbl_msg")}</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="px-3.5 py-3 rounded-xl border border-line text-sm focus:outline-none focus:border-blue resize-y"
                />
              </div>
              <button disabled={loading} type="submit" className="bg-deep-green text-white rounded-full py-3.5 font-bold disabled:opacity-50">
                {loading ? "..." : t("contact_submit")}
              </button>
            </form>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-green/10 text-green text-3xl flex items-center justify-center mx-auto mb-4">✓</div>
              <h3 className="font-extrabold text-lg">{t("cs_title")}</h3>
              <p className="text-sm text-ink-soft mt-2">{t("cs_text")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
