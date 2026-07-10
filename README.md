# ABA Group — веб-сайт

Next.js 16 + TypeScript + Tailwind CSS + Supabase негізінде құрылған халықаралық бизнес платформасы.

## Жаңартылды: Admin панель енді нақты дерекқормен жұмыс істейді

Өнімдер енді Supabase дерекқорынан оқылады, `/admin` панелінен қосу/өңдеу/жоюға болады.

### Осы жаңартуды іске қосу үшін 3 қадам:

**1. Демо тауарларды дерекқорға қосу**

Supabase → SQL Editor → жаңа сұраныс → `supabase/seed_products.sql` файлының мазмұнын қойып, Run басыңыз. Бұл 15 демо тауарды `products` кестесіне қосады (кейін Admin-нан өзгертуге/жоюға болады).

**2. Admin аккаунт құру (нақты логин үшін)**

Supabase → **Authentication** → **Users** → **Add user** → email мен пароль енгізіп құрыңыз (мыс. өз email-іңіз бен күшті пароль). Осы email/пароль енді `/admin` бетінде қолданылады (ескі демо пароль жұмыс істемейді).

**3. Жаңа кодты GitHub-қа жіберу**

```powershell
cd aba-group
git add .
git commit -m "Add real admin panel with Supabase CRUD"
git push
```

Vercel GitHub-пен байланысты болғандықтан, push жасаған соң автоматты түрде қайта деплой болады (1-2 минут).

## Admin панель мүмкіндіктері

- `/admin` бетінде Supabase Auth арқылы қауіпсіз логин
- Dashboard-та барлық өнімдерді көру, статистика
- "+ Өнім қосу" — жаңа тауар қосу формасы (3 тілде атау/сипаттама, баға, қор, санат, SKU, бренд)
- Әр тауардың қасында "Өңдеу" және "Жою" батырмалары
- Барлық өзгерістер сайтта дереу көрінеді (Дүкен, Басты бет, Өнім беттері Supabase-тен нақты уақытта оқиды)

## Жалпы жоба құрылымы

- Басты бет, Біз туралы, Дүкен (іздеу+фильтр+категория), Өнім беті, Қызметтер, Байланыс, Checkout
- Себет, тапсырыс беру формасы — `/api/orders` арқылы Supabase-ке сақталады
- 3 тіл: Қазақша / Орысша / Ағылшынша
- `/api/contact` — байланыс формасы Supabase-ке сақталады
- `supabase/schema.sql` — толық дерекқор схемасы (products, orders, contact_requests, categories, customers + RLS саясаттары)

## Жергілікті жерде іске қосу

```bash
npm install
npm run dev
```

## Әлі істелмеген (келесі кезең)

- Тауар суреттерін жүктеу (қазір emoji-иконка орнына нақты фото)
- Kaspi QR / төлем интеграциясы
- Admin-нан тапсырыстар мен хабарламаларды көру беті
- SEO: sitemap.xml, robots.txt, Open Graph суреттері
- Terms of Service / Privacy Policy беттері

## Файл құрылымы

```
app/                       Беттер (App Router)
  admin/                    Admin панель (логин + dashboard CRUD)
  api/                      API маршруттары (orders, contact)
  product/[id]/             Динамикалық өнім беті
components/                 Navbar, Footer, ProductCard, CartDrawer, Logo
lib/
  data/categories.ts        Категориялар (статикалық)
  products/ProductsContext.tsx  Supabase-тен өнімдерді жүктейтін ортақ контекст
  i18n/                     Тіл сөздігі мен контексті
  cart/                     Себет контексті
  supabase/                 Supabase клиенттері, auth, products CRUD
supabase/schema.sql          Дерекқор схемасы
supabase/seed_products.sql   Демо тауарларды қосатын SQL
```
