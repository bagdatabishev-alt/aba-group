"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";
import {
  fetchAllProductsForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  DbProduct,
  ProductInput,
} from "@/lib/supabase/products";
import { fetchOrders, updateOrderStatus, updatePaymentStatus, deleteOrder, DbOrder } from "@/lib/supabase/orders";
import {
  fetchContactRequests,
  updateContactStatus,
  deleteContactRequest,
  DbContactRequest,
} from "@/lib/supabase/contact";
import { fetchSettings, updateSettings, SiteSettings } from "@/lib/supabase/settings";
import { printInvoice } from "@/lib/invoice/generateInvoice";
import { CATEGORIES } from "@/lib/data/categories";

const EMPTY_FORM: ProductInput = {
  category_id: CATEGORIES[0].id,
  sku: "",
  brand: "",
  price: 0,
  old_price: null,
  stock: 0,
  icon: "📦",
  image_url: null,
  name_kz: "",
  name_ru: "",
  name_en: "",
  desc_kz: "",
  desc_ru: "",
  desc_en: "",
};

const ORDER_STATUSES = [
  { value: "new", label: "Жаңа" },
  { value: "confirmed", label: "Расталды" },
  { value: "shipped", label: "Жіберілді" },
  { value: "delivered", label: "Жеткізілді" },
  { value: "cancelled", label: "Болдырылмады" },
];

const PAYMENT_STATUSES = [
  { value: "unpaid", label: "Төленбеген" },
  { value: "paid", label: "Төленген" },
  { value: "refunded", label: "Қайтарылған" },
];

interface DbCustomer {
  id: number;
  user_id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}

