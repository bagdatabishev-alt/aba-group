"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  customerSignUp,
  customerSignIn,
  customerSignOut,
  getCurrentCustomerSession,
  fetchMyProfile,
  updateMyProfile,
  uploadAvatar,
  fetchMyOrders,
  CustomerProfile,
  MyOrder,
} from "@/lib/supabase/customerAuth";

const STATUS_LABELS: Record<string, string> = {
  new: "Жаңа",
  confirmed: "Расталды",
  shipped: "Жіберілді",
  delivered: "Жеткізілді",
  cancelled: "Болдырылмады",
};

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₸";
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const session = await getCurrentCustomerSession();
    if (session) {
      setLoggedIn(true);
      const p = await fetchMyProfile();
      setProfile(p);
      const o = await fetchMyOrders();
      setOrders(o);
    }
    setLoading(false);
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    if (mode === "signup") {
      const { error } = await customerSignUp(email, password, name);
      if (error) {
        setAuthError("Тіркелу сәтсіз аяқталды. Email дұрыс екенін тексеріңіз.");
        setAuthLoading(false);
        return;
      }
    } else {
      const { error } = await customerSignIn(email, password);
      if (error) {
        setAuthError("Email немесе құпия сөз қате.");
        setAuthLoading(false);
        return;
      }
    }
    setAuthLoading(false);
    checkSession();
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadingAvatar(true);
    const url = await uploadAvatar(file, profile.user_id);
    if (url) {
      await updateMyProfile({ avatar_url: url });
      setProfile({ ...profile, avatar_url: url });
    }
    setUploadingAvatar(false);
  }

  async function handleSignOut() {
    await customerSignOut();
    setLoggedIn(false);
    setProfile(null);
    setOrders([]);
    router.push("/");
  }

  if (loading) return <div className="text-center py-24 text-ink-soft text-sm">Жүктелуде...</div>;

  if (!loggedIn) {
    return (
      <section className="py-16 px-5 max-w-sm mx-auto">
        <h1 className="font-display text-2xl font-extrabold text-deep-green text-center mb-6">
          {mode === "login" ? "Кабинетке кіру" : "Тіркелу"}
        </h1>
        <form onSubmit={handleAuth} className="bg-white border border-line rounded-2xl p-6 shadow-sm grid gap-3.5">
          {mode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink-soft">Аты-жөні</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="px-3.5 py-3 rounded-xl border border-line text-sm" />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-ink-soft">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-3.5 py-3 rounded-xl border border-line text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-ink-soft">Құпия сөз</label>
            <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="px-3.5 py-3 rounded-xl border border-line text-sm" />
          </div>
          {authError && <p className="text-xs text-coral font-semibold">{authError}</p>}
          <button disabled={authLoading} type="submit" className="bg-deep-green text-white rounded-full py-3 font-bold disabled:opacity-50">
            {authLoading ? "..." : mode === "login" ? "Кіру" : "Тіркелу"}
          </button>
        </form>
        <p className="text-center text-sm text-ink-soft mt-4">
          {mode === "login" ? (
            <>Аккаунтыңыз жоқ па? <button onClick={() => { setMode("signup"); setAuthError(""); }} className="text-deep-green font-bold">Тіркелу</button></>
          ) : (
            <>Аккаунтыңыз бар ма? <button onClick={() => { setMode("login"); setAuthError(""); }} className="text-deep-green font-bold">Кіру</button></>
          )}
        </p>
      </section>
    );
  }

  return (
    <section className="py-14 px-5 max-w-2xl mx-auto">
      <div className="bg-white border border-line rounded-2xl p-6 shadow-sm mb-8 flex items-center gap-5 flex-wrap">
        <div className="w-20 h-20 rounded-full bg-bg-gray flex items-center justify-center overflow-hidden flex-shrink-0">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
        <div className="flex-1 min-w-[160px]">
          <div className="font-extrabold text-lg">{profile?.name || "Клиент"}</div>
          <div className="text-sm text-ink-soft">{profile?.email}</div>
          <label className="inline-block mt-2 text-xs font-bold text-deep-green cursor-pointer">
            {uploadingAvatar ? "Жүктелуде..." : "Фото жүктеу"}
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploadingAvatar} />
          </label>
        </div>
        <button onClick={handleSignOut} className="text-coral font-bold text-sm">Шығу</button>
      </div>

      <h2 className="font-extrabold text-lg mb-4">Менің тапсырыстарым</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12 text-ink-soft bg-bg-gray rounded-2xl">
          <div className="text-3xl mb-2">🛒</div>
          <p>Әлі тапсырысыңыз жоқ.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-line rounded-2xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-sm">#{o.order_number}</div>
                  <div className="text-xs text-ink-soft">{new Date(o.created_at).toLocaleString("ru-RU")}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-deep-green">{fmt(Number(o.total))}</div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue/10 text-blue">
                    {STATUS_LABELS[o.status] || o.status}
                  </span>
                </div>
              </div>
              <div className="text-xs text-ink-soft">
                {o.items?.map((it) => it.name).join(", ")}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
