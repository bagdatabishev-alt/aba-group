-- ABA Group — Supabase Database Schema
-- Supabase жобаңыздың SQL Editor бөліміне осы файлды толығымен қойып, "Run" басыңыз.

-- ============ CATEGORIES ============
create table if not exists categories (
  id text primary key,
  name_kz text not null,
  name_ru text not null,
  name_en text not null,
  icon text,
  created_at timestamptz default now()
);

-- ============ PRODUCTS ============
create table if not exists products (
  id bigint generated always as identity primary key,
  category_id text references categories(id),
  sku text unique,
  brand text,
  price numeric not null,
  old_price numeric,
  stock int default 0,
  icon text,
  image_url text,
  name_kz text not null,
  name_ru text not null,
  name_en text not null,
  desc_kz text,
  desc_ru text,
  desc_en text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============ ORDERS ============
create table if not exists orders (
  id bigint generated always as identity primary key,
  order_number int,
  customer_name text not null,
  phone text not null,
  email text,
  country text,
  city text not null,
  address text not null,
  notes text,
  items jsonb not null,
  total numeric not null,
  status text default 'new', -- new | confirmed | shipped | delivered | cancelled
  created_at timestamptz default now()
);

-- ============ CONTACT REQUESTS ============
create table if not exists contact_requests (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  email text,
  message text not null,
  status text default 'new', -- new | read | replied
  created_at timestamptz default now()
);

-- ============ CUSTOMERS (optional, for repeat orders) ============
create table if not exists customers (
  id bigint generated always as identity primary key,
  name text,
  phone text unique,
  email text,
  created_at timestamptz default now()
);

-- ============ ROW LEVEL SECURITY ============
-- Public (anon) can INSERT orders and contact requests, but cannot read/update/delete.
-- Only authenticated admin users (via Supabase Auth) can read/manage everything.

alter table products enable row level security;
alter table categories enable row level security;
alter table orders enable row level security;
alter table contact_requests enable row level security;
alter table customers enable row level security;

-- Anyone can view active products & categories (storefront)
create policy "Public can view active products" on products
  for select using (is_active = true);

create policy "Public can view categories" on categories
  for select using (true);

-- Anyone can submit an order or contact request
create policy "Public can insert orders" on orders
  for insert with check (true);

create policy "Public can insert contact requests" on contact_requests
  for insert with check (true);

-- Authenticated admin users get full access (requires Supabase Auth login)
create policy "Admins manage products" on products
  for all using (auth.role() = 'authenticated');

create policy "Admins manage categories" on categories
  for all using (auth.role() = 'authenticated');

create policy "Admins manage orders" on orders
  for all using (auth.role() = 'authenticated');

create policy "Admins manage contact requests" on contact_requests
  for all using (auth.role() = 'authenticated');

create policy "Admins manage customers" on customers
  for all using (auth.role() = 'authenticated');

-- ============ SEED CATEGORIES ============
insert into categories (id, name_kz, name_ru, name_en, icon) values
  ('electronics', 'Электроника', 'Электроника', 'Electronics', '💻'),
  ('home', 'Үй тауарлары', 'Товары для дома', 'Home Products', '🏠'),
  ('auto', 'Авто аксессуарлары', 'Автоаксессуары', 'Automotive', '🚗'),
  ('construction', 'Құрылыс материалдары', 'Стройматериалы', 'Construction', '🏗️'),
  ('security', 'Қауіпсіздік жүйелері', 'Системы безопасности', 'Security Systems', '🔒'),
  ('islamic', 'Исламдық өнімдер', 'Исламские товары', 'Islamic Products', '🕌'),
  ('other', 'Басқа санаттар', 'Другое', 'Other Products', '📦')
on conflict (id) do nothing;
