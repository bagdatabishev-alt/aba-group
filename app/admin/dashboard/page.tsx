"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("aba_admin") !== "1") {
      router.push("/admin");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  const totalStock = PRODUCTS.reduce((s, p) => s + p.stock, 0);
  const totalValue = PRODUCTS.reduce((s, p) => s + p.stock * p.price, 0);

  return (
    <section className="py-10 px-5 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <button
          onClick={() => { sessionStorage.removeItem("aba_admin"); router.push("/admin"); }}
          className="text-sm font-bold text-coral"
        >
          Шығу
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Өнімдер саны" value={String(PRODUCTS.length)} />
        <StatCard label="Категориялар" value={String(CATEGORIES.length)} />
        <StatCard label="Жалпы қор" value={String(totalStock)} />
        <StatCard label="Қор құны" value={totalValue.toLocaleString("ru-RU") + " ₸"} />
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-line font-bold">Өнімдер тізімі</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg-gray text-ink-soft text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">SKU</th>
                <th className="text-left px-5 py-3">Атауы</th>
                <th className="text-left px-5 py-3">Санат</th>
                <th className="text-left px-5 py-3">Баға</th>
                <th className="text-left px-5 py-3">Қор</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-5 py-3 text-ink-soft">{p.sku}</td>
                  <td className="px-5 py-3 font-semibold">{p.name.kz}</td>
                  <td className="px-5 py-3">{p.cat}</td>
                  <td className="px-5 py-3">{p.price.toLocaleString("ru-RU")} ₸</td>
                  <td className="px-5 py-3">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-ink-soft mt-6">
        Бұл — демо деректер (статикалық). Supabase қосылғаннан кейін өнімдерді қосу/өңдеу/жою нақты дерекқормен жұмыс істейді.
      </p>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-5">
      <div className="text-xs font-semibold text-ink-soft mb-1.5">{label}</div>
      <div className="text-xl font-extrabold text-deep-green">{value}</div>
    </div>
  );
}
