-- Schema de persistência do Prefeitura Digital.
-- Armazena os artefatos gerados (ETP/TR/PB, atos do Diário Oficial, etc.)
-- com isolamento por usuário via RLS.

create table if not exists public.artefatos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Mantenha em sincronia com MODULOS_VALIDOS em src/lib/artefatos.ts.
  modulo text not null check (modulo in ('contratacoes', 'diario-oficial', 'orcamento', 'rh', 'transparencia')),
  tipo text not null,          -- ex.: ETP, TR, PB, portaria, decreto
  titulo text not null,
  conteudo text not null,      -- documento em Markdown
  degraded boolean not null default false, -- gerado em modo rascunho (sem IA)
  metadados jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artefatos_user_id_idx on public.artefatos (user_id, created_at desc);

-- Row Level Security: cada usuário só enxerga e manipula os próprios artefatos.
alter table public.artefatos enable row level security;

drop policy if exists "artefatos_select_own" on public.artefatos;
create policy "artefatos_select_own" on public.artefatos
  for select using (auth.uid() = user_id);

drop policy if exists "artefatos_insert_own" on public.artefatos;
create policy "artefatos_insert_own" on public.artefatos
  for insert with check (auth.uid() = user_id);

drop policy if exists "artefatos_update_own" on public.artefatos;
create policy "artefatos_update_own" on public.artefatos
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "artefatos_delete_own" on public.artefatos;
create policy "artefatos_delete_own" on public.artefatos
  for delete using (auth.uid() = user_id);

-- Mantém updated_at coerente em updates.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists artefatos_set_updated_at on public.artefatos;
create trigger artefatos_set_updated_at
  before update on public.artefatos
  for each row execute function public.set_updated_at();
