// talent-compass — dedicated interview feature.
// Flow: Vaga → Roteiro → Entrevista → Scorecard → Minutas. Built on the design
// system. Evidence decides; DISC/Enneagram are context (weight 0); a fairness
// note rides with every recommendation.
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Field,
  Input,
  Textarea,
  Badge,
  Stepper,
} from "./design-system";
import { Minutas, type ParecerData } from "./minutas/Minutas";
import {
  defineRole,
  buildGuide,
  scoreCandidate,
  interviewStatus,
  persistDocument,
  type RoleProfile,
  type InterviewGuide,
  type Scorecard,
} from "./api";

const STEPS = [
  { label: "Vaga" },
  { label: "Roteiro" },
  { label: "Entrevista" },
  { label: "Scorecard" },
  { label: "Minutas" },
];

export function InterviewView({ onClose }: { onClose: () => void }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbEnabled, setDbEnabled] = useState<boolean | null>(null);

  const [roleInput, setRoleInput] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [role, setRole] = useState<RoleProfile | null>(null);
  const [guide, setGuide] = useState<InterviewGuide | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [behavioralStyle, setBehavioralStyle] = useState("");
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);

  useEffect(() => {
    interviewStatus()
      .then((s) => setDbEnabled(s.dbEnabled))
      .catch(() => setDbEnabled(false));
  }, []);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const onDefine = () =>
    run(async () => {
      const r = await defineRole(roleInput);
      setRole(r);
      setStep(1);
    });

  const onGuide = () =>
    run(async () => {
      if (!role) return;
      const g = await buildGuide(role);
      setGuide(g);
      setStep(2);
    });

  const onScore = () =>
    run(async () => {
      if (!role || !guide) return;
      const ans = guide.questions.map((q) => ({
        questionId: q.id,
        competency: q.competency,
        answer: answers[q.id] ?? "",
      }));
      const { scorecard: sc } = await scoreCandidate({
        role,
        guide,
        candidateName: candidateName || "Candidato",
        answers: ans,
        behavioralStyle: behavioralStyle || undefined,
      });
      setScorecard(sc);
      setStep(3);
    });

  const parecer: ParecerData | null = useMemo(() => {
    if (!scorecard) return null;
    return {
      candidate: scorecard.candidate,
      role: scorecard.role_title,
      total: scorecard.total,
      grade: scorecard.grade,
      technical: { score: scorecard.categories.technical.score, evidence: scorecard.categories.technical.evidence },
      behavioral: { score: scorecard.categories.behavioral.score, evidence: scorecard.categories.behavioral.evidence },
      motivation: { score: scorecard.categories.motivation.score, evidence: scorecard.categories.motivation.evidence },
      strengths: scorecard.strengths,
      gaps: scorecard.gaps,
      recommendation: scorecard.recommendation,
      behavioralContext: scorecard.behavioral_style_context,
      fairnessStatus: scorecard.fairness_status,
      fairnessNotes: scorecard.fairness_notes,
    };
  }, [scorecard]);

  return (
    <div className="ds-root" data-theme={theme} style={{ padding: 20, overflowY: "auto", height: "100%" }}>
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>🎤 Talent-Compass — Entrevista por evidência</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "☀️ Claro" : "🌙 Escuro"}
          </Button>
          <Button onClick={onClose}>Fechar ✕</Button>
        </div>
      </div>

      <div className="no-print">
        <Stepper steps={STEPS} current={step} />
        <p style={{ fontSize: 13, color: "var(--ds-muted)", marginTop: -8 }}>
          Competência decide. DISC/Eneagrama são contexto (peso 0). Toda recomendação passa por uma nota de fairness.
          {dbEnabled === false ? " · Persistência off (configure SUPABASE_* para gravar)." : dbEnabled ? " · Persistência ativa." : ""}
        </p>
        {error ? (
          <div style={{ color: "var(--ds-danger)", margin: "8px 0" }}>Erro: {error}</div>
        ) : null}
      </div>

      {/* STEP 0 — Vaga */}
      {step === 0 && (
        <Card title="1. Definir a vaga por objetivos de performance">
          <Field label="Vaga ou descrição (cole a JD ou descreva o cargo e o que a pessoa precisa entregar)">
            <Textarea
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              placeholder="Ex.: Analista de Customer Success — responsável por reter e expandir uma carteira de ~40 contas..."
            />
          </Field>
          <Field label="Nome do candidato (opcional)">
            <Input value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Maria Silva" />
          </Field>
          <Button variant="primary" disabled={busy || roleInput.trim().length < 10} onClick={onDefine}>
            {busy ? "Definindo..." : "Definir vaga →"}
          </Button>
        </Card>
      )}

      {/* STEP 1 — Roteiro */}
      {step === 1 && role && (
        <Card title={`2. Vaga definida: ${role.role_title}`}>
          <h4>Objetivos de performance</h4>
          <ol>{role.performance_objectives.map((o) => <li key={o.id}><strong>{o.outcome}</strong> — <span style={{ color: "var(--ds-muted)" }}>{o.metric}</span></li>)}</ol>
          <h4>Competências derivadas</h4>
          <p><strong>Técnicas:</strong> {role.competencies.technical.map((c) => c.name).join(", ") || "—"}</p>
          <p><strong>Comportamentais:</strong> {role.competencies.behavioral.map((c) => c.name).join(", ") || "—"}</p>
          <p style={{ fontSize: 13, color: "var(--ds-muted)" }}>
            Scorecard: técnica {role.scorecard_weights.technical} / comportamental {role.scorecard_weights.behavioral} / motivação {role.scorecard_weights.motivation} / estilo {role.scorecard_weights.behavioral_style} (contexto)
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={() => setStep(0)}>← Voltar</Button>
            <Button variant="primary" disabled={busy} onClick={onGuide}>{busy ? "Gerando..." : "Gerar roteiro estruturado →"}</Button>
          </div>
        </Card>
      )}

      {/* STEP 2 — Entrevista */}
      {step === 2 && guide && (
        <Card title="3. Entrevista estruturada (BARS + STAR)">
          <Field label="Estilo comportamental observado (opcional — contexto, peso 0)">
            <Input value={behavioralStyle} onChange={(e) => setBehavioralStyle(e.target.value)} placeholder="Ex.: tende a alto-I/S, colaborativo (não pontua)" />
          </Field>
          {guide.questions.map((q) => (
            <div key={q.id} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "var(--ds-muted)" }}>{q.competency} · {q.type}</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{q.text}</div>
              {q.probes?.length ? <div style={{ fontSize: 12, color: "var(--ds-muted)" }}>Probes: {q.probes.join(" · ")}</div> : null}
              <Textarea
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                placeholder="Resposta do candidato (evidência STAR)..."
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={() => setStep(1)}>← Voltar</Button>
            <Button variant="primary" disabled={busy} onClick={onScore}>{busy ? "Pontuando..." : "Pontuar por evidência →"}</Button>
          </div>
        </Card>
      )}

      {/* STEP 3 — Scorecard */}
      {step === 3 && scorecard && (
        <Card title={`4. Scorecard — ${scorecard.candidate}`}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 700 }}>{scorecard.total}/100</span>
            <Badge tone="info">{scorecard.grade}</Badge>
            <Badge tone={scorecard.fairness_status === "pass" ? "success" : "warn"}>
              fairness: {scorecard.fairness_status}
            </Badge>
          </div>
          <table className="ds-table">
            <thead><tr><th>Área</th><th>Nota</th><th>Evidência</th></tr></thead>
            <tbody>
              <tr><td>Técnicas</td><td>{scorecard.categories.technical.score}/40</td><td>{scorecard.categories.technical.evidence}</td></tr>
              <tr><td>Comportamentais (STAR)</td><td>{scorecard.categories.behavioral.score}/35</td><td>{scorecard.categories.behavioral.evidence}</td></tr>
              <tr><td>Motivação & fit</td><td>{scorecard.categories.motivation.score}/25</td><td>{scorecard.categories.motivation.evidence}</td></tr>
              <tr><td>Estilo (DISC)</td><td>contexto /0</td><td>{scorecard.behavioral_style_context}</td></tr>
            </tbody>
          </table>
          <p style={{ marginTop: 12 }}><strong>Recomendação:</strong> {scorecard.recommendation}</p>
          <p style={{ fontSize: 13, color: "var(--ds-muted)" }}><strong>Fairness:</strong> {scorecard.fairness_notes}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={() => setStep(2)}>← Voltar</Button>
            <Button variant="primary" onClick={() => setStep(4)}>Gerar minutas →</Button>
          </div>
        </Card>
      )}

      {/* STEP 4 — Minutas */}
      {step === 4 && parecer && (
        <Card title="5. Minutas (impressos)">
          <Minutas
            parecer={parecer}
            onPersist={(templateKey, renderedHtml, data) => {
              void persistDocument({ templateKey, renderedHtml, data }).catch(() => undefined);
            }}
          />
          <div className="no-print" style={{ marginTop: 12 }}>
            <Button onClick={() => setStep(3)}>← Voltar ao scorecard</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
