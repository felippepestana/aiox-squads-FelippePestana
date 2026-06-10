// Best-effort repositories for talent-compass domain entities.
// All functions return null when persistence is not configured (getDb() === null).
// The service-role client bypasses RLS, so org scoping is applied explicitly here.
import { getDb } from "./client.js";
import type {
  Json,
  JobRow,
  CandidateRow,
  ApplicationRow,
  InterviewRow,
  ScorecardRow,
  DocumentRow,
  AdminRow,
} from "./types.js";

const ORG_NAME = "Apex-Talent Demo";
let cachedOrgId: string | null = null;

/** Surface Supabase errors to server logs instead of swallowing them.
 * Persistence stays best-effort (callers still get null), but failures are
 * no longer silent — they are logged for diagnosis and Sentry breadcrumbs. */
function logDbError(op: string, error: unknown): void {
  if (error) console.error(`[apex-talent db] ${op} failed:`, error);
}

/** Get-or-create a demo org so the web flow can persist without an auth login. */
export async function ensureOrgId(): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  if (cachedOrgId) return cachedOrgId;
  const existing = await db
    .from("apex_talent_orgs")
    .select("id")
    .eq("name", ORG_NAME)
    .limit(1)
    .maybeSingle();
  logDbError("ensureOrgId(select)", existing.error);
  if (existing.data?.id) {
    cachedOrgId = existing.data.id as string;
    return cachedOrgId;
  }
  const created = await db
    .from("apex_talent_orgs")
    .insert({ name: ORG_NAME })
    .select("id")
    .single();
  logDbError("ensureOrgId(insert)", created.error);
  cachedOrgId = (created.data?.id as string) ?? null;
  return cachedOrgId;
}

export async function saveJob(input: {
  title: string;
  performance_objectives: Json;
  competencies: Json;
}): Promise<JobRow | null> {
  const db = getDb();
  const orgId = await ensureOrgId();
  if (!db || !orgId) return null;
  const { data, error } = await db
    .from("apex_talent_jobs")
    .insert({
      org_id: orgId,
      title: input.title,
      status: "open",
      performance_objectives: input.performance_objectives,
      competencies: input.competencies,
    })
    .select("*")
    .single();
  logDbError("saveJob", error);
  return (data as JobRow) ?? null;
}

export async function saveCandidate(input: {
  name: string;
  email?: string | null;
  source?: string | null;
}): Promise<CandidateRow | null> {
  const db = getDb();
  const orgId = await ensureOrgId();
  if (!db || !orgId) return null;
  const { data, error } = await db
    .from("apex_talent_candidates")
    .insert({
      org_id: orgId,
      name: input.name,
      email: input.email ?? null,
      source: input.source ?? "web",
    })
    .select("*")
    .single();
  logDbError("saveCandidate", error);
  return (data as CandidateRow) ?? null;
}

export async function saveApplication(input: {
  job_id: string;
  candidate_id: string;
}): Promise<ApplicationRow | null> {
  const db = getDb();
  const orgId = await ensureOrgId();
  if (!db || !orgId) return null;
  const { data, error } = await db
    .from("apex_talent_applications")
    .insert({
      org_id: orgId,
      job_id: input.job_id,
      candidate_id: input.candidate_id,
      stage: "interview",
      status: "active",
    })
    .select("*")
    .single();
  logDbError("saveApplication", error);
  return (data as ApplicationRow) ?? null;
}

export async function saveInterview(input: {
  application_id: string;
  guide: Json;
}): Promise<InterviewRow | null> {
  const db = getDb();
  const orgId = await ensureOrgId();
  if (!db || !orgId) return null;
  const { data, error } = await db
    .from("apex_talent_interviews")
    .insert({
      org_id: orgId,
      application_id: input.application_id,
      guide: input.guide,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  logDbError("saveInterview", error);
  return (data as InterviewRow) ?? null;
}

export async function saveScorecard(input: {
  application_id: string;
  total_score: number;
  grade: string;
  category_scores: Json;
  recommendation: string;
  fairness_status: string;
}): Promise<ScorecardRow | null> {
  const db = getDb();
  const orgId = await ensureOrgId();
  if (!db || !orgId) return null;
  const { data, error } = await db
    .from("apex_talent_scorecards")
    .insert({ org_id: orgId, ...input })
    .select("*")
    .single();
  logDbError("saveScorecard", error);
  return (data as ScorecardRow) ?? null;
}

export interface AdminRegistrationInput {
  tipo_pessoa: "PF" | "PJ";
  nome_completo?: string | null;
  cpf?: string | null;
  razao_social?: string | null;
  nome_fantasia?: string | null;
  cnpj?: string | null;
  responsavel_nome?: string | null;
  email: string;
  telefone?: string | null;
}

export type AdminRegistrationResult =
  | { ok: true; admin: AdminRow }
  | { ok: false; reason: "db_unavailable" | "duplicate" | "error" };

/** Register an administrator (PF/PJ): creates a dedicated org + admin record.
 * Best-effort — returns { ok:false, reason:"db_unavailable" } if Supabase is
 * not configured, so the UI can degrade gracefully. */
export async function registerAdmin(
  input: AdminRegistrationInput
): Promise<AdminRegistrationResult> {
  const db = getDb();
  if (!db) return { ok: false, reason: "db_unavailable" };

  const orgName =
    input.tipo_pessoa === "PJ"
      ? input.razao_social?.trim() || input.nome_fantasia?.trim() || input.email
      : input.nome_completo?.trim() || input.email;

  const orgRes = await db
    .from("apex_talent_orgs")
    .insert({ name: orgName })
    .select("id")
    .single();
  logDbError("registerAdmin(org)", orgRes.error);
  const orgId = (orgRes.data?.id as string) ?? null;

  const { data, error } = await db
    .from("apex_talent_admins")
    .insert({
      org_id: orgId,
      tipo_pessoa: input.tipo_pessoa,
      nome_completo: input.nome_completo ?? null,
      cpf: input.cpf ?? null,
      razao_social: input.razao_social ?? null,
      nome_fantasia: input.nome_fantasia ?? null,
      cnpj: input.cnpj ?? null,
      responsavel_nome: input.responsavel_nome ?? null,
      email: input.email,
      telefone: input.telefone ?? null,
    })
    .select("*")
    .single();

  if (error) {
    logDbError("registerAdmin(admin)", error);
    // 23505 = unique_violation (email/cpf/cnpj already registered)
    if ((error as { code?: string }).code === "23505") {
      return { ok: false, reason: "duplicate" };
    }
    return { ok: false, reason: "error" };
  }
  return { ok: true, admin: data as AdminRow };
}

export async function saveDocument(input: {
  entity_type: string;
  entity_id?: string | null;
  template_key: string;
  data: Json;
  rendered_html: string;
}): Promise<DocumentRow | null> {
  const db = getDb();
  const orgId = await ensureOrgId();
  if (!db || !orgId) return null;
  const { data, error } = await db
    .from("apex_talent_documents")
    .insert({
      org_id: orgId,
      entity_type: input.entity_type,
      entity_id: input.entity_id ?? null,
      template_key: input.template_key,
      data: input.data,
      rendered_html: input.rendered_html,
      status: "issued",
    })
    .select("*")
    .single();
  logDbError("saveDocument", error);
  return (data as DocumentRow) ?? null;
}
