"use client";

import { useLang } from "@/lib/i18n/LanguageContext";

const MEANINGS = {
  kz: [
    ["🌐", "Глобус", "#2BA8D6", ["Халықаралық бағыт", "Дүниежүзілік жүйе"]],
    ["📍", "Location pin", "#CB6259", ["Логистика, жүк тасымал", "Бағдар, бақылау"]],
    ["🌙", "Жасыл ай", "#2E8B4F", ["Исламдық көзқарас", "Рухани принциптер, этика"]],
    ["👤", "ABA", "#0B3D2E", ["Аты-жөнінің қысқармасы", "Жеке қолтаңба, identity"]],
    ["👥", "Group", "#0B3D2E", ["Ашықтық", "Барлығымен араласу, шектеусіз орта"]],
  ],
  ru: [
    ["🌐", "Глобус", "#2BA8D6", ["Международное направление", "Мировая система"]],
    ["📍", "Location pin", "#CB6259", ["Логистика, перевозки", "Навигация, отслеживание"]],
    ["🌙", "Зелёный полумесяц", "#2E8B4F", ["Исламские ценности", "Духовные принципы, этика"]],
    ["👤", "ABA", "#0B3D2E", ["Аббревиатура имени", "Личная идентичность"]],
    ["👥", "Group", "#0B3D2E", ["Открытость", "Сотрудничество, безграничная среда"]],
  ],
  en: [
    ["🌐", "Globe", "#2BA8D6", ["International direction", "Worldwide system"]],
    ["📍", "Location pin", "#CB6259", ["Logistics, transportation", "Navigation, tracking"]],
    ["🌙", "Green Crescent", "#2E8B4F", ["Islamic values", "Spiritual principles, ethics"]],
    ["👤", "ABA", "#0B3D2E", ["Name abbreviation", "Personal identity"]],
    ["👥", "Group", "#0B3D2E", ["Openness", "Collaboration, boundless environment"]],
  ],
};

export default function AboutPage() {
  const { lang, t } = useLang();
  const meanings = MEANINGS[lang];

  return (
    <section className="py-20 px-5 max-w-6xl mx-auto">
      <div className="max-w-xl mx-auto text-center mb-11">
        <div className="text-xs font-extrabold uppercase tracking-wide text-blue mb-3">{t("about_eyebrow")}</div>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-deep-green tracking-tight mb-2.5">{t("about_title")}</h2>
        <p className="text-ink-soft">{t("about_sub")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {meanings.map(([icon, title, color, items], i) => (
          <div key={i} className="bg-white border border-line rounded-[18px] p-6 shadow-sm">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3.5"
              style={{ background: `${color}20`, color: color as string }}
            >
              {icon}
            </div>
            <h3 className="text-base font-extrabold mb-2">{title}</h3>
            <ul className="flex flex-col gap-0.5">
              {(items as string[]).map((it, j) => (
                <li key={j} className="text-[13px] text-ink-soft before:content-['—_'] before:text-green before:font-bold">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-9 bg-deep-green rounded-[22px] p-10 text-center text-white">
        <p className="text-lg font-semibold max-w-2xl mx-auto">{t("about_quote")}</p>
      </div>
    </section>
  );
}
