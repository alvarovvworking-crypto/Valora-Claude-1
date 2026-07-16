-- =========================================================
-- VALORA — Esquema de base de datos para Supabase
-- Cómo usarlo: Supabase Dashboard -> SQL Editor -> pega todo
-- este archivo -> Run. Se puede ejecutar de una sola vez.
-- =========================================================

create extension if not exists "uuid-ossp";

-- CLIENTES -------------------------------------------------
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  company text,
  notes text,
  created_at timestamptz default now() not null
);

alter table clients enable row level security;

create policy "clients_select_own" on clients
  for select using (auth.uid() = user_id);
create policy "clients_insert_own" on clients
  for insert with check (auth.uid() = user_id);
create policy "clients_update_own" on clients
  for update using (auth.uid() = user_id);
create policy "clients_delete_own" on clients
  for delete using (auth.uid() = user_id);

-- VENTAS / PRESUPUESTOS ------------------------------------
create table if not exists sales (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  client_name text not null,
  project_name text not null,
  service_type text not null,
  hours numeric not null default 0,
  base_rate numeric not null default 0,
  final_rate numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'borrador'
    check (status in ('borrador','enviado','aceptado','rechazado','cobrado')),
  created_at timestamptz default now() not null
);

alter table sales enable row level security;

create policy "sales_select_own" on sales
  for select using (auth.uid() = user_id);
create policy "sales_insert_own" on sales
  for insert with check (auth.uid() = user_id);
create policy "sales_update_own" on sales
  for update using (auth.uid() = user_id);
create policy "sales_delete_own" on sales
  for delete using (auth.uid() = user_id);

-- AJUSTES DE USUARIO ----------------------------------------
create table if not exists settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  business_name text,
  currency text default 'EUR',
  default_rates jsonb
);

alter table settings enable row level security;

create policy "settings_select_own" on settings
  for select using (auth.uid() = user_id);
create policy "settings_insert_own" on settings
  for insert with check (auth.uid() = user_id);
create policy "settings_update_own" on settings
  for update using (auth.uid() = user_id);

-- Índices útiles ---------------------------------------------
create index if not exists idx_clients_user on clients(user_id);
create index if not exists idx_sales_user on sales(user_id);
create index if not exists idx_sales_client on sales(client_id);
