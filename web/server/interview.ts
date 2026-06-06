// talent-compass — AI helpers for the dedicated interview web feature.
// Mirrors the structure of pericia.ts: pure functions that call the Anthropic SDK
// and return structured JSON. Encodes the squad's core rule: competency evidence
// decides; DISC/Enneagram are context with weight 0; a fairness note always rides
// along with any recommendation.
import type Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-6";

export interface PerformanceObjective {
  id: string;
  outcome: string;
  metric: string;
}
export interface Competency {
  name: string;
  bars: { "1": string; "3": string; "5": string };
}
export interface RoleProfile {
  role_title: string;
  performance_objectives: PerformanceObjective[];
  competencies: {
    technical: Competency[];
    behavioral: Competency[];
    motivation: string[];
  };
  scorecard_weights: {
    technical: number;
    behavioral: number;
    motivation: number;
    behavioral_style: number; // always 0
  };
}

export interface GuideQuestion {
  id: string;
  competency: string;
  type: "behavioral" | "situational";
  text: string;
  probes: string[];
  bars: { "1": string; "3": string; "5": string };
}
export interface InterviewGuide {
  role_title: string;
  questions: GuideQuestion[];
}

export interface ScoredCategory {
  score: number;
  max: number;
  evidence: string;
}
export interface Scorecard {
  candidate: string;
  role_title: string;
  categories: {
    technical: ScoredCategory;
    behavioral: ScoredCategory;
    motivation: ScoredCategory;
  };
  behavioral_style_context: string; // weight 0 — never scored
  total: number;
  grade: string;
  strengths: string[];
  gaps: string[];
  recommendation: string;
  fairness_status: "pass" | "review";
  fairness_notes: string;
}

function extractText(msg: Anthropic.Message): string {
  const block = msg.content[0];
  return block && block.type === "text" ? block.text : "";
}

/** Parse a JSON object from a model response, tolerating code fences/prose.
 * Fails fast if the result is not a non-null object, so malformed model output
 * never gets coerced into a typed shape downstream. */
function parseJson<T>(raw: string): T {
  let s = raw.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new Error("Model response did not contain a JSON object.");
  }
  s = s.slice(start, end + 1);
  const parsed: unknown = JSON.parse(s);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Model response was not a valid JSON object.");
  }
  return parsed as T;
}

async function askJson<T>(
  anthropic: Anthropic,
  system: string,
  user: string,
  maxTokens = 2000
): Promise<T> {
  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  return parseJson<T>(extractText(msg));
}

const CORE_RULES = `You are part of talent-compass, an evidence-based hiring squad.
Non-negotiable rules:
- Hiring decisions are governed by COMPETENCY EVIDENCE against performance objectives.
- DISC and Enneagram are CONTEXT ONLY, weight 0 — never a score or a filter.
- Use BARS anchors (1/3/5) and STAR evidence (Situation, Task, Action, Result).
- Never reference protected attributes (age, race, religion, family/marital status, health).
- Output is decision SUPPORT; the human decides.
Always respond with a single valid JSON object and nothing else.`;

/** Turn a role/JD into performance objectives, competencies and a scorecard. */
export async function defineRole(
  anthropic: Anthropic,
  roleInput: string
): Promise<RoleProfile> {
  const user = `Define the role below as Performance-based Hiring artifacts.

ROLE / JOB DESCRIPTION:
${roleInput}

Return JSON with this exact shape:
{
  "role_title": string,
  "performance_objectives": [{ "id": "PO1", "outcome": string, "metric": string }],  // 4-6 items
  "competencies": {
    "technical": [{ "name": string, "bars": { "1": string, "3": string, "5": string } }],
    "behavioral": [{ "name": string, "bars": { "1": string, "3": string, "5": string } }],
    "motivation": [string]
  },
  "scorecard_weights": { "technical": 40, "behavioral": 35, "motivation": 25, "behavioral_style": 0 }
}
Derive competencies from the objectives (role-agnostic). Keep behavioral_style at 0.`;
  return askJson<RoleProfile>(anthropic, CORE_RULES, user, 2500);
}

/** Build a structured BARS+STAR interview guide from a role profile. */
export async function buildGuide(
  anthropic: Anthropic,
  role: RoleProfile
): Promise<InterviewGuide> {
  const user = `Build ONE structured interview guide for this role, used identically for every candidate.

ROLE PROFILE:
${JSON.stringify(role)}

Return JSON:
{
  "role_title": string,
  "questions": [
    {
      "id": "Q1",
      "competency": string,
      "type": "behavioral" | "situational",
      "text": string,
      "probes": [string],          // follow-ups that dig for the candidate's specific Action and Result
      "bars": { "1": string, "3": string, "5": string }
    }
  ]
}
Cover every competency with at least one anchored question. No questions about protected attributes.`;
  return askJson<InterviewGuide>(anthropic, CORE_RULES, user, 3000);
}

/** Score a candidate from their answers against the guide. Includes a fairness note. */
export async function scoreCandidate(
  anthropic: Anthropic,
  args: {
    role: RoleProfile;
    guide: InterviewGuide;
    candidateName: string;
    answers: { questionId: string; competency: string; answer: string }[];
    behavioralStyle?: string;
  }
): Promise<Scorecard> {
  const user = `Score the candidate on evidence against the BARS anchors. Personality is context, weight 0.

ROLE PROFILE: ${JSON.stringify(args.role)}
INTERVIEW GUIDE: ${JSON.stringify(args.guide)}
CANDIDATE: ${args.candidateName}
ANSWERS: ${JSON.stringify(args.answers)}
BEHAVIORAL STYLE NOTE (context, weight 0): ${args.behavioralStyle ?? "(none provided)"}

Return JSON:
{
  "candidate": string,
  "role_title": string,
  "categories": {
    "technical":   { "score": number, "max": 40, "evidence": string },
    "behavioral":  { "score": number, "max": 35, "evidence": string },
    "motivation":  { "score": number, "max": 25, "evidence": string }
  },
  "behavioral_style_context": string,   // weight 0 — describe communication/onboarding only
  "total": number,                      // sum of the three category scores (0-100)
  "grade": "A+"|"A"|"B"|"C"|"D"|"F",   // A+>=90 A>=80 B>=70 C>=55 D>=40 F>=0
  "strengths": [string],
  "gaps": [string],
  "recommendation": string,             // evidence-based; the human decides
  "fairness_status": "pass" | "review", // "review" if evidence is thin or any bias risk
  "fairness_notes": string              // what was checked: coded language, consistency, personality weight 0
}
Every category score must be justified by cited evidence from the answers.
Scoring method (apply consistently to every candidate):
1. For each question, assign a BARS rating from 1 to 5 against its anchors.
2. For each category (technical, behavioral, motivation), average the BARS ratings of its questions, then normalize to 0-1 by computing (avg - 1) / 4.
3. Multiply that normalized value by the category max (technical 40, behavioral 35, motivation 25) and round to an integer. Never exceed the max or go below 0.
4. total = technical + behavioral + motivation (0-100).
If a category has no usable evidence, rate its questions low (1-2) rather than guessing high.`;
  return askJson<Scorecard>(anthropic, CORE_RULES, user, 2500);
}
