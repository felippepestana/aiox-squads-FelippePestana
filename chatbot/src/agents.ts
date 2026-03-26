import fs from "fs";
import path from "path";

export interface Agent {
  id: string;
  name: string;
  squad: string;
  filePath: string;
  systemPrompt: string;
}

export interface Squad {
  id: string;
  agents: Agent[];
}

export interface SquadMeta {
  id: string;
  icon: string;
  title: string;
  description: string;
  chiefAgent: string;
  color: string;
  quickPrompts: string[];
}

const SQUADS_DIR = path.resolve(__dirname, "../../squads");

/** Extrai nome/id do agente a partir do bloco YAML no arquivo .md */
function extractAgentMeta(
  content: string,
  filePath: string
): { name: string; id: string } {
  const nameMatch = content.match(/^\s*name:\s+(.+)$/m);
  const idMatch = content.match(/^\s*id:\s+(.+)$/m);
  const filename = path.basename(filePath, ".md");
  return {
    name: nameMatch ? nameMatch[1].trim() : filename,
    id: idMatch ? idMatch[1].trim() : filename,
  };
}

/** Carrega todos os agentes de todos os squads disponíveis */
export function loadAllSquads(): Squad[] {
  const squads: Squad[] = [];

  if (!fs.existsSync(SQUADS_DIR)) return squads;

  const squadDirs = fs
    .readdirSync(SQUADS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const squadId of squadDirs) {
    const agentsDir = path.join(SQUADS_DIR, squadId, "agents");
    if (!fs.existsSync(agentsDir)) continue;

    const agentFiles = fs
      .readdirSync(agentsDir)
      .filter((f) => f.endsWith(".md"))
      .sort();

    if (agentFiles.length === 0) continue;

    const agents: Agent[] = agentFiles.map((file) => {
      const filePath = path.join(agentsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const meta = extractAgentMeta(content, filePath);
      return {
        id: meta.id,
        name: meta.name,
        squad: squadId,
        filePath,
        systemPrompt: buildSystemPrompt(content, meta.name, squadId),
      };
    });

    squads.push({ id: squadId, agents });
  }

  return squads;
}

function buildSystemPrompt(
  agentContent: string,
  agentName: string,
  squadId: string
): string {
  return [
    `Você é o agente **${agentName}** do squad **${squadId}** do framework AIOX.`,
    "",
    "A seguir estão suas definições operacionais completas. Siga-as estritamente:",
    "",
    agentContent,
    "",
    "---",
    "",
    "## Regras de interação no chatbot",
    "",
    "- Responda sempre em português (pt-BR) a menos que o usuário escreva em outro idioma.",
    "- Se um arquivo foi enviado pelo usuário (PDF, texto, imagem), analise-o como parte do contexto.",
    "- Quando o usuário digitar `/help`, liste seus comandos disponíveis.",
    "- Quando o usuário digitar `/exit`, diga adeus e encerre a sessão.",
    "- Seja preciso, direto e siga suas heurísticas de decisão.",
  ].join("\n");
}

/** Retorna a lista plana de todos os agentes para seleção rápida */
export function flatAgentList(squads: Squad[]): Agent[] {
  return squads.flatMap((s) => s.agents);
}

// ── Squad Metadata (curated per-squad UI context) ────────────────────────────
const SQUAD_META_MAP: Record<
  string,
  Omit<SquadMeta, "id">
> = {
  apex: {
    icon: "🎨",
    title: "Apex — Frontend Ultra-Premium",
    description:
      "14 agentes especializados para Web, Mobile e Spatial. Next.js 15+, React 19+, React Native, VisionOS. Cobre design system, componentes, animações, 3D, acessibilidade e performance.",
    chiefAgent: "apex-lead",
    color: "#79c0ff",
    quickPrompts: [
      "Preciso criar um design system para um SaaS B2B. Quais são os primeiros passos?",
      "Analise este componente React e sugira otimizações de performance e acessibilidade.",
      "Crie uma landing page ultra-premium para uma startup de IA com foco em conversão.",
    ],
  },
  curator: {
    icon: "🎬",
    title: "Curator — Curadoria de Conteúdo",
    description:
      "Minera transcrições, identifica momentos de alto impacto e monta roteiros de corte com timestamps exatos. Zero invenção — apenas monta o que já existe.",
    chiefAgent: "curator-chief",
    color: "#f0883e",
    quickPrompts: [
      "Vou enviar uma transcrição. Por favor, mine os 50 momentos de maior impacto.",
      "Tenho um vídeo de 2 horas. Preciso montar um corte de 10 minutos com os melhores momentos.",
      "Analise este conteúdo e identifique os hooks mais poderosos para redes sociais.",
    ],
  },
  "deep-research": {
    icon: "🔬",
    title: "Deep Research — Pesquisa Baseada em Evidências",
    description:
      "11 agentes com pipeline 3-tier: Diagnóstico (Sackett, Booth, Creswell), Execução (Forsgren, Cochrane, Higgins, Klein, Gilad) e QA (Ioannidis + Kahneman).",
    chiefAgent: "dr-orchestrator",
    color: "#3fb950",
    quickPrompts: [
      "Pesquise sistematicamente o impacto da IA generativa na produtividade de desenvolvedores.",
      "Faça uma análise competitiva completa do mercado de ferramentas de design no-code.",
      "Pesquise evidências sobre as melhores práticas de onboarding para produtos SaaS.",
    ],
  },
  dispatch: {
    icon: "⚡",
    title: "Dispatch — Motor de Execução Paralela",
    description:
      "Decomponha tarefas complexas em waves paralelas otimizadas via DAG. 43-58x mais eficiente que contexto principal. Gene Kim, Goldratt, Reinertsen e Deming.",
    chiefAgent: "dispatch-chief",
    color: "#f85149",
    quickPrompts: [
      "Tenho um PRD para um MVP. Decomponha em tasks atômicas e planeje as waves de execução.",
      "Preciso migrar um monolito para microserviços. Crie o plano de execução paralela.",
      "Execute em paralelo: documentação técnica, testes unitários e refatoração do módulo de auth.",
    ],
  },
  education: {
    icon: "🧠",
    title: "Education — Engenharia de Aprendizado",
    description:
      "16 agentes para criar currículos pedagogicamente sólidos com compliance MEC. Bloom, UbD (Wiggins & McTighe), Mayer (12 princípios), ARCS, LTEM e Bjork.",
    chiefAgent: "education-chief",
    color: "#bc8cff",
    quickPrompts: [
      "Crie um curso completo de Python para iniciantes com compliance MEC para curso livre.",
      "Design um módulo sobre machine learning para profissionais de negócio sem background técnico.",
      "Valide se este plano de curso atende aos requisitos de pós-graduação lato sensu do MEC.",
    ],
  },
  kaizen: {
    icon: "🔄",
    title: "Kaizen — Monitoramento do Ecossistema",
    description:
      "O squad que vigia e melhora todos os outros. Detecta gaps, monitora performance (DORA), identifica gargalos (Goldratt), recomenda melhorias contínuas.",
    chiefAgent: "kaizen-chief",
    color: "#d29922",
    quickPrompts: [
      "Execute uma auditoria completa de todos os squads e identifique os principais gaps.",
      "Gere o dashboard de performance semanal com métricas DORA e OKRs.",
      "Identifique os gargalos críticos e proponha melhorias prioritárias no ecossistema.",
    ],
  },
  seo: {
    icon: "📈",
    title: "SEO Expert — Otimização para Busca",
    description:
      "Avalia sites (0-100), otimiza todos os fatores SEO e mostra melhoria before/after. On-page (25%), Técnico (20%), Schema (15%), E-E-A-T (15%), CWV (10%), GEO (10%).",
    chiefAgent: "seo-chief",
    color: "#58a6ff",
    quickPrompts: [
      "Audite o SEO completo do site https://example.com e dê uma pontuação detalhada 0-100.",
      "Otimize as meta tags e schema markup para aumentar visibilidade nos buscadores.",
      "Analise os Core Web Vitals e sugira melhorias de performance para SEO.",
    ],
  },
  "squad-creator": {
    icon: "🛠️",
    title: "Squad Creator — Criador de Squads",
    description:
      "Meta-squad para criar novos squads completos com templates, tarefas, agentes e checklists. 24 tasks disponíveis. Gera toda a anatomia de 6 camadas.",
    chiefAgent: "squad-chief",
    color: "#ffa657",
    quickPrompts: [
      "Crie um squad de vendas e CRM com agentes especializados em cold outreach, qualificação e fechamento.",
      "Gere um squad de análise financeira para startups com foco em runway, burn rate e métricas SaaS.",
      "Crie um squad de suporte ao cliente com IA. Qual seria a arquitetura ideal?",
    ],
  },
  "squad-creator-pro": {
    icon: "✨",
    title: "Squad Creator Pro — Criação Avançada",
    description:
      "Upgrade pack com Mind Cloning, Voice DNA, Thinking DNA, Axioma Assessment (10 meta-axiomas) e 34 tasks exclusivas. Roteamento de modelos reduz 60-70% dos tokens.",
    chiefAgent: "squad-chief",
    color: "#e3b341",
    quickPrompts: [
      "Clone a mente de um especialista em growth hacking para criar um agente personalizado.",
      "Extraia o Voice DNA de um líder de produto e crie um squad alinhado com sua visão.",
      "Crie um squad avançado com Axioma Assessment e otimização de roteamento de modelos.",
    ],
  },
};

/** Retorna metadados enriquecidos de todos os squads (com quick prompts e UI context) */
export function loadSquadsMeta(squads: Squad[]): SquadMeta[] {
  return squads.map((s) => {
    const meta = SQUAD_META_MAP[s.id];
    if (meta) return { id: s.id, ...meta };

    // Fallback genérico para squads sem metadata curada
    const chiefCandidates = [
      `${s.id}-chief`,
      `${s.id}-lead`,
      `${s.id}-orchestrator`,
    ];
    const chiefAgent =
      s.agents.find((a) => chiefCandidates.some((c) => a.id.includes(c)))
        ?.id ?? s.agents[0]?.id ?? "";

    return {
      id: s.id,
      icon: "🤖",
      title: s.id,
      description: `Squad ${s.id} com ${s.agents.length} agentes.`,
      chiefAgent,
      color: "#8b949e",
      quickPrompts: [],
    };
  });
}
