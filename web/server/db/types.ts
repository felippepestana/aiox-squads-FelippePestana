// Focused database types for the Apex-Talent (talent-compass) tables.
// Source of truth is the Supabase schema (supabase/migrations). This is a
// hand-curated subset of the generated types covering only apex_talent_* tables.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface JobRow {
  id: string;
  org_id: string;
  title: string;
  status: string;
  performance_objectives: Json;
  competencies: Json;
  scorecard_weights: Json;
  created_by: string | null;
  created_at: string;
}

export interface CandidateRow {
  id: string;
  org_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  resume_path: string | null;
  source: string | null;
  created_at: string;
}

export interface ApplicationRow {
  id: string;
  org_id: string;
  job_id: string;
  candidate_id: string;
  stage: string;
  status: string;
  created_at: string;
}

export interface InterviewRow {
  id: string;
  org_id: string;
  application_id: string;
  guide: Json;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface ScorecardRow {
  id: string;
  org_id: string;
  application_id: string;
  total_score: number | null;
  grade: string | null;
  category_scores: Json;
  recommendation: string | null;
  fairness_status: string;
  created_at: string;
}

export interface DocumentRow {
  id: string;
  org_id: string;
  entity_type: string;
  entity_id: string | null;
  template_key: string;
  data: Json;
  rendered_html: string | null;
  storage_path: string | null;
  status: string;
  created_at: string;
}
