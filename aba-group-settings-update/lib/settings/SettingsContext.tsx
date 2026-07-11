"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchSettings, SiteSettings } from "../supabase/settings";

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refresh: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setSettings(await fetchSettings());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
