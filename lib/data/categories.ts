export type Lang = "kz" | "ru" | "en";

export interface Category {
  id: string;
  icon: string;
  name: Record<Lang, string>;
}

export const CATEGORIES: Category[] = [
  { id: "electronics", icon: "💻", name: { kz: "Электроника", ru: "Электроника", en: "Electronics" } },
  { id: "home", icon: "🏠", name: { kz: "Үй тауарлары", ru: "Товары для дома", en: "Home Products" } },
  { id: "auto", icon: "🚗", name: { kz: "Авто аксессуарлары", ru: "Автоаксессуары", en: "Automotive" } },
  { id: "construction", icon: "🏗️", name: { kz: "Құрылыс материалдары", ru: "Стройматериалы", en: "Construction" } },
  { id: "security", icon: "🔒", name: { kz: "Қауіпсіздік жүйелері", ru: "Системы безопасности", en: "Security Systems" } },
  { id: "islamic", icon: "🕌", name: { kz: "Исламдық өнімдер", ru: "Исламские товары", en: "Islamic Products" } },
  { id: "other", icon: "📦", name: { kz: "Басқа санаттар", ru: "Другое", en: "Other Products" } },
];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
