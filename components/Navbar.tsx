"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { useLang } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/cart/CartContext";
import CartDrawer from "./CartDrawer";
import { Lang } from "@/lib/data/categories";

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const { cartCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const links = [
    { href: "/", label: t("nav_home") },
    { href: "/about", label: t("nav_about") },
    { href: "/shop", label: t("nav_shop") },
    { href: "/services", label: t("nav_services") },
    { href: "/contact", label: t("nav_contact") },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-line">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg text-deep-green font-display">
            <Logo size={32} />
            ABA Group
          </Link>

          <div className="hidden md:flex gap-6 text-sm font-semibold text-ink-soft">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-deep-green transition">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex gap-1 text-xs font-extrabold bg-bg-gray p-1 rounded-lg">
              {(["kz", "ru", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded-md transition ${
                    lang === l ? "bg-deep-green text-white" : "text-ink-soft"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Link href="/account" className="w-10 h-10 rounded-xl bg-bg-gray flex items-center justify-center text-lg">
              👤
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-10 h-10 rounded-xl bg-bg-gray flex items-center justify-center text-lg"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-coral text-white text-[11px] font-extrabold w-[19px] h-[19px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
