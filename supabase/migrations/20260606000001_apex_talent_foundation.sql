-- Apex-Talent — foundation (global) + talent-compass (flagship) schema.
-- Isolated by an `apex_talent_` table-name prefix inside the public schema so it
-- is served by the Data API (PostgREST) without colliding with other apps that
-- share this project. Multi-tenant, org-scoped Row Level Security.
-- Principle encoded in the schema: behavioral profiles are context_only by
-- default and personality never carries score weight.

-- ─────────────────────────────────────────────────────────────────────────────
-- Foundation (reusable by every Apex-Talent module)
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.apex_talent_orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.apex_talent_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  org_id uuid references public.apex_talent_orgs (id) on delete set null,
  full_name text,
  role text not null default 'member', -- member | recruiter | admin
  created_at timestamptz not null default now()
);

create table if not exists public.apex_talent_departments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.apex_talent_orgs (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- Helper: current user's org. SECURITY DEFINER avoids RLS recursion on profiles.
create or replace function public.apex_talent_current_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from public.apex_talent_profiles where id = auth.uid()
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- talent-compass (flagship) domain
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.apex_talent_jobs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.apex_talent_orgs (id) on delete cascade,
  title text not null,
  status text not null default 'open', -- open | screening | interviewing | closed
  performance_objectives jsonb not null default '[]'::jsonb,
  competencies jsonb not null default '{}'::jsonb,
  scorecard_weights jsonb not null default
    '{"technical":40,"behavioral":35,"motivation":25,"behavioral_style":0}'::jsonb,
  created_by uuid references public.apex_talent_profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.apex_talent_candidates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.apex_talent_orgs (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  resume_path text, -- Storage path in the 'apex-resumes' bucket
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.apex_talent_applications (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.apex_talent_orgs (id) on delete cascade,
  job_id uuid not null references public.apex_talent_jobs (id) on delete cascade,
  candidate_id uuid not null references public.apex_talent_candidates (id) on delete cascade,
  stage text not null default 'screening', -- screening | interview | scoring | decision
  status text not null default 'active',   -- active | advanced | rejected | hired
  created_at timestamptz not null default now()
);

create table if not exists public.apex_talent_interviews (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.apex_talent_orgs (id) on delete cascade,
  application_id uuid not null references public.apex_talent_applications (id) on delete cascade,
  guide jsonb not null default '{}'::jsonb,
  status text not null default 'pending', -- pending | in_progress | completed
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.apex_talent_interview_responses (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.apex_talent_orgs (id) on delete cascade,
  interview_id uuid not null references public.apex_talent_interviews (id) on delete cascade,
  competency text not null,
  question text not null,
  answer text,
  star jsonb,         -- {situation, task, action, result}
  bars_rating int,    -- 1-5
  evidence text,
  created_at timestamptz not null default now()
);

create table if not exists public.apex_talent_scorecards (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.apex_talent_orgs (id) on delete cascade,
  application_id uuid not null references public.apex_talent_applications (id) on delete cascade,
  total_score int,
  grade text,
  category_scores jsonb not null default '{}'::jsonb,
  recommendation text,
  fairness_status text not null default 'pending', -- pending | pass | veto
  created_at timestamptz not null default now()
);

-- Behavioral context. context_only is true by design: personality is never a
-- scored selection factor. Kept separate from scorecards on purpose.
create table if not exists public.apex_talent_behavioral_profiles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.apex_talent_orgs (id) on delete cascade,
  candidate_id uuid not null references public.apex_talent_candidates (id) on delete cascade,
  disc jsonb,
  enneagram jsonb,
  big_five jsonb,
  context_only boolean not null default true,
  consent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.apex_talent_fairness_audits (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.apex_talent_orgs (id) on delete cascade,
  scorecard_id uuid not null references public.apex_talent_scorecards (id) on delete cascade,
  verdict text not null default 'pending', -- pending | pass | veto
  checks jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

-- Minutas (printable documents) rendered from the records above.
create table if not exists public.apex_talent_documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.apex_talent_orgs (id) on delete cascade,
  entity_type text not null,  -- candidate | application | interview | scorecard
  entity_id uuid,
  template_key text not null, -- convocacao | parecer | proposta | lgpd | devolutiva
  data jsonb not null default '{}'::jsonb,
  rendered_html text,
  storage_path text,          -- optional path in the 'apex-documents' bucket
  status text not null default 'draft', -- draft | issued
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_at_jobs_org on public.apex_talent_jobs (org_id);
create index if not exists idx_at_candidates_org on public.apex_talent_candidates (org_id);
create index if not exists idx_at_applications_job on public.apex_talent_applications (job_id);
create index if not exists idx_at_interviews_application on public.apex_talent_interviews (application_id);
create index if not exists idx_at_responses_interview on public.apex_talent_interview_responses (interview_id);
create index if not exists idx_at_scorecards_application on public.apex_talent_scorecards (application_id);
create index if not exists idx_at_documents_entity on public.apex_talent_documents (entity_type, entity_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security — org-scoped on every table
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.apex_talent_orgs                enable row level security;
alter table public.apex_talent_profiles            enable row level security;
alter table public.apex_talent_departments         enable row level security;
alter table public.apex_talent_jobs                enable row level security;
alter table public.apex_talent_candidates          enable row level security;
alter table public.apex_talent_applications        enable row level security;
alter table public.apex_talent_interviews          enable row level security;
alter table public.apex_talent_interview_responses enable row level security;
alter table public.apex_talent_scorecards          enable row level security;
alter table public.apex_talent_behavioral_profiles enable row level security;
alter table public.apex_talent_fairness_audits     enable row level security;
alter table public.apex_talent_documents           enable row level security;

-- profiles: a user sees their own profile and profiles within their org
drop policy if exists apex_talent_profiles_self_select on public.apex_talent_profiles;
create policy apex_talent_profiles_self_select on public.apex_talent_profiles
  for select using (id = auth.uid() or org_id = public.apex_talent_current_org_id());
drop policy if exists apex_talent_profiles_self_update on public.apex_talent_profiles;
create policy apex_talent_profiles_self_update on public.apex_talent_profiles
  for update using (id = auth.uid());

-- orgs: members can read their own org
drop policy if exists apex_talent_orgs_member_select on public.apex_talent_orgs;
create policy apex_talent_orgs_member_select on public.apex_talent_orgs
  for select using (id = public.apex_talent_current_org_id());

-- Generic org-scoped policy applied to every domain table.
do $$
declare t text;
begin
  foreach t in array array[
    'apex_talent_departments','apex_talent_jobs','apex_talent_candidates',
    'apex_talent_applications','apex_talent_interviews','apex_talent_interview_responses',
    'apex_talent_scorecards','apex_talent_behavioral_profiles',
    'apex_talent_fairness_audits','apex_talent_documents'
  ]
  loop
    execute format('drop policy if exists %1$s_org_all on public.%1$s;', t);
    execute format(
      'create policy %1$s_org_all on public.%1$s
         for all
         using (org_id = public.apex_talent_current_org_id())
         with check (org_id = public.apex_talent_current_org_id());', t);
  end loop;
end$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage buckets + policies (private, org-scoped by path prefix = org_id/...)
-- Distinct bucket ids avoid collision with other apps in this project.
-- ─────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
  values ('apex-resumes', 'apex-resumes', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
  values ('apex-documents', 'apex-documents', false)
  on conflict (id) do nothing;

drop policy if exists apex_talent_resumes_org_rw on storage.objects;
create policy apex_talent_resumes_org_rw on storage.objects
  for all
  using (
    bucket_id = 'apex-resumes'
    and (storage.foldername(name))[1] = public.apex_talent_current_org_id()::text
  )
  with check (
    bucket_id = 'apex-resumes'
    and (storage.foldername(name))[1] = public.apex_talent_current_org_id()::text
  );

drop policy if exists apex_talent_documents_org_rw on storage.objects;
create policy apex_talent_documents_org_rw on storage.objects
  for all
  using (
    bucket_id = 'apex-documents'
    and (storage.foldername(name))[1] = public.apex_talent_current_org_id()::text
  )
  with check (
    bucket_id = 'apex-documents'
    and (storage.foldername(name))[1] = public.apex_talent_current_org_id()::text
  );
