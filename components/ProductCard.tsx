"use client";

import Link from "next/link";
import { Product } from "@/lib/data/products";
import { getCategory } from "@/lib/data/categories";
import { useLang } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/cart/CartContext";

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₸";
}

export default function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const { addToCart } = useCart();
  const category = getCategory(product.cat);
  const discount = product.old ? Math.round((1 - product.price / product.old) * 100) : null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="bg-white border border-line rounded-[18px] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition flex flex-col"
    >
      <div className="h-36 bg-bg-gray flex items-center justify-center text-5xl relative">
        {product.icon}
        {discount && (
          <span className="absolute top-2.5 left-2.5 bg-coral text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <div className="text-[11px] font-bold text-blue uppercase tracking-wide">{category?.name[lang]}</div>
        <div className="text-sm font-bold leading-tight">{product.name[lang]}</div>
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-lg font-extrabold text-deep-green">{fmt(product.price)}</span>
          {product.old && <span className="text-xs text-gray-400 line-through">{fmt(product.old)}</span>}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product.id);
          }}
          className="mt-2.5 bg-bg-gray hover:bg-deep-green hover:text-white rounded-lg py-2.5 font-bold text-sm text-center text-deep-green transition"
        >
          {t("add")}
        </button>
      </div>
    </Link>
  );
}
