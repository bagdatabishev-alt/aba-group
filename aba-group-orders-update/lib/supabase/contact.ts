import { createClient } from "./client";

export interface DbContactRequest {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  status: string;
  created_at: string;
}

export async function fetchContactRequests(): Promise<DbContactRequest[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as DbContactRequest[];
}

export async function updateContactStatus(id: number, status: string) {
  const supabase = createClient();
  return supabase.from("contact_requests").update({ status }).eq("id", id);
}

export async function deleteContactRequest(id: number) {
  const supabase = createClient();
  return supabase.from("contact_requests").delete().eq("id", id);
}
