-- ABA Group — Site Settings кестесі
-- Supabase SQL Editor-де жаңа сұраныс ашып, осы файлдың барлығын қойып, "Run" басыңыз.

create table if not exists site_settings (
  id int primary key default 1,
  phone text default '+7 700 000 00 00',
  whatsapp text default '+7 700 000 00 00',
  telegram text default '@abagroup',
  email text default 'info@abagroup.kz',
  address text default 'Astana, Kazakhstan',
  hours text default 'Дс–Жм: 09:00–18:00',
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

alter table site_settings enable row level security;

create policy "Public can view settings" on site_settings
  for select using (true);

create policy "Admins manage settings" on site_settings
  for all using (auth.role() = 'authenticated');

insert into site_settings (id) values (1) on conflict (id) do nothing;
