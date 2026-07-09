"use client";

import { useLang } from "@/lib/i18n/LanguageContext";

const SVC = {
  kz: [["🚚", "Логистика", "Импорт және экспорт қызметтері"], ["🌐", "Халықаралық сауда", "Procurement & Trade"], ["💡", "Консалтинг", "Технология мен стратегия"], ["🛡️", "Қауіпсіздік жүйелері", "Security & Construction Supply"]],
  ru: [["🚚", "Логистика", "Импорт и экспорт"], ["🌐", "Международная торговля", "Закупки и торговля"], ["💡", "Консалтинг", "Технологии и стратегия"], ["🛡️", "Системы безопасности", "Безопасность и стройматериалы"]],
  en: [["🚚", "Logistics", "Import & export services"], ["🌐", "International Trade", "Procurement & trade"], ["💡", "Consulting", "Technology & strategy"], ["🛡️", "Security Systems", "Security & construction supply"]],
};

export default function ServicesPage() {
  const { lang, t } = useLang();

  return (
    <section className="py-20 px-5 max-w-6xl mx-auto">
      <div className="max-w-xl mx-auto text-center mb-11">
        <div className="text-xs font-extrabold uppercase tracking-wide text-blue mb-3">{t("svc_eyebrow")}</div>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-deep-green tracking-tight">{t("svc_title")}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SVC[lang].map(([icon, title, desc], i) => (
          <div key={i} className="bg-white border border-line rounded-[18px] p-6 shadow-sm">
            <div className="text-3xl mb-2.5">{icon}</div>
            <div className="font-extrabold text-base mb-1.5">{title}</div>
            <div className="text-sm text-ink-soft">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
