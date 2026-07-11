"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useLang } from "@/lib/i18n/LanguageContext";
import { useSettings } from "@/lib/settings/SettingsContext";
import { CATEGORIES } from "@/lib/data/categories";

export default function Footer() {
  const { lang, t } = useLang();
  const { settings } = useSettings();

  const waLink = settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}` : "#";
  const tgLink = settings?.telegram ? `https://t.me/${settings.telegram.replace("@", "")}` : "#";

  return (
    <footer className="bg-deep-green text-white/85 pt-14 pb-7">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 font-extrabold text-lg text-white mb-3">
              <Logo size={24} />
              ABA Group
            </div>
            <p className="text-sm text-white/60 max-w-[270px]">{t("foot_tag")}</p>
          </div>
          <div>
            <h5 className="text-xs uppercase tracking-wide text-white/55 mb-3.5">{t("foot_products")}</h5>
            <ul className="flex flex-col gap-2">
              {CATEGORIES.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <Link href={`/shop?cat=${c.id}`} className="text-sm hover:text-white">
                    {c.name[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs uppercase tracking-wide text-white/55 mb-3.5">{t("foot_company")}</h5>
            <ul className="flex flex-col gap-2">
              <li><Link href="/about" className="text-sm hover:text-white">{t("nav_about")}</Link></li>
              <li><Link href="/services" className="text-sm hover:text-white">{t("nav_services")}</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs uppercase tracking-wide text-white/55 mb-3.5">{t("foot_contact")}</h5>
            <ul className="flex flex-col gap-2">
              <li><a href={waLink} target="_blank" className="text-sm hover:text-white">WhatsApp</a></li>
              <li><a href={tgLink} target="_blank" className="text-sm hover:text-white">Telegram</a></li>
              <li><a href={`mailto:${settings?.email || "info@abagroup.kz"}`} className="text-sm hover:text-white">{settings?.email || "info@abagroup.kz"}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/15 pt-5 flex justify-between flex-wrap gap-2.5 text-xs text-white/55">
          <span>© 2026 ABA Group. All Rights Reserved.</span>
          <span>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            {" · "}
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
