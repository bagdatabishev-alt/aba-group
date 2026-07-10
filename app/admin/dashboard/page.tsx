"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "@/lib/supabase/auth";
import {
  fetchAllProductsForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  DbProduct,
  ProductInput,
} from "@/lib/supabase/products";
import { CATEGORIES } from "@/lib/data/categories";

const EMPTY_FORM: ProductInput = {
  category_id: CATEGORIES[0].id,
  sku: "",
  brand: "",
  price: 0,
  old_price: null,
  stock: 0,
  icon: "📦",
  name_kz: "",
  name_ru: "",
  name_en: "",
  desc_kz: "",
  desc_ru: "",
  desc_en: "",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.push("/admin");
        return;
      }
      setReady(true);
      loadProducts();
    })();
  }, [router]);

  async function loadProducts() {
    setLoading(true);
    const data = await fetchAllProductsForAdmin();
    setProducts(data);
    setLoading(false);
  }

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(p: DbProduct) {
    setEditingId(p.id);
    setForm({
      category_id: p.category_id,
      sku: p.sku || "",
      brand: p.brand || "",
      price: Number(p.price),
      old_price: p.old_price ? Number(p.old_price) : null,
      stock: p.stock,
      icon: p.icon || "📦",
      name_kz: p.name_kz,
      name_ru: p.name_ru,
      name_en: p.name_en,
      desc_kz: p.desc_kz || "",
      desc_ru: p.desc_ru || "",
      desc_en: p.desc_en || "",
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editingId) {
      await updateProduct(editingId, form);
    } else {
      await createProduct(form);
    }
    setSaving(false);
    setModalOpen(false);
    loadProducts();
  }

  async function handleDelete(id: number) {
    if (!confirm("Бұл өнімді жоюға сенімдісіз бе?")) return;
    await deleteProduct(id);
    loadProducts();
  }

  async function handleSignOut() {
    await signOut();
    router.push("/admin");
  }

  if (!ready) return null;

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const totalValue = products.reduce((s, p) => s + (p.stock || 0) * Number(p.price), 0);

  return (
    <section className="py-10 px-5 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <div className="flex gap-3">
          <button onClick={openAdd} className="bg-deep-green text-white rounded-full px-5 py-2.5 font-bold text-sm">
            + Өнім қосу
          </button>
          <button onClick={handleSignOut} className="text-sm font-bold text-coral">
            Шығу
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Өнімдер саны" value={String(products.length)} />
        <StatCard label="Категориялар" value={String(CATEGORIES.length)} />
        <StatCard label="Жалпы қор" value={String(totalStock)} />
        <StatCard label="Қор құны" value={totalValue.toLocaleString("ru-RU") + " ₸"} />
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-line font-bold">Өнімдер тізімі</div>
        {loading ? (
          <div className="p-8 text-center text-ink-soft text-sm">Жүктелуде...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-ink-soft text-sm">Әлі өнім жоқ. &quot;+ Өнім қосу&quot; басыңыз.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-gray text-ink-soft text-xs uppercase">
                <tr>
                  <th className="text-left px-5 py-3">SKU</th>
                  <th className="text-left px-5 py-3">Атауы</th>
                  <th className="text-left px-5 py-3">Санат</th>
                  <th className="text-left px-5 py-3">Баға</th>
                  <th className="text-left px-5 py-3">Қор</th>
                  <th className="text-left px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-line">
                    <td className="px-5 py-3 text-ink-soft">{p.sku}</td>
                    <td className="px-5 py-3 font-semibold">{p.name_kz}</td>
                    <td className="px-5 py-3">{p.category_id}</td>
                    <td className="px-5 py-3">{Number(p.price).toLocaleString("ru-RU")} ₸</td>
                    <td className="px-5 py-3">{p.stock}</td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(p)} className="text-blue font-bold text-xs mr-3">Өңдеу</button>
                      <button onClick={() => handleDelete(p.id)} className="text-coral font-bold text-xs">Жою</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-7">
            <h2 className="text-lg font-extrabold mb-5">{editingId ? "Өнімді өңдеу" : "Жаңа өнім қосу"}</h2>
            <form onSubmit={handleSave} className="grid gap-3.5">
              <div className="grid grid-cols-2 gap-3.5">
                <Field label="Атауы (KZ)"><input required value={form.name_kz} onChange={(e) => setForm({ ...form, name_kz: e.target.value })} className="input" /></Field>
                <Field label="Атауы (RU)"><input required value={form.name_ru} onChange={(e) => setForm({ ...form, name_ru: e.target.value })} className="input" /></Field>
                <Field label="Атауы (EN)"><input required value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="input" /></Field>
                <Field label="Санат">
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input">
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name.kz}</option>)}
                  </select>
                </Field>
                <Field label="Баға (₸)"><input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input" /></Field>
                <Field label="Ескі баға (жеңілдік үшін)"><input type="number" value={form.old_price ?? ""} onChange={(e) => setForm({ ...form, old_price: e.target.value ? Number(e.target.value) : null })} className="input" /></Field>
                <Field label="Қор саны"><input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="input" /></Field>
                <Field label="Бренд"><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input" /></Field>
                <Field label="SKU"><input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input" /></Field>
                <Field label="Иконка (emoji)"><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input" /></Field>
              </div>
              <Field label="Сипаттама (KZ)"><textarea value={form.desc_kz} onChange={(e) => setForm({ ...form, desc_kz: e.target.value })} className="input" rows={2} /></Field>
              <Field label="Сипаттама (RU)"><textarea value={form.desc_ru} onChange={(e) => setForm({ ...form, desc_ru: e.target.value })} className="input" rows={2} /></Field>
              <Field label="Сипаттама (EN)"><textarea value={form.desc_en} onChange={(e) => setForm({ ...form, desc_en: e.target.value })} className="input" rows={2} /></Field>
              <div className="flex gap-3 mt-2">
                <button disabled={saving} type="submit" className="bg-deep-green text-white rounded-full px-6 py-3 font-bold text-sm disabled:opacity-50">
                  {saving ? "Сақталуда..." : "Сақтау"}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="border border-line rounded-full px-6 py-3 font-bold text-sm">
                  Болдырмау
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input {
          padding: 12px 14px;
          border-radius: 11px;
          border: 1.5px solid var(--color-line);
          font-size: 14px;
          width: 100%;
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-ink-soft">{label}</label>
      {children}
    </div>
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
