import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ЕСКЕРТУ: бұл файл тек серверде (API routes) қолданылады.
// SUPABASE_SERVICE_ROLE_KEY ешқашан браузерге жіберілмейді және NEXT_PUBLIC_ префиксі жоқ.
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
