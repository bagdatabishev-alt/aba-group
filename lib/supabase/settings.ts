import { createClient } from "./client";

export interface SiteSettings {
  id: number;
  phone: string;
  whatsapp: string;
  telegram: string;
  email: string;
  address: string;
  hours: string;
  delivery_fee_local: number;
  delivery_fee_other: number;
  delivery_free_threshold: number;
  local_city: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  phone: "+7 700 000 00 00",
  whatsapp: "+7 700 000 00 00",
  telegram: "@abagroup",
  email: "info@abagroup.kz",
  address: "Astana, Kazakhstan",
  hours: "Дс–Жм: 09:00–18:00",
  delivery_fee_local: 0,
  delivery_fee_other: 0,
  delivery_free_threshold: 0,
  local_city: "Астана",
};

export async function fetchSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (error || !data) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...data } as SiteSettings;
}

export async function updateSettings(input: Omit<SiteSettings, "id">) {
  const supabase = createClient();
  return supabase.from("site_settings").update(input).eq("id", 1);
}

export function calculateDeliveryFee(settings: SiteSettings, city: string, subtotal: number): number {
  if (settings.delivery_free_threshold > 0 && subtotal >= settings.delivery_free_threshold) return 0;
  const isLocal = city.trim().toLowerCase().includes(settings.local_city.trim().toLowerCase());
  return isLocal ? settings.delivery_fee_local : settings.delivery_fee_other;
}
