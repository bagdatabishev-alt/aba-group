-- ABA Group — Тауар суреттеріне арналған Storage bucket
-- Supabase SQL Editor-де жаңа сұраныс ашып, осы файлдың барлығын қойып, "Run" басыңыз.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Барлығы суреттерді көре алады (public)
create policy "Public read access for product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Тек кірген admin суреттерді жүктей алады
create policy "Admins can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admins can update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admins can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
