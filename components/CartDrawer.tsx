"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/CartContext";
import { useLang } from "@/lib/i18n/LanguageContext";
import { getProduct } from "@/lib/data/products";

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₸";
}

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, changeQty, removeFromCart, cartTotal } = useCart();
  const { lang, t } = useLang();
  const router = useRouter();

  if (!open) return null;

  const ids = Object.keys(cart).map(Number);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[110]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[111] flex flex-col shadow-2xl">
        <div className="px-5 py-5 border-b border-line flex justify-between items-center">
          <h3 className="text-lg font-extrabold">{t("cart_title")}</h3>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {ids.length === 0 ? (
            <div className="text-center py-16 text-ink-soft">
              <div className="text-4xl mb-3">🛒</div>
              <p>{t("cart_empty")}</p>
            </div>
          ) : (
            ids.map((id) => {
              const p = getProduct(id);
              if (!p) return null;
              const qty = cart[id];
              return (
                <div key={id} className="flex gap-3 py-3.5 border-b border-line">
                  <div className="w-14 h-14 rounded-xl bg-bg-gray flex items-center justify-center text-2xl flex-shrink-0">
                    {p.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold mb-1">{p.name[lang]}</div>
                    <div className="text-sm text-ink-soft">{fmt(p.price)}</div>
                    <div className="flex items-center gap-2.5 mt-2">
                      <button onClick={() => changeQty(id, -1)} className="w-6 h-6 rounded-md bg-bg-gray font-extrabold">−</button>
                      <span>{qty}</span>
                      <button onClick={() => changeQty(id, 1)} className="w-6 h-6 rounded-md bg-bg-gray font-extrabold">+</button>
                      <span onClick={() => removeFromCart(id)} className="text-xs text-coral font-bold ml-auto cursor-pointer">✕</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-5 py-5 border-t border-line">
          {ids.length > 0 && (
            <div className="flex justify-between text-base font-extrabold mb-3.5">
              <span>{t("total")}</span>
              <span>{fmt(cartTotal)}</span>
            </div>
          )}
          {ids.length === 0 ? (
            <button onClick={onClose} className="w-full border border-deep-green text-deep-green rounded-full py-3 font-bold">
              {t("continue")}
            </button>
          ) : (
            <button
              onClick={() => { onClose(); router.push("/checkout"); }}
              className="w-full bg-deep-green text-white rounded-full py-3.5 font-bold"
            >
              {t("checkout")}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
