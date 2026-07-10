"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import ProductCard from "@/components/ProductCard";
import { useLang } from "@/lib/i18n/LanguageContext";
import { useProducts } from "@/lib/products/ProductsContext";

export default function HomePage() {
  const { t } = useLang();
  const { products, loading } = useProducts();
  const featured = products.slice(0, 8);

  return (
    <>
      <section
        className="text-center py-20 px-5"
        style={{
          background:
            "radial-gradient(900px 450px at 85% -10%, rgba(43,168,214,.1), transparent 60%), radial-gradient(800px 450px at 10% 110%, rgba(11,61,46,.08), transparent 60%), #F4F6F5",
        }}
      >
        <Logo size={80} />
        <div className="inline-flex text-[12.5px] font-bold uppercase tracking-wide text-green bg-green/10 px-4 py-1.5 rounded-full mt-6 mb-5">
          {t("hero_eyebrow")}
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight text-deep-green mb-4">
          ABA Group
        </h1>
        <p className="text-lg text-ink-soft font-medium max-w-xl mx-auto mb-8">{t("hero_sub")}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/shop" className="bg-deep-green text-white rounded-full px-6 py-3.5 font-bold hover:-translate-y-0.5 transition inline-block">
            {t("hero_btn1")}
          </Link>
          <Link href="/contact" className="border border-deep-green text-deep-green rounded-full px-6 py-3.5 font-bold hover:bg-deep-green hover:text-white transition inline-block">
            {t("hero_btn2")}
          </Link>
        </div>
      </section>

      <section className="py-20 px-5 max-w-6xl mx-auto">
        <div className="max-w-xl mx-auto text-center mb-11">
          <div className="text-xs font-extrabold uppercase tracking-wide text-blue mb-3">{t("cat_eyebrow")}</div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-deep-green tracking-tight">{t("cat_title")}</h2>
        </div>
        {loading ? (
          <div className="text-center py-16 text-ink-soft text-sm">Жүктелуде...</div>
        ) : featured.length === 0 ? (
          <div className="text-center py-16 text-ink-soft text-sm">Әлі өнім қосылмаған.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