type Tab = "products" | "orders" | "contacts" | "customers" | "settings";

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("products");

  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const [contacts, setContacts] = useState<DbContactRequest[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const [customers, setCustomers] = useState<DbCustomer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (!session) {
        router.push("/admin");
        return;
      }
      setReady(true);
      loadProducts();
      loadOrders();
      loadContacts();
      loadCustomers();
      loadSettings();
    })();
  }, [router]);

  async function loadProducts() {
    setLoadingProducts(true);
    setProducts(await fetchAllProductsForAdmin());
    setLoadingProducts(false);
  }
  async function loadOrders() {
    setLoadingOrders(true);
    setOrders(await fetchOrders());
    setLoadingOrders(false);
  }
  async function loadContacts() {
    setLoadingContacts(true);
    setContacts(await fetchContactRequests());
    setLoadingContacts(false);
  }
  async function loadCustomers() {
    setLoadingCustomers(true);
    const supabase = createClient();
    const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
    setCustomers((data as DbCustomer[]) || []);
    setLoadingCustomers(false);
  }
  async function loadSettings() {
    setLoadingSettings(true);
    setSiteSettings(await fetchSettings());
    setLoadingSettings(false);
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!siteSettings) return;
    setSavingSettings(true);
    await updateSettings({
      phone: siteSettings.phone,
      whatsapp: siteSettings.whatsapp,
      telegram: siteSettings.telegram,
      email: siteSettings.email,
      address: siteSettings.address,
      hours: siteSettings.hours,
      delivery_fee_local: siteSettings.delivery_fee_local,
      delivery_fee_other: siteSettings.delivery_fee_other,
      delivery_free_threshold: siteSettings.delivery_free_threshold,
      local_city: siteSettings.local_city,
    });
    setSavingSettings(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
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
      image_url: p.image_url || null,
      name_kz: p.name_kz,
      name_ru: p.name_ru,
      name_en: p.name_en,
      desc_kz: p.desc_kz || "",
      desc_ru: p.desc_ru || "",
      desc_en: p.desc_en || "",
    });
    setModalOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const url = await uploadProductImage(file);
    setUploadingImage(false);
    if (url) setForm((prev) => ({ ...prev, image_url: url }));
    else alert("Суретті жүктеу сәтсіз аяқталды. Қайталап көріңіз.");
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

  async function handleDeleteProduct(id: number) {
    if (!confirm("Бұл өнімді жоюға сенімдісіз бе?")) return;
    await deleteProduct(id);
    loadProducts();
  }

  async function handleOrderStatus(id: number, status: string) {
    await updateOrderStatus(id, status);
    loadOrders();
  }
  async function handlePaymentStatus(id: number, payment_status: string) {
    await updatePaymentStatus(id, payment_status);
    loadOrders();
  }
  async function handleDeleteOrder(id: number) {
    if (!confirm("Бұл тапсырысты жоюға сенімдісіз бе?")) return;
    await deleteOrder(id);
    loadOrders();
  }

  function exportOrdersToExcel() {
    const headers = ["Тапсырыс №", "Клиент", "Телефон", "Email", "Қала", "Мекенжай", "Тауарлар", "Сома", "Статус", "Төлем", "Күні"];
    const rows = orders.map((o) => [
      o.order_number,
      o.customer_name,
      o.phone,
      o.email || "",
      o.city,
      o.address,
      (o.items || []).map((it) => `${it.name} x${it.qty}`).join("; "),
      o.total,
      ORDER_STATUSES.find((s) => s.value === o.status)?.label || o.status,
      PAYMENT_STATUSES.find((s) => s.value === o.payment_status)?.label || o.payment_status,
      new Date(o.created_at).toLocaleString("ru-RU"),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aba-group-tapsyrystar-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleContactStatus(id: number, status: string) {
    await updateContactStatus(id, status);
    loadContacts();
  }
  async function handleDeleteContact(id: number) {
    if (!confirm("Бұл хабарламаны жоюға сенімдісіз бе?")) return;
    await deleteContactRequest(id);
    loadContacts();
  }

  async function handleSignOut() {
    await signOut();
    router.push("/admin");
  }

  if (!ready) return null;

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const totalValue = products.reduce((s, p) => s + (p.stock || 0) * Number(p.price), 0);
  const newOrdersCount = orders.filter((o) => o.status === "new").length;
  const newContactsCount = contacts.filter((c) => c.status === "new").length;

  return (
    <section className="py-10 px-5 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <div className="flex gap-3">
          {tab === "products" && (
            <button onClick={openAdd} className="bg-deep-green text-white rounded-full px-5 py-2.5 font-bold text-sm">
              + Өнім қосу
            </button>
          )}
          <button onClick={handleSignOut} className="text-sm font-bold text-coral">
            Шығу
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b border-line overflow-x-auto">
        <TabButton active={tab === "products"} onClick={() => setTab("products")}>
          Өнімдер ({products.length})
        </TabButton>
        <TabButton active={tab === "orders"} onClick={() => setTab("orders")}>
          Тапсырыстар {newOrdersCount > 0 && <Badge count={newOrdersCount} />}
        </TabButton>
        <TabButton active={tab === "contacts"} onClick={() => setTab("contacts")}>
          Хабарламалар {newContactsCount > 0 && <Badge count={newContactsCount} />}
        </TabButton>
        <TabButton active={tab === "customers"} onClick={() => setTab("customers")}>
          Клиенттер ({customers.length})
        </TabButton>
        <TabButton active={tab === "settings"} onClick={() => setTab("settings")}>
          Баптаулар
        </TabButton>
      </div>

      {tab === "products" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Өнімдер саны" value={String(products.length)} />
            <StatCard label="Категориялар" value={String(CATEGORIES.length)} />
            <StatCard label="Жалпы қор" value={String(totalStock)} />
            <StatCard label="Қор құны" value={totalValue.toLocaleString("ru-RU") + " ₸"} />
          </div>
          <div className="bg-white border border-line rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-line font-bold">Өнімдер тізімі</div>
            {loadingProducts ? (
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
                          <button onClick={() => handleDeleteProduct(p.id)} className="text-coral font-bold text-xs">Жою</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "orders" && (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-line font-bold flex justify-between items-center">
            <span>Тапсырыстар тізімі</span>
            {orders.length > 0 && (
              <button onClick={exportOrdersToExcel} className="bg-bg-gray hover:bg-deep-green hover:text-white text-deep-green rounded-full px-4 py-2 text-xs font-bold transition">
                📊 Excel-ге экспорттау
              </button>
            )}
          </div>
          {loadingOrders ? (
            <div className="p-8 text-center text-ink-soft text-sm">Жүктелуде...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-ink-soft text-sm">Әлі тапсырыс жоқ.</div>
          ) : (
            <div className="divide-y divide-line">
              {orders.map((o) => (
                <div key={o.id} className="p-5">
                  <div
                    className="flex justify-between items-start cursor-pointer flex-wrap gap-2"
                    onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                  >
                    <div>
                      <div className="font-bold text-sm mb-1">
                        #{o.order_number} — {o.customer_name}
                        <StatusPill status={o.status} labels={ORDER_STATUSES} />
                        <StatusPill status={o.payment_status} labels={PAYMENT_STATUSES} />
                      </div>
                      <div className="text-xs text-ink-soft">
                        {o.phone} · {o.city} · {new Date(o.created_at).toLocaleString("ru-RU")}
                      </div>
                    </div>
                    <div className="font-extrabold text-deep-green">{Number(o.total).toLocaleString("ru-RU")} ₸</div>
                  </div>

                  {expandedOrder === o.id && (
                    <div className="mt-4 bg-bg-gray rounded-xl p-4 text-sm">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div><b className="text-ink-soft text-xs block">Email</b>{o.email || "—"}</div>
                        <div><b className="text-ink-soft text-xs block">Ел</b>{o.country || "—"}</div>
                        <div className="col-span-2"><b className="text-ink-soft text-xs block">Мекенжай</b>{o.address}</div>
                        {o.notes && <div className="col-span-2"><b className="text-ink-soft text-xs block">Ескертпе</b>{o.notes}</div>}
                      </div>
                      <div className="mb-3">
                        <b className="text-ink-soft text-xs block mb-1">Тауарлар</b>
                        {o.items?.map((it, i) => (
                          <div key={i} className="flex justify-between text-xs py-0.5">
                            <span>{it.name} × {it.qty}</span>
                            <span>{(it.price * it.qty).toLocaleString("ru-RU")} ₸</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <select value={o.status} onChange={(e) => handleOrderStatus(o.id, e.target.value)} className="px-3 py-2 rounded-lg border border-line text-xs">
                          {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <select value={o.payment_status} onChange={(e) => handlePaymentStatus(o.id, e.target.value)} className="px-3 py-2 rounded-lg border border-line text-xs">
                          {PAYMENT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <a href={`https://wa.me/${o.phone.replace(/[^0-9]/g, "")}`} target="_blank" className="bg-[#25D366] text-white rounded-full px-4 py-2 text-xs font-bold">
                          WhatsApp жазу
                        </a>
                        <button
                          onClick={() =>
                            printInvoice({
                              orderNumber: o.order_number,
                              customerName: o.customer_name,
                              phone: o.phone,
                              email: o.email,
                              city: o.city,
                              address: o.address,
                              items: o.items,
                              total: Number(o.total),
                              deliveryFee: Number(o.delivery_fee || 0),
                              createdAt: o.created_at,
                            })
                          }
                          className="border border-deep-green text-deep-green rounded-full px-4 py-2 text-xs font-bold"
                        >
                          📄 Есеп-шот
                        </button>
                        <button onClick={() => handleDeleteOrder(o.id)} className="text-coral font-bold text-xs ml-auto">
                          Жою
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "contacts" && (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-line font-bold">Байланыс хабарламалары</div>
          {loadingContacts ? (
            <div className="p-8 text-center text-ink-soft text-sm">Жүктелуде...</div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center text-ink-soft text-sm">Әлі хабарлама жоқ.</div>
          ) : (
            <div className="divide-y divide-line">
              {contacts.map((c) => (
                <div key={c.id} className="p-5">
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                    <div>
                      <div className="font-bold text-sm mb-1">
                        {c.name}
                        <StatusPill status={c.status} labels={[{ value: "new", label: "Жаңа" }, { value: "read", label: "Оқылды" }, { value: "replied", label: "Жауап берілді" }]} />
                      </div>
                      <div className="text-xs text-ink-soft">
                        {c.phone} {c.email ? `· ${c.email}` : ""} · {new Date(c.created_at).toLocaleString("ru-RU")}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-ink-soft mb-3 bg-bg-gray rounded-xl p-3">{c.message}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select value={c.status} onChange={(e) => handleContactStatus(c.id, e.target.value)} className="px-3 py-2 rounded-lg border border-line text-xs">
                      <option value="new">Жаңа</option>
                      <option value="read">Оқылды</option>
                      <option value="replied">Жауап берілді</option>
                    </select>
                    <a href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`} target="_blank" className="bg-[#25D366] text-white rounded-full px-4 py-2 text-xs font-bold">
                      WhatsApp жазу
                    </a>
                    <button onClick={() => handleDeleteContact(c.id)} className="text-coral font-bold text-xs ml-auto">
                      Жою
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "customers" && (
        <div className="bg-white border border-line rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-line font-bold">Тіркелген клиенттер</div>
          {loadingCustomers ? (
            <div className="p-8 text-center text-ink-soft text-sm">Жүктелуде...</div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-ink-soft text-sm">Әлі тіркелген клиент жоқ.</div>
          ) : (
            <div className="divide-y divide-line">
              {customers.map((c) => (
                <div key={c.id} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-bg-gray flex items-center justify-center overflow-hidden flex-shrink-0">
                    {c.avatar_url ? (
                      <img src={c.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{c.name || "Аты жоқ"}</div>
                    <div className="text-xs text-ink-soft">{c.email} {c.phone ? `· ${c.phone}` : ""}</div>
                  </div>
                  <div className="text-xs text-ink-soft">{new Date(c.created_at).toLocaleDateString("ru-RU")}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "settings" && (
        <div className="bg-white border border-line rounded-2xl p-6 max-w-xl">
          <div className="font-bold mb-1">Байланыс ақпараты</div>
          <p className="text-xs text-ink-soft mb-5">
            Мұнда өзгертілген ақпарат сайттың Байланыс бетінде және footer-де дереу көрінеді.
          </p>
          {loadingSettings || !siteSettings ? (
            <div className="text-center py-8 text-ink-soft text-sm">Жүктелуде...</div>
          ) : (
            <form onSubmit={handleSaveSettings} className="grid gap-3.5">
              <Field label="Телефон">
                <input value={siteSettings.phone} onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })} className="input" />
              </Field>
              <Field label="WhatsApp (нөмір, мыс. +77001234567)">
                <input value={siteSettings.whatsapp} onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })} className="input" />
              </Field>
              <Field label="Telegram (мыс. @abagroup)">
                <input value={siteSettings.telegram} onChange={(e) => setSiteSettings({ ...siteSettings, telegram: e.target.value })} className="input" />
              </Field>
              <Field label="Email">
                <input value={siteSettings.email} onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })} className="input" />
              </Field>
              <Field label="Мекенжай">
                <input value={siteSettings.address} onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })} className="input" />
              </Field>
              <Field label="Жұмыс уақыты">
                <input value={siteSettings.hours} onChange={(e) => setSiteSettings({ ...siteSettings, hours: e.target.value })} className="input" />
              </Field>

              <div className="font-bold mt-3 mb-1">Жеткізу тарифі</div>
              <Field label="Жергілікті қала атауы">
                <input value={siteSettings.local_city} onChange={(e) => setSiteSettings({ ...siteSettings, local_city: e.target.value })} className="input" />
              </Field>
              <div className="grid grid-cols-2 gap-3.5">
                <Field label="Жергілікті жеткізу ақысы (₸)">
                  <input type="number" value={siteSettings.delivery_fee_local} onChange={(e) => setSiteSettings({ ...siteSettings, delivery_fee_local: Number(e.target.value) })} className="input" />
                </Field>
                <Field label="Басқа қала жеткізу ақысы (₸)">
                  <input type="number" value={siteSettings.delivery_fee_other} onChange={(e) => setSiteSettings({ ...siteSettings, delivery_fee_other: Number(e.target.value) })} className="input" />
                </Field>
              </div>
              <Field label="Тегін жеткізу шегі (₸, 0 = өшірулі)">
                <input type="number" value={siteSettings.delivery_free_threshold} onChange={(e) => setSiteSettings({ ...siteSettings, delivery_free_threshold: Number(e.target.value) })} className="input" />
              </Field>

              <div className="flex items-center gap-3 mt-2">
                <button disabled={savingSettings} type="submit" className="bg-deep-green text-white rounded-full px-6 py-3 font-bold text-sm disabled:opacity-50">
                  {savingSettings ? "Сақталуда..." : "Сақтау"}
                </button>
                {settingsSaved && <span className="text-green text-sm font-bold">✓ Сақталды</span>}
              </div>
            </form>
          )}
        </div>
      )}

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
                <Field label="Иконка (emoji, сурет жоқ болса көрінеді)"><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input" /></Field>
              </div>
              <Field label="Тауар суреті">
                <div className="flex items-center gap-3">
                  {form.image_url && (
                    <img src={form.image_url} alt="" className="w-16 h-16 rounded-lg object-cover border border-line" />
                  )}
                  <label className="bg-bg-gray hover:bg-deep-green hover:text-white text-deep-green rounded-lg px-4 py-2.5 text-sm font-bold cursor-pointer transition">
                    {uploadingImage ? "Жүктелуде..." : form.image_url ? "Суретті ауыстыру" : "Сурет жүктеу"}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                  </label>
                  {form.image_url && (
                    <button type="button" onClick={() => setForm({ ...form, image_url: null })} className="text-coral text-xs font-bold">
                      Жою
                    </button>
                  )}
                </div>
              </Field>
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

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
        active ? "border-deep-green text-deep-green" : "border-transparent text-ink-soft"
      }`}
    >
      {children}
    </button>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span className="bg-coral text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
      {count}
    </span>
  );
}

function StatusPill({ status, labels }: { status: string; labels: { value: string; label: string }[] }) {
  const label = labels.find((l) => l.value === status)?.label || status;
  const colors: Record<string, string> = {
    new: "bg-coral/10 text-coral",
    confirmed: "bg-blue/10 text-blue",
    shipped: "bg-blue/10 text-blue",
    delivered: "bg-green/10 text-green",
    cancelled: "bg-gray-200 text-gray-500",
    read: "bg-blue/10 text-blue",
    replied: "bg-green/10 text-green",
    unpaid: "bg-coral/10 text-coral",
    paid: "bg-green/10 text-green",
    refunded: "bg-gray-200 text-gray-500",
  };
  return (
    <span className={`ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${colors[status] || "bg-gray-200 text-gray-500"}`}>
      {label}
    </span>
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
