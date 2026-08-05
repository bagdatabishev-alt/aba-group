-- ABA Group — RLS қауіпсіздігін түзету + Тапсырысты бақылау функциясы
-- Supabase SQL Editor-де жаңа сұраныс ашып, осы файлдың барлығын қойып, "Run" басыңыз.

-- 1) ҚАУІПСІЗДІК ТҮЗЕТУІ: decrement_product_stock функциясын
-- browser-ден (anon кілтпен) тікелей шақыруға тыйым салу.
-- Бұдан былай тек сервер жағы (service role) арқылы ғана шақырылады.
revoke execute on function decrement_product_stock(jsonb) from anon, authenticated;

-- 2) Клиенттің тапсырысын телефон + тапсырыс нөмірі арқылы қауіпсіз іздеу
-- (толық orders кестесін ашпай, тек сәйкес келген жалғыз тапсырысты қайтарады)
create or replace function get_order_for_tracking(p_order_number int, p_phone text)
returns table (
  order_number int,
  customer_name text,
  city text,
  address text,
  items jsonb,
  total numeric,
  delivery_fee numeric,
  status text,
  payment_status text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select o.order_number, o.customer_name, o.city, o.address, o.items, o.total,
         o.delivery_fee, o.status, o.payment_status, o.created_at
  from orders o
  where o.order_number = p_order_number
    and regexp_replace(o.phone, '[^0-9]', '', 'g') = regexp_replace(p_phone, '[^0-9]', '', 'g');
end;
$$;

grant execute on function get_order_for_tracking(int, text) to anon, authenticated;
