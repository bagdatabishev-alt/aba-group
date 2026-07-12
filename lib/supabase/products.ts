import { createClient as createBrowserClient } from "./client";
import { Lang } from "../data/categories";

export interface DbProduct {
  id: number;
  category_id: string;
  sku: string | null;
  brand: string | null;
  price: number;
  old_price: number | null;
  stock: number;
  icon: string | null;
  image_url: string | null;
  name_kz: string;
  name_ru: string;
  name_en: string;
  desc_kz: string | null;
  desc_ru: string | null;
  desc_en: string | null;
  is_active: boolean;
  created_at: string;
}

// Shape used throughout the UI (matches the old static data shape)
export interface UiProduct {
  id: number;
  cat: string;
  icon: string;
  image: string | null;
  price: number;
  old: number | null;
  brand: string;
  sku: string;
  stock: number;
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
}

function toUiProduct(p: DbProduct): UiProduct {
  return {
    id: p.id,
    cat: p.category_id,
    icon: p.icon || "📦",
    image: p.image_url || null,
    price: Number(p.price),
    old: p.old_price ? Number(p.old_price) : null,
    brand: p.brand || "",
    sku: p.sku || "",
    stock: p.stock ?? 0,
    name: { kz: p.name_kz, ru: p.name_ru, en: p.name_en },
    desc: { kz: p.desc_kz || "", ru: p.desc_ru || "", en: p.desc_en || "" },
  };
}

export async function fetchProducts(): Promise<UiProduct[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("id", { ascending: true });
  if (error || !data) return [];
  return (data as DbProduct[]).map(toUiProduct);
}

export async function fetchProduct(id: number): Promise<UiProduct | null> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error || !data) return null;
  return toUiProduct(data as DbProduct);
}

// ===== Admin CRUD (requires authenticated Supabase session) =====

export interface ProductInput {
  category_id: string;
  sku: string;
  brand: string;
  price: number;
  old_price: number | null;
  stock: number;
  icon: string;
  image_url: string | null;
  name_kz: string;
  name_ru: string;
  name_en: string;
  desc_kz: string;
  desc_ru: string;
  desc_en: string;
}

export async function createProduct(input: ProductInput) {
  const supabase = createBrowserClient();
  return supabase.from("products").insert(input).select().single();
}

export async function updateProduct(id: number, input: ProductInput) {
  const supabase = createBrowserClient();
  return supabase.from("products").update(input).eq("id", id).select().single();
}

export async function deleteProduct(id: number) {
  const supabase = createBrowserClient();
  return supabase.from("products").delete().eq("id", id);
}

export async function fetchAllProductsForAdmin(): Promise<DbProduct[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
  if (error || !data) return [];
  return data as DbProduct[];
}

// ===== Image upload to Supabase Storage =====

export async function uploadProductImage(file: File): Promise<string | null> {
  const supabase = createBrowserClient();
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) return null;
  const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
  return data.publicUrl;
}
