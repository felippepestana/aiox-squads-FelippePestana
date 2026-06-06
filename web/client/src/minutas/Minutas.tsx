// Minutas — data-driven printable documents for talent-compass.
// Renders the 5 canonical documents from interview data + a few editable fields,
// with browser print-to-PDF and best-effort persistence to the documents table.
import React, { useRef, useState } from "react";
import "./print.css";
import { Button, Field, Input } from "../design-system";

export interface ParecerData {
  candidate: string;
  role: string;
  total: number;
  grade: string;
  technical: { score: number; evidence: string };
  behavioral: { score: number; evidence: string };
  motivation: { score: number; evidence: string };
  strengths: string[];
  gaps: string[];
  recommendation: string;
  behavioralContext: string;
  fairnessStatus: string;
  fairnessNotes: string;
}

type TemplateKey = "parecer" | "convocacao" | "proposta" | "lgpd" | "devolutiva";

const TEMPLATES: { key: TemplateKey; label: string }[] = [
  { key: "parecer", label: "Parecer do candidato" },
  { key: "convocacao", label: "Convocação p/ entrevista" },
  { key: "proposta", label: "Carta-proposta" },
  { key: "lgpd", label: "Termo LGPD" },
  { key: "devolutiva", label: "Devolutiva (não aprovado)" },
];

const today = () => new Date().toLocaleDateString("pt-BR");

export function Minutas({
  parecer,
  onPersist,
}: {
  parecer: ParecerData;
  onPersist?: (templateKey: string, html: string, data: unknown) => void;
}) {
  const [tpl, setTpl] = useState<TemplateKey>("parecer");
  const [empresa, setEmpresa] = useState("Sua Empresa Ltda.");
  const [recrutador, setRecrutador] = useState("Equipe de Recrutamento");
  const printRef = useRef<HTMLDivElement>(null);

  const persist = () => {
    const html = printRef.current?.innerHTML ?? "";
    onPersist?.(tpl, html, { ...parecer, empresa, recrutador });
  };

  return (
    <div>
      <div className="no-print" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {TEMPLATES.map((t) => (
          <Button key={t.key} variant={t.key === tpl ? "primary" : "default"} onClick={() => setTpl(t.key)}>
            {t.label}
          </Button>
        ))}
      </div>

      <div className="no-print" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <Field label="Empresa"><Input value={empresa} onChange={(e) => setEmpresa(e.target.value)} /></Field>
        <Field label="Recrutador(a)"><Input value={recrutador} onChange={(e) => setRecrutador(e.target.value)} /></Field>
      </div>

      <div className="minuta-printable" ref={printRef}>
        {tpl === "parecer" && <Parecer d={parecer} empresa={empresa} recrutador={recrutador} />}
        {tpl === "convocacao" && <Convocacao d={parecer} empresa={empresa} recrutador={recrutador} />}
        {tpl === "proposta" && <Proposta d={parecer} empresa={empresa} recrutador={recrutador} />}
        {tpl === "lgpd" && <Lgpd d={parecer} empresa={empresa} />}
        {tpl === "devolutiva" && <Devolutiva d={parecer} empresa={empresa} recrutador={recrutador} />}
      </div>

      <div className="no-print" style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Button variant="primary" onClick={() => window.print()}>🖨️ Imprimir / Salvar PDF</Button>
        {onPersist ? <Button onClick={persist}>💾 Salvar no banco</Button> : null}
      </div>
    </div>
  );
}

