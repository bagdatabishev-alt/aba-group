import { createClient } from "./client";

export interface SiteSettings {
  id: number;
  phone: string;
  whatsapp: string;
  telegram: string;
  email: string;
  address: string;
  hours: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  phone: "+7 700 000 00 00",
  whatsapp: "+7 700 000 00 00",
  telegram: "@abagroup",
  email: "info@abagroup.kz",
  address: "Astana, Kazakhstan",
  hours: "Дс–Жм: 09:00–18:00",
};

export async function fetchSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (error || !data) return DEFAULT_SETTINGS;
  return data as SiteSettings;
}

export async function updateSettings(input: Omit<SiteSettings, "id">) {
  const supabase = createClient();
  return supabase.from("site_settings").update(input).eq("id", 1);
}
