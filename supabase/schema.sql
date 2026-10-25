-- Fresh-install schema. If you already ran an earlier version of this
-- file against a live project, use supabase/migration-platforms.sql
-- instead -- running this one again won't retroactively add the new
-- columns to an existing table.

create extension if not exists pgcrypto;

create table if not exists public.flyers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  image_path text not null,
  business_name text,

  -- Which platform this flyer's CTA button points to.
  platform text not null default 'whatsapp' check (platform in ('whatsapp', 'telegram', 'instagram')),

  -- WhatsApp uses country_code + phone. Telegram and Instagram use
  -- username instead (see README for why -- phone-based Telegram links
  -- aren't reliable, and Instagram has no phone-based option at all).
  -- All three are nullable since only the relevant pair/field is set
  -- depending on `platform`.
  country_code text,
  phone text,
  username text,

  -- Pre-filled message shown when the chat opens. Supported by WhatsApp
  -- and Telegram, not supported by Instagram's ig.me links.
  prefill_message text,

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

alter table public.flyers enable row level security;

create policy "Public can view active flyers"
  on public.flyers for select
  using (status = 'active');

create or replace function increment_view(flyer_slug text)
returns void as $$
  update public.flyers set view_count = view_count + 1 where slug = flyer_slug;
$$ language sql;

create or replace function increment_click(flyer_slug text)
returns void as $$
  update public.flyers set click_count = click_count + 1 where slug = flyer_slug;
$$ language sql;
