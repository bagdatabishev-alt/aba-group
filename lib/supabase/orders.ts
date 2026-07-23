import { createClient } from "./client";

export interface DbOrder {
  id: number;
  order_number: number;
  customer_name: string;
  phone: string;
  email: string | null;
  country: string | null;
  city: string;
  address: string;
  notes: string | null;
  items: { id: number; name: string; price: number; qty: number }[];
  total: number;
  delivery_fee: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export async function fetchOrders(): Promise<DbOrder[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as DbOrder[];
}

export async function updateOrderStatus(id: number, status: string) {
  const supabase = createClient();
  return supabase.from("orders").update({ status }).eq("id", id);
}

export async function updatePaymentStatus(id: number, payment_status: string) {
  const supabase = createClient();
  return supabase.from("orders").update({ payment_status }).eq("id", id);
}

export async function deleteOrder(id: number) {
  const supabase = createClient();
  return supabase.from("orders").delete().eq("id", id);
}
