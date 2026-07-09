"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // DEMO ONLY: replace with Supabase Auth (supabase.auth.signInWithPassword)
    // once a real Supabase project is connected. See README for setup steps.
    if (password === "abagroup2026") {
      sessionStorage.setItem("aba_admin", "1");
      router.push("/admin/dashboard");
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-8 shadow-sm text-center">
        <div className="flex justify-center mb-4"><Logo size={48} /></div>
        <h1 className="text-xl font-extrabold mb-1">Admin Panel</h1>
        <p className="text-sm text-ink-soft mb-6">ABA Group басқару тақтасы</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Құпия сөз"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            className="px-4 py-3 rounded-xl border border-line text-sm text-center"
          />
          {error && <p className="text-xs text-coral font-semibold">Құпия сөз қате</p>}
          <button type="submit" className="bg-deep-green text-white rounded-full py-3 font-bold">
            Кіру
          </button>
        </form>
        <p className="text-xs text-ink-soft mt-5">Демо құпия сөз: abagroup2026</p>
      </div>
    </div>
  );
}
