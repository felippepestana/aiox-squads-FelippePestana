-- RÉGUA core schema (US-E1.2) — kept under regua/supabase to stay isolated
-- from the repo-root supabase project. Apply to the RÉGUA Supabase project.
--
-- Multi-tenant isolation: RLS per instituicao (an authenticated institution
-- user only sees its own carteiras). Minor students carry NO contact fields
-- by design (LGPD rule L1). Audit trail is append-only.

create schema if not exists regua;

create table regua.instituicao (
  id uuid primary key default gen_random_uuid(),
  razao_social text not null,
  cnpj text not null unique,
  criada_em timestamptz not null default now()
);

create table regua.carteira (
  id uuid primary key default gen_random_uuid(),
  instituicao_id uuid not null references regua.instituicao(id),
  nome text not null,
  success_fee_percent numeric(5,2) not null check (success_fee_percent between 0 and 49),
  criada_em timestamptz not null default now()
);

create table regua.contrato (
  id uuid primary key default gen_random_uuid(),
  carteira_id uuid not null references regua.carteira(id),
  contrato_externo_id text not null,
  tem_assinatura_devedor boolean, -- null = not yet confirmed by classificador
  tem_2_testemunhas boolean,
  tem_confissao_divida boolean not null default false,
  unique (carteira_id, contrato_externo_id)
);

create table regua.devedor (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references regua.contrato(id),
  nome text not null,
  cpf text not null,
  telefone text,
  email text,
  flag_superendividamento boolean not null default false, -- rule S1: leaves automated dunning
  flag_conflict_check boolean not null default false      -- rule S2: firm consumer-client hit
);

-- Minor student: data minimized (rule L1) — intentionally no contact columns.
create table regua.aluno (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references regua.contrato(id),
  nome text not null,
  serie_ou_curso text
);

create table regua.parcela (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references regua.contrato(id),
  competencia text not null check (competencia ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  anuidade_id text, -- groups installments for REsp 2.086.705/SP prescription rule
  vencimento date not null,
  valor_original numeric(12,2) not null check (valor_original > 0),
  status text not null default 'em_aberto'
    check (status in ('em_aberto','em_negociacao','acordada','paga','negativada','protestada','judicializada','prescrita')),
  -- Recomputed daily by the prescription job; queries that charge must filter on it (rule P1).
  prescrita boolean not null default false,
  unique (contrato_id, competencia)
);

create table regua.evento_cobranca (
  id uuid primary key default gen_random_uuid(),
  parcela_id uuid not null references regua.parcela(id),
  canal text not null check (canal in ('whatsapp','email','sms','voz','carta','portal')),
  ocorrido_em timestamptz not null default now(),
  resultado text not null,
  cpc boolean -- contato com pessoa certa
);

create table regua.trilha_auditoria (
  id bigint generated always as identity primary key,
  ocorrido_em timestamptz not null default now(),
  ator text not null,
  acao text not null,
  entidade text not null,
  entidade_id text,
  detalhes jsonb
);

-- Append-only audit trail (US-E7.2)
create or replace function regua.forbid_mutation() returns trigger as $$
begin
  raise exception 'trilha_auditoria is append-only';
end;
$$ language plpgsql;

create trigger trilha_auditoria_immutable
  before update or delete on regua.trilha_auditoria
  for each row execute function regua.forbid_mutation();

-- ── RLS: institution users see only their own data ─────────────────────────
-- Convention: the institution user's JWT carries app_metadata.instituicao_id;
-- backoffice staff use the service role (bypasses RLS).

alter table regua.instituicao enable row level security;
alter table regua.carteira enable row level security;
alter table regua.contrato enable row level security;
alter table regua.devedor enable row level security;
alter table regua.aluno enable row level security;
alter table regua.parcela enable row level security;
alter table regua.evento_cobranca enable row level security;
alter table regua.trilha_auditoria enable row level security;

create or replace function regua.current_instituicao_id() returns uuid as $$
  select nullif(auth.jwt() -> 'app_metadata' ->> 'instituicao_id', '')::uuid;
$$ language sql stable;

create policy instituicao_own on regua.instituicao
  for select using (id = regua.current_instituicao_id());

create policy carteira_own on regua.carteira
  for select using (instituicao_id = regua.current_instituicao_id());

create policy contrato_own on regua.contrato
  for select using (carteira_id in (
    select id from regua.carteira where instituicao_id = regua.current_instituicao_id()
  ));

create policy devedor_own on regua.devedor
  for select using (contrato_id in (
    select c.id from regua.contrato c
    join regua.carteira k on k.id = c.carteira_id
    where k.instituicao_id = regua.current_instituicao_id()
  ));

create policy aluno_own on regua.aluno
  for select using (contrato_id in (
    select c.id from regua.contrato c
    join regua.carteira k on k.id = c.carteira_id
    where k.instituicao_id = regua.current_instituicao_id()
  ));

create policy parcela_own on regua.parcela
  for select using (contrato_id in (
    select c.id from regua.contrato c
    join regua.carteira k on k.id = c.carteira_id
    where k.instituicao_id = regua.current_instituicao_id()
  ));

create policy evento_cobranca_own on regua.evento_cobranca
  for select using (parcela_id in (
    select p.id from regua.parcela p
    join regua.contrato c on c.id = p.contrato_id
    join regua.carteira k on k.id = c.carteira_id
    where k.instituicao_id = regua.current_instituicao_id()
  ));

-- Audit trail is never exposed to institution users (service role only).
create policy trilha_none on regua.trilha_auditoria for select using (false);
