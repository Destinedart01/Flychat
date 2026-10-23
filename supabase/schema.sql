-- Run this once in the Supabase SQL editor for your project.

create extension if not exists pgcrypto;

create table if not exists public.flyers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  image_path text not null,
  business_name text,
  country_code text not null,
  phone text not null,
  whatsapp_message text,
  manage_token text unique not null,
  status text not null default 'active' check (status in ('active', 'flagged', 'removed')),
  view_count integer not null default 0,
  click_count integer not null default 0,
  reports_count integer not null default 0,
  creator_ip text,
  created_at timestamptz not null default now()
);

create index if not exists flyers_slug_idx on public.flyers (slug);
create index if not exists flyers_manage_token_idx on public.flyers (manage_token);
create index if not exists flyers_creator_ip_created_idx on public.flyers (creator_ip, created_at);

-- Row Level Security: the app talks to this table using the service role key
-- (which bypasses RLS), so these policies only matter if you ever expose
-- the anon key to the browser for direct reads. Keep them tight regardless.
alter table public.flyers enable row level security;

create policy "Public can view active flyers"
  on public.flyers for select
  using (status = 'active');

-- Atomic counters, called via rpc() so concurrent views/clicks don't race.
create or replace function increment_view(flyer_slug text)
returns void as $$
  update public.flyers set view_count = view_count + 1 where slug = flyer_slug;
$$ language sql;

create or replace function increment_click(flyer_slug text)
returns void as $$
  update public.flyers set click_count = click_count + 1 where slug = flyer_slug;
$$ language sql;

-- After running this file:
-- 1. Go to Storage -> Create a new bucket called "flyers", set it to Public.
-- 2. Leave the bucket's upload policy closed (no public insert policy) --
--    all uploads go through the server using the service role key, which
--    bypasses storage RLS too. This stops people uploading files directly
--    and bypassing validation/compression/EXIF stripping.
