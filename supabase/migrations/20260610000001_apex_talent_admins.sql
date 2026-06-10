-- Apex-Talent — admin registration (cadastro do administrador): PF/PJ.
-- Written only by the service-role server. RLS is deny-by-default for
-- anonymous/auth clients (no policy); the service-role key bypasses RLS.

create table if not exists public.apex_talent_admins (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.apex_talent_orgs (id) on delete set null,
  tipo_pessoa text not null check (tipo_pessoa in ('PF','PJ')),
  -- Pessoa Física
  nome_completo text,
  cpf text,
  -- Pessoa Jurídica
  razao_social text,
  nome_fantasia text,
  cnpj text,
  responsavel_nome text,
  -- Comum
  email text not null,
  telefone text,
  created_at timestamptz not null default now()
);

create unique index if not exists apex_talent_admins_email_key
  on public.apex_talent_admins (lower(email));
create unique index if not exists apex_talent_admins_cpf_key
  on public.apex_talent_admins (cpf) where cpf is not null;
create unique index if not exists apex_talent_admins_cnpj_key
  on public.apex_talent_admins (cnpj) where cnpj is not null;

alter table public.apex_talent_admins enable row level security;
-- No public policy on purpose: only the service-role server writes/reads.
