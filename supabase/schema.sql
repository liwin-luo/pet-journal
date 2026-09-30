-- PetPics Supabase Schema（MVP）
-- 在 Supabase SQL Editor 执行本文件；连接信息填入 .env.local
-- 说明：user_id = Auth.js JWT sub（Google/邮箱登录用户标识）。
-- MVP 通过 SERVICE_ROLE 在服务端读写（绕过 RLS）；数据访问只发生在服务端 API。

create table if not exists pets (
  id text primary key,
  user_id text not null,
  name text default '',
  breed text default '',
  dog boolean default true,
  coat text default '',
  tags jsonb default '[]',
  bday text,
  profile_done boolean default false,
  has_anchor boolean default false,
  anchor_image text,
  items jsonb default '{"toy":false,"bandana":false,"blanket":false}',
  collections int default 0,
  created_at timestamptz default now()
);

create table if not exists orders (
  id text primary key,
  user_id text not null,
  pet_id text,
  tier text,
  amount numeric,
  status text default 'paid',
  images jsonb default '[]',
  created_at timestamptz default now()
);

create table if not exists diary (
  id text primary key,
  user_id text not null,
  pet_id text,
  image text,
  text_content text,
  entry_date timestamptz default now()
);

create index if not exists pets_user on pets(user_id);
create index if not exists orders_user on orders(user_id);
create index if not exists diary_user on diary(user_id);

-- v1 规范化预留：用户表（当前 JWT 策略不需要，接入 Supabase Auth 时启用）
-- create table if not exists users (
--   id uuid primary key, email text unique, name text, created_at timestamptz default now()
-- );
