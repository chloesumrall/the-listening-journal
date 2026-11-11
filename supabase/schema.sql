-- The Listening Journal — database schema + security rules
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run.
-- Safe to re-run (uses "if not exists" / "or replace" and drops policies first).

-- ---------------------------------------------------------------------------
-- PROFILES: one row per user, linked to the built-in auth.users table
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  handle       text unique not null,
  display_name text,
  created_at   timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "profiles readable by authenticated" on public.profiles;
create policy "profiles readable by authenticated"
  on public.profiles for select to authenticated using (true);

drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- FRIENDSHIPS: one row per relationship (a request from requester to addressee)
-- ---------------------------------------------------------------------------
create table if not exists public.friendships (
  id           uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status       text not null default 'pending' check (status in ('pending','accepted')),
  created_at   timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);
alter table public.friendships enable row level security;

-- Security-definer helper: are these two users accepted friends?
create or replace function public.are_friends(a uuid, b uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and ( (f.requester_id = a and f.addressee_id = b)
         or (f.requester_id = b and f.addressee_id = a) )
  );
$$;

drop policy if exists "see own friendships" on public.friendships;
create policy "see own friendships"
  on public.friendships for select to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

drop policy if exists "send friend request" on public.friendships;
create policy "send friend request"
  on public.friendships for insert to authenticated
  with check (auth.uid() = requester_id);

drop policy if exists "respond to friend request" on public.friendships;
create policy "respond to friend request"
  on public.friendships for update to authenticated
  using (auth.uid() = addressee_id or auth.uid() = requester_id);

drop policy if exists "remove friendship" on public.friendships;
create policy "remove friendship"
  on public.friendships for delete to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- ---------------------------------------------------------------------------
-- ENTRIES: one reflection per user per song, with a visibility flag
-- ---------------------------------------------------------------------------
create table if not exists public.entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  song_id      text not null,
  mood         text default '',
  song_type    text default '',
  where_when   text default '',
  fav_line     text default '',
  bridge_line  text default '',
  relates      text default '',
  colors       text[] not null default '{}',
  overall      int not null default 0,
  replay       int not null default 0,
  bridge_power int not null default 0,
  visibility   text not null default 'private' check (visibility in ('private','friends')),
  updated_at   timestamptz not null default now(),
  unique (user_id, song_id)
);
alter table public.entries enable row level security;

-- Owner can do anything with their own rows
drop policy if exists "owner manages own entries" on public.entries;
create policy "owner manages own entries"
  on public.entries for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Accepted friends can READ entries the owner marked 'friends'
drop policy if exists "friends read shared entries" on public.entries;
create policy "friends read shared entries"
  on public.entries for select to authenticated
  using (visibility = 'friends' and public.are_friends(auth.uid(), user_id));

-- Helpful indexes
create index if not exists entries_user_idx on public.entries (user_id);
create index if not exists entries_song_idx on public.entries (song_id);
create index if not exists friendships_addressee_idx on public.friendships (addressee_id);
