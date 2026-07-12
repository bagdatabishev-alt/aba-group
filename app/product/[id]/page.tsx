"use client";

import { useParams, useRouter } from "next/navigation";
import { getCategory } from "@/lib/data/categories";
import { useLang } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/cart/CartContext";
import { useProducts } from "@/lib/products/ProductsContext";
import { useSettings } from "@/lib/settings/SettingsContext";

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₸";
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { lang, t } = useLang();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const { settings } = useSettings();

  const id = Number(params.id);
  const product = products.find((p) => p.id === id);

  if (loading) {
    return <div className="text-center py-24 text-ink-soft text-sm">Жүктелуде...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <p className="text-ink-soft">Өнім табылмады.</p>
      </div>
    );
  }

  const category = getCategory(product.cat);
  const discount = product.old ? Math.round((1 - product.price / product.old) * 100) : null;

  return (
    <section className="py-10 px-5 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="text-sm font-semibold text-ink-soft mb-5">
        ← {t("continue")}
      </button>
      <div className="grid md:grid-cols-2 border border-line rounded-[22px] overflow-hidden shadow-sm">
        <div className="bg-bg-gray flex items-center justify-center text-[120px] min-h-[280px] overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name[lang]} className="w-full h-full object-cover" />
          ) : (
            product.icon
          )}
        </div>
        <div className="p-8">
          <div className="text-xs font-bold text-blue uppercase mb-2">{category?.name[lang]}</div>
          <h1 className="text-2xl font-extrabold mb-2.5">{product.name[lang]}</h1>
          <div className="flex items-baseline gap-2.5 mb-4">
            <span className="text-2xl font-extrabold text-deep-green">{fmt(product.price)}</span>
            {product.old && (
              <>
                <span className="text-base text-gray-400 line-through">{fmt(product.old)}</span>
                <span className="text-xs font-extrabold bg-coral/10 text-coral px-2.5 py-1 rounded-full">-{discount}%</span>
              </>
            )}
          </div>
          <p className="text-sm text-ink-soft mb-5 leading-relaxed">{product.desc[lang]}</p>
          <div className="grid grid-cols-2 gap-2.5 mb-6 text-sm">
            <div className="bg-bg-gray rounded-lg px-3 py-2.5">
              <b className="block text-xs text-ink-soft font-semibold">{t("sku")}</b>{product.sku}
            </div>
            <div className="bg-bg-gray rounded-lg px-3 py-2.5">
              <b className="block text-xs text-ink-soft font-semibold">{t("brand")}</b>{product.brand}
            </div>
            <div className="bg-bg-gray rounded-lg px-3 py-2.5">
              <b className="block text-xs text-ink-soft font-semibold">{t("stock")}</b>{product.stock}
            </div>
            <div className="bg-bg-gray rounded-lg px-3 py-2.5">
              <b className="block text-xs text-ink-soft font-semibold">{t("warranty")}</b>{t("warranty_val")}
            </div>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <button onClick={() => addToCart(product.id)} className="bg-deep-green text-white rounded-full px-6 py-3 font-bold text-sm">
              {t("add")}
            </button>
            <a
              href={`https://wa.me/${(settings?.whatsapp || "77000000000").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(product.name[lang] + " — " + fmt(product.price))}`}
              target="_blank"
              className="bg-[#25D366] text-white rounded-full px-6 py-3 font-bold text-sm"
            >
              {t("wa_btn")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