function Parecer({ d, empresa, recrutador }: { d: ParecerData; empresa: string; recrutador: string }) {
  return (
    <>
      <h1>Parecer de Avaliação do Candidato</h1>
      <p className="muted">{empresa} — Confidencial / uso interno · {today()}</p>
      <p>
        <strong>Candidato:</strong> {d.candidate} &nbsp;|&nbsp; <strong>Vaga:</strong> {d.role}
        <br />
        <strong>Auditoria de viés:</strong> {d.fairnessStatus.toUpperCase()}
      </p>
      <h2>Scorecard (0–100) — por evidência</h2>
      <table>
        <thead>
          <tr><th>Área de competência</th><th>Nota</th><th>Evidência</th></tr>
        </thead>
        <tbody>
          <tr><td>Competências técnicas</td><td>{d.technical.score}/40</td><td>{d.technical.evidence}</td></tr>
          <tr><td>Competências comportamentais (STAR)</td><td>{d.behavioral.score}/35</td><td>{d.behavioral.evidence}</td></tr>
          <tr><td>Motivação & fit</td><td>{d.motivation.score}/25</td><td>{d.motivation.evidence}</td></tr>
          <tr><td>Estilo comportamental (DISC)</td><td>contexto /0</td><td>Não pontuado — apenas contexto</td></tr>
        </tbody>
      </table>
      <p><strong>Total: {d.total}/100 — Conceito {d.grade}</strong></p>
      <h2>Pontos fortes</h2>
      <ul>{d.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
      <h2>Lacunas / a investigar</h2>
      <ul>{d.gaps.map((s, i) => <li key={i}>{s}</li>)}</ul>
      <h2>Contexto comportamental (peso 0)</h2>
      <p>{d.behavioralContext}</p>
      <p className="muted">Insumo de comunicação e desenvolvimento. Não entrou na pontuação.</p>
      <h2>Recomendação</h2>
      <p>{d.recommendation}</p>
      <p className="muted">A decisão final é do gestor responsável. Este parecer é suporte baseado em evidência.</p>
      <div className="sign">{recrutador} — {empresa}</div>
    </>
  );
}

function Convocacao({ d, empresa, recrutador }: { d: ParecerData; empresa: string; recrutador: string }) {
  return (
    <>
      <h1>Convite para Entrevista</h1>
      <p className="muted">{empresa} · {today()}</p>
      <p>Prezado(a) {d.candidate},</p>
      <p>
        Agradecemos o seu interesse na vaga de <strong>{d.role}</strong>. Temos a satisfação de
        convidá-lo(a) para uma entrevista estruturada — faremos perguntas sobre situações reais que
        você já enfrentou. Não há perguntas-pegadinha; exemplos específicos ajudam mais.
      </p>
      <table>
        <tbody>
          <tr><th>Data</th><td>_____ / _____ / _______</td></tr>
          <tr><th>Horário</th><td>__:__</td></tr>
          <tr><th>Formato</th><td>Presencial / Vídeo</td></tr>
          <tr><th>Local / Link</th><td>______________________</td></tr>
        </tbody>
      </table>
      <p>Caso precise remarcar ou tenha necessidade de acessibilidade, responda a este e-mail.</p>
      <div className="sign">{recrutador} — {empresa}</div>
    </>
  );
}

function Proposta({ d, empresa, recrutador }: { d: ParecerData; empresa: string; recrutador: string }) {
  return (
    <>
      <h1>Carta-Proposta de Emprego</h1>
      <p className="muted">{empresa} · {today()}</p>
      <p>Prezado(a) {d.candidate},</p>
      <p>É com satisfação que formalizamos nossa proposta para a posição de <strong>{d.role}</strong>.</p>
      <table>
        <tbody>
          <tr><th>Cargo</th><td>{d.role}</td></tr>
          <tr><th>Tipo de contrato</th><td>______________________</td></tr>
          <tr><th>Remuneração</th><td>R$ ______________________</td></tr>
          <tr><th>Benefícios</th><td>______________________</td></tr>
          <tr><th>Modelo</th><td>Presencial / Híbrido / Remoto</td></tr>
          <tr><th>Início previsto</th><td>_____ / _____ / _______</td></tr>
        </tbody>
      </table>
      <p className="muted">
        Esta proposta não é contrato de trabalho; a efetivação está condicionada ao processo
        admissional. Revisar com DP/jurídico antes do envio.
      </p>
      <div className="sign">Aceite: _______________________  Data: ____ / ____ / ______</div>
      <div className="sign">{recrutador} — {empresa}</div>
    </>
  );
}

function Lgpd({ d, empresa }: { d: ParecerData; empresa: string }) {
  return (
    <>
      <h1>Termo de Consentimento — Tratamento de Dados (LGPD)</h1>
      <p className="muted">Base legal: Lei nº 13.709/2018 · {today()}</p>
      <p>
        Eu, <strong>{d.candidate}</strong>, no contexto do processo seletivo para a vaga de{" "}
        <strong>{d.role}</strong> da empresa <strong>{empresa}</strong> (controladora), consinto com o
        tratamento dos meus dados pessoais nos termos abaixo.
      </p>
      <h2>Dados e finalidade</h2>
      <p>
        Dados de identificação, curriculares e respostas de entrevista, tratados exclusivamente para
        condução e avaliação deste processo. A avaliação comportamental (DISC/Eneagrama), quando
        aplicável, é usada <strong>apenas como contexto</strong>, sem peso na decisão seletiva.
      </p>
      <h2>Direitos</h2>
      <p>
        Posso solicitar acesso, correção, eliminação e portabilidade, bem como revogar este
        consentimento, a qualquer tempo, pelo canal informado pela empresa.
      </p>
      <hr className="rule" />
      <div className="sign">_______________________________ — {d.candidate}</div>
      <p>☐ Autorizo a manutenção dos meus dados em banco de talentos para futuras oportunidades.</p>
    </>
  );
}

function Devolutiva({ d, empresa, recrutador }: { d: ParecerData; empresa: string; recrutador: string }) {
  return (
    <>
      <h1>Retorno sobre o Processo Seletivo</h1>
      <p className="muted">{empresa} · {today()}</p>
      <p>Prezado(a) {d.candidate},</p>
      <p>
        Obrigado por participar do processo para a vaga de <strong>{d.role}</strong>. Após uma
        avaliação estruturada e baseada em competências, seguimos com outro(a) candidato(a) cujo
        conjunto de experiências esteve mais aderente aos objetivos específicos desta vaga neste momento.
      </p>
      <h2>Retorno construtivo</h2>
      <ul>{d.strengths.map((s, i) => <li key={i}>Ponto forte: {s}</li>)}</ul>
      <ul>{d.gaps.map((s, i) => <li key={i}>Sugestão de desenvolvimento: {s}</li>)}</ul>
      <p>Com seu consentimento, gostaríamos de manter seu perfil em nosso banco de talentos.</p>
      <div className="sign">{recrutador} — {empresa}</div>
    </>
  );
}
