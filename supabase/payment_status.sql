-- ABA Group — Тапсырыстарға төлем статусын қосу
-- Supabase SQL Editor-де жаңа сұраныс ашып, осы файлдың барлығын қойып, "Run" басыңыз.

alter table orders
  add column if not exists payment_status text default 'unpaid';
-- Мәндер: unpaid (төленбеген), paid (төленген), refunded (қайтарылған)
