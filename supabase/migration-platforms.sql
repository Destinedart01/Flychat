-- Run this once in the Supabase SQL editor against your EXISTING project
-- to add Telegram/Instagram support without losing any existing flyers.
-- (If you're setting up a brand-new project instead, just run schema.sql
-- -- you don't need this file.)

-- New columns
alter table public.flyers
  add column if not exists platform text not null default 'whatsapp'
    check (platform in ('whatsapp', 'telegram', 'instagram'));

alter table public.flyers
  add column if not exists username text;

-- country_code/phone were required before; now only required when
-- platform = 'whatsapp', so the NOT NULL constraint has to go.
alter table public.flyers alter column country_code drop not null;
alter table public.flyers alter column phone drop not null;

-- Rename the old WhatsApp-specific column name now that it's shared
-- across platforms. Existing data is preserved by the rename.
alter table public.flyers rename column whatsapp_message to prefill_message;
