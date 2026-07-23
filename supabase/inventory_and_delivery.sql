-- ABA Group — Авто-қойма азайту + жеткізу тарифі
-- Supabase SQL Editor-де жаңа сұраныс ашып, осы файлдың барлығын қойып, "Run" басыңыз.

-- 1) Тапсырыстарға жеткізу ақысын сақтайтын баған
alter table orders
  add column if not exists delivery_fee numeric default 0;

-- 2) Баптауларға жеткізу тарифтерін қосу
alter table site_settings
  add column if not exists delivery_fee_local numeric default 0;
alter table site_settings
  add column if not exists delivery_fee_other numeric default 0;
alter table site_settings
  add column if not exists delivery_free_threshold numeric default 0;
alter table site_settings
  add column if not exists local_city text default 'Астана';

-- 3) Тапсырыс жасалғанда тауар қорын автоматты азайтатын функция
-- (security definer — RLS-ті айналып өтеді, себебі public/anon тапсырыс бере алады,
--  бірақ өнім кестесін тікелей өзгерте алмайды)
create or replace function decrement_product_stock(items jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item record;
begin
  for item in select * from jsonb_to_recordset(items) as x(id bigint, qty int)
  loop
    update products
    set stock = greatest(stock - item.qty, 0)
    where id = item.id;
  end loop;
end;
$$;

grant execute on function decrement_product_stock(jsonb) to anon, authenticated;
