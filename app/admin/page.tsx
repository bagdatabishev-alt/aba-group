"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { signIn } from "@/lib/supabase/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: authError } = await signIn(email, password);
    setLoading(false);
    if (authError) {
      setError("Email немесе құпия сөз қате");
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-8 shadow-sm text-center">
        <div className="flex justify-center mb-4"><Logo size={48} /></div>
        <h1 className="text-xl font-extrabold mb-1">Admin Panel</h1>
        <p className="text-sm text-ink-soft mb-6">ABA Group басқару тақтасы</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className="px-4 py-3 rounded-xl border border-line text-sm text-center"
          />
          <input
            type="password"
            placeholder="Құпия сөз"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            className="px-4 py-3 rounded-xl border border-line text-sm text-center"
          />
          {error && <p className="text-xs text-coral font-semibold">{error}</p>}
          <button disabled={loading} type="submit" className="bg-deep-green text-white rounded-full py-3 font-bold disabled:opacity-50">
            {loading ? "..." : "Кіру"}
          </button>
        </form>
        <p className="text-xs text-ink-soft mt-5">Supabase Authentication бөлімінде құрылған admin аккаунтпен кіріңіз.</p>
      </div>
    </div>
  );
}
