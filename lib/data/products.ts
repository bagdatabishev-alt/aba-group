import { Lang } from "./categories";

export interface Product {
  id: number;
  cat: string;
  icon: string;
  price: number;
  old: number | null;
  brand: string;
  sku: string;
  stock: number;
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
}

export const PRODUCTS: Product[] = [
  { id: 1, cat: "electronics", icon: "🎧", price: 24900, old: 32000, brand: "SoundMax", sku: "EL-1001", stock: 18,
    name: { kz: "Сымсыз құлаққап Pro", ru: "Беспроводные наушники Pro", en: "Wireless Headphones Pro" },
    desc: { kz: "Шуды басатын, 30 сағат жұмыс уақыты бар сымсыз құлаққап.", ru: "Беспроводные наушники с шумоподавлением, 30 часов работы.", en: "Noise-cancelling wireless headphones with 30h battery life." } },
  { id: 2, cat: "electronics", icon: "⌚", price: 54900, old: null, brand: "TimeTech", sku: "EL-1002", stock: 9,
    name: { kz: "Смарт сағат Series 5", ru: "Смарт-часы Series 5", en: "Smart Watch Series 5" },
    desc: { kz: "Денсаулық мониторингі, GPS және 7 күндік батарея.", ru: "Мониторинг здоровья, GPS и 7 дней автономности.", en: "Health monitoring, GPS and 7-day battery." } },
  { id: 3, cat: "electronics", icon: "📷", price: 189000, old: 210000, brand: "ClearShot", sku: "EL-1003", stock: 4,
    name: { kz: "4K экшн камера", ru: "Экшн-камера 4K", en: "4K Action Camera" },
    desc: { kz: "Су өткізбейтін корпус, тұрақтандырғышы бар 4K бейне.", ru: "Водонепроницаемый корпус, стабилизация 4K видео.", en: "Waterproof housing with 4K video stabilization." } },
  { id: 4, cat: "home", icon: "🕯️", price: 8900, old: null, brand: "HomeStyle", sku: "HM-2001", stock: 40,
    name: { kz: "Хош иісті шам жинағы", ru: "Набор ароматических свечей", en: "Scented Candle Set" },
    desc: { kz: "Табиғи балауыздан жасалған 3 хош иісті шам жинағы.", ru: "Набор из 3 свечей из натурального воска.", en: "Set of 3 natural wax scented candles." } },
  { id: 5, cat: "home", icon: "🍽️", price: 34900, old: 41000, brand: "KitchenPro", sku: "HM-2002", stock: 15,
    name: { kz: "Керамикалық ыдыс жинағы", ru: "Набор керамической посуды", en: "Ceramic Dinnerware Set" },
    desc: { kz: "16 бөлімнен тұратын премиум керамикалық ыдыс жинағы.", ru: "Премиальный набор керамической посуды из 16 предметов.", en: "Premium 16-piece ceramic dinnerware set." } },
  { id: 6, cat: "home", icon: "🧺", price: 15900, old: null, brand: "HomeStyle", sku: "HM-2003", stock: 22,
    name: { kz: "Сақтауға арналған себет", ru: "Корзина для хранения", en: "Storage Basket" },
    desc: { kz: "Табиғи ротаннан тоқылған, интерьерге сай себет.", ru: "Плетёная корзина из натурального ротанга.", en: "Woven natural rattan storage basket." } },
  { id: 7, cat: "auto", icon: "🚙", price: 12900, old: null, brand: "AutoGuard", sku: "AT-3001", stock: 30,
    name: { kz: "Автокөлік ковриктер жинағы", ru: "Комплект автоковриков", en: "Car Floor Mat Set" },
    desc: { kz: "Су өткізбейтін, барлық маусымға жарамды коврик жинағы.", ru: "Водонепроницаемые всесезонные автоковрики.", en: "Waterproof all-season car floor mats." } },
  { id: 8, cat: "auto", icon: "🔋", price: 45900, old: 52000, brand: "PowerCell", sku: "AT-3002", stock: 11,
    name: { kz: "Автокөлік аккумуляторы 60Ah", ru: "Автомобильный аккумулятор 60Ah", en: "Car Battery 60Ah" },
    desc: { kz: "Ұзақ қызмет ету мерзімі бар сенімді аккумулятор.", ru: "Надёжный аккумулятор с долгим сроком службы.", en: "Reliable long-life 60Ah car battery." } },
  { id: 9, cat: "construction", icon: "🧱", price: 2900, old: null, brand: "BuildCo", sku: "CN-4001", stock: 500,
    name: { kz: "Керамикалық плитка (м²)", ru: "Керамическая плитка (м²)", en: "Ceramic Tile (per m²)" },
    desc: { kz: "Травертин тектес керамикалық плитка, интерьер мен экстерьерге.", ru: "Керамическая плитка под травертин.", en: "Travertine-style ceramic tile for interior and exterior." } },
  { id: 10, cat: "construction", icon: "🪟", price: 78000, old: 89000, brand: "BuildCo", sku: "CN-4002", stock: 6,
    name: { kz: "Металл-пластик терезе", ru: "Металлопластиковое окно", en: "PVC Window Unit" },
    desc: { kz: "Энергия үнемдейтін екі камералы терезе жүйесі.", ru: "Энергоэффективная двухкамерная оконная система.", en: "Energy-efficient double-chamber window system." } },
  { id: 11, cat: "security", icon: "📹", price: 32900, old: null, brand: "SecureView", sku: "SC-5001", stock: 14,
    name: { kz: "IP камера жинағы (4 дана)", ru: "Комплект IP-камер (4 шт)", en: "IP Camera Kit (4pcs)" },
    desc: { kz: "Түнде көру функциясы бар, қашықтан қадағалау камералары.", ru: "Камеры с ночным видением и удалённым доступом.", en: "Night-vision cameras with remote monitoring." } },
  { id: 12, cat: "security", icon: "🔐", price: 68900, old: 75000, brand: "LockX", sku: "SC-5002", stock: 8,
    name: { kz: "Смарт есік құлпы X10", ru: "Умный дверной замок X10", en: "Smart Door Lock X10" },
    desc: { kz: "Саусақ ізі мен қашықтан ашу мүмкіндігі бар смарт құлып.", ru: "Умный замок с отпечатком пальца и удалённым доступом.", en: "Fingerprint smart lock with remote access." } },
  { id: 13, cat: "islamic", icon: "📿", price: 6900, old: null, brand: "Barakah", sku: "IS-6001", stock: 60,
    name: { kz: "Тәсбих (ағаш)", ru: "Тасбих (дерево)", en: "Wooden Tasbih" },
    desc: { kz: "Табиғи ағаштан қолдан жасалған тәсбих.", ru: "Тасбих ручной работы из натурального дерева.", en: "Handcrafted natural wood tasbih." } },
  { id: 14, cat: "islamic", icon: "🕋", price: 19900, old: null, brand: "Barakah", sku: "IS-6002", stock: 25,
    name: { kz: "Намазхана кілемше жинағы", ru: "Набор молитвенных ковриков", en: "Prayer Mat Set" },
    desc: { kz: "Жұмсақ, тасымалдауға ыңғайлы намазхана кілемшесі.", ru: "Мягкий и компактный молитвенный коврик.", en: "Soft, portable prayer mat." } },
  { id: 15, cat: "other", icon: "🎒", price: 14900, old: 17900, brand: "Nomad", sku: "OT-7001", stock: 33,
    name: { kz: "Саяхат рюкзагы 40L", ru: "Туристический рюкзак 40L", en: "Travel Backpack 40L" },
    desc: { kz: "Су өткізбейтін, көп бөлімді саяхат рюкзагы.", ru: "Водонепроницаемый многосекционный рюкзак.", en: "Waterproof multi-compartment travel backpack." } },
];

export function getProduct(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
