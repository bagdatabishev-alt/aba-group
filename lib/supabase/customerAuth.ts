import { createClient } from "./client";

export interface CustomerProfile {
  id: number;
  user_id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}

export async function customerSignUp(email: string, password: string, name: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) return { error };
  await supabase.from("customers").insert({ user_id: data.user.id, name, email });
  return { error: null };
}

export async function customerSignIn(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function customerSignOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}

export async function getCurrentCustomerSession() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function fetchMyProfile(): Promise<CustomerProfile | null> {
  const supabase = createClient();
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return null;
  const { data } = await supabase.from("customers").select("*").eq("user_id", sessionData.session.user.id).single();
  return (data as CustomerProfile) || null;
}

export async function updateMyProfile(input: { name?: string; phone?: string; avatar_url?: string }) {
  const supabase = createClient();
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return { error: "Not logged in" };
  return supabase.from("customers").update(input).eq("user_id", sessionData.session.user.id);
}

export async function uploadAvatar(file: File, userId: string): Promise<string | null> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("avatars").upload(fileName, file, { cacheControl: "3600", upsert: true });
  if (error) return null;
  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
  return data.publicUrl;
}

export interface MyOrder {
  id: number;
  order_number: number;
  items: { id: number; name: string; price: number; qty: number }[];
  total: number;
  delivery_fee: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export async function fetchMyOrders(): Promise<MyOrder[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as MyOrder[];
}
