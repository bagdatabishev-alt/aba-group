"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useLang } from "@/lib/i18n/LanguageContext";
import { CATEGORIES } from "@/lib/data/categories";
import { useProducts } from "@/lib/products/ProductsContext";

function ShopContent() {
  const { lang, t } = useLang();
  const { products, loading } = useProducts();
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat") || "all";

  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("0");
  const [sort, setSort] = useState("0");

  const SORT_LABELS: Record<string, string[]> = {
    kz: ["Ұсынылған", "Бағасы: арзаннан қымбатқа", "Бағасы: қымбаттан арзанға", "Жаңалары"],
    ru: ["Рекомендуемые", "Цена: сначала дешевле", "Цена: сначала дороже", "Новинки"],
    en: ["Featured", "Price: Low to High", "Price: High to Low", "Newest"],
  };
  const PRICE_LABELS: Record<string, string[]> = {
    kz: ["Барлық баға", "0 – 50,000 ₸", "50,000 – 200,000 ₸", "200,000 ₸ +"],
    ru: ["Любая цена", "0 – 50,000 ₸", "50,000 – 200,000 ₸", "200,000 ₸ +"],
    en: ["Any price", "0 – 50,000 ₸", "50,000 – 200,000 ₸", "200,000 ₸ +"],
  };

  function setCat(id: string) {
    router.push(id === "all" ? "/shop" : `/shop?cat=${id}`);
  }

  const filtered = useMemo(() => {
    let list = products.filter((p) => catParam === "all" || p.cat === catParam);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((p) => p.name[lang].toLowerCase().includes(q) || p.desc[lang].toLowerCase().includes(q));
    if (priceFilter === "1") list = list.filter((p) => p.price <= 50000);
    else if (priceFilter === "2") list = list.filter((p) => p.price > 50000 && p.price <= 200000);
    else if (priceFilter === "3") list = list.filter((p) => p.price > 200000);
    list = [...list];
    if (sort === "1") list.sort((a, b) => a.price - b.price);
    else if (sort === "2") list.sort((a, b) => b.price - a.price);
    else if (sort === "3") list.sort((a, b) => b.id - a.id);
    return list;
  }, [catParam, search, priceFilter, sort, lang, products]);

  return (
    <section className="py-14 px-5 max-w-6xl mx-auto">
      <div className="max-w-xl mx-auto text-center mb-9">
        <div className="text-xs font-extrabold uppercase tracking-wide text-blue mb-3">{t("shop_eyebrow")}</div>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-deep-green tracking-tight">{t("shop_title")}</h2>
      </div>

      <div className="flex gap-2.5 flex-wrap justify-center mb-9">
        <button
          onClick={() => setCat("all")}
          className={`px-4 py-2.5 rounded-full text-sm font-bold border transition ${
            catParam === "all" ? "bg-deep-green border-deep-green text-white" : "bg-white border-line text-ink-soft"
          }`}
        >
          {t("all")}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`px-4 py-2.5 rounded-full text-sm font-bold border transition ${
              catParam === c.id ? "bg-deep-green border-deep-green text-white" : "bg-white border-line text-ink-soft"
            }`}
          >
            {c.icon} {c.name[lang]}
          </button>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap items-center mb-7">
        <div className="flex-1 min-w-[220px] relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_ph")}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-line text-sm focus:outline-none focus:border-blue"
          />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3.5 py-3 rounded-xl border border-line text-sm bg-white">
          {SORT_LABELS[lang].map((s, i) => (
            <option key={i} value={i}>{s}</option>
          ))}
        </select>
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="px-3.5 py-3 rounded-xl border border-line text-sm bg-white">
          {PRICE_LABELS[lang].map((s, i) => (
            <option key={i} value={i}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-ink-soft text-sm">Жүктелуде...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-soft">
          <div className="text-4xl mb-3.5">🔍</div>
          <h3 className="font-bold text-lg mb-1">{t("empty_title")}</h3>
          <p>{t("empty_text")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
