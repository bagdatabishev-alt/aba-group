# ABA Group — веб-сайт

Next.js 16 + TypeScript + Tailwind CSS + Supabase негізінде құрылған халықаралық бизнес платформасы.

## Не дайын

- Басты бет, Біз туралы, Дүкен (іздеу+фильтр+категория), Өнім беті, Қызметтер, Байланыс, Checkout
- Себет (қосу/өшіру/саны), тапсырыс беру формасы
- 3 тіл: Қазақша / Орысша / Ағылшынша (нақты ауысады)
- `/api/orders` және `/api/contact` — тапсырыс/хабарлама API маршруттары
- `/admin` — негізгі демо-панель (өнімдер тізімі, статистика)
- `supabase/schema.sql` — толық дерекқор схемасы (products, orders, contact_requests, categories, customers + RLS саясаттары)

## Қазір қалай жұмыс істейді

Сайт **дерекқорсыз да толық жұмыс істейді** — өнімдер `lib/data/products.ts` файлында сақталған, тапсырыстар/хабарламалар консольге лог болады. Бұл дегеніміз: сайтты дереу Vercel-ге жариялап, көрсетуге болады. Бірақ тапсырыстар сақталмайды (сервер қайта іске қосылса жоғалады) және admin панель әлі демо-режимде.

## Supabase қосу (production үшін міндетті)

1. supabase.com сайтынан жаңа жоба құрыңыз (мыс. `aba-group`).
2. **SQL Editor** бөліміне өтіп, `supabase/schema.sql` файлының мазмұнын толығымен қойып, **Run** басыңыз.
3. **Settings → API** бөлімінен `Project URL` және `anon public key` көшіріп алыңыз.
4. Жоба түбіріндегі `.env.example` файлын `.env.local` деп көшіріп, мәндерін қойыңыз:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
   ```
5. **Authentication → Users** бөлімінен admin үшін бір пайдаланушы қосыңыз (email+password) — бұл нақты admin логині болады. `/admin` бетін кейін осыған ауыстыру керек (қазір демо құпия сөзбен: `abagroup2026`).

Осыдан кейін `/api/orders` мен `/api/contact` автоматты түрде Supabase-ке жаза бастайды (кодта дайын, тек env керек).

## Жергілікті жерде іске қосу

```bash
npm install
npm run dev
```

Сайт: http://localhost:3000

## GitHub + Vercel-ге жариялау (сіздің TAKSI GO жұмыс тәртібіңізге сай)

```powershell
cd aba-group
git init
git add .
git commit -m "ABA Group website - initial version"
git branch -M main
git remote add origin https://github.com/<сіздің-username>/aba-group.git
git push -u origin main
```

Содан кейін vercel.com → New Project → GitHub репозиторийін таңдаңыз → Environment Variables бөліміне NEXT_PUBLIC_SUPABASE_URL мен NEXT_PUBLIC_SUPABASE_ANON_KEY қосыңыз → Deploy.

## Әлі істелмеген (келесі кезең)

- Admin панельдегі нақты Supabase Auth логині (қазір демо парольмен)
- Admin-нан өнім қосу/өңдеу/жою формалары (қазір тек оқу режимі)
- Kaspi QR / төлем интеграциясы
- Нақты өнім суреттері (қазір emoji-иконкалар орнына)
- SEO: sitemap.xml, robots.txt, Open Graph суреттері
- Terms of Service / Privacy Policy беттері

## Файл құрылымы

```
app/                  Беттер (App Router)
  admin/               Admin панель
  api/                 API маршруттары (orders, contact)
  product/[id]/        Динамикалық өнім беті
components/            Navbar, Footer, ProductCard, CartDrawer, Logo
lib/
  data/                Категориялар мен өнімдер (статикалық деректер)
  i18n/                Тіл сөздігі мен контексті
  cart/                Себет контексті
  supabase/             Supabase клиенттері (browser + server)
supabase/schema.sql     Дерекқор схемасы
```
