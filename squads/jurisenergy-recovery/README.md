# JurisEnergy Recovery Platform — Arquitetura Multiagente

> Squad multiagente para operação jurídica de distribuidora de energia (caso Energisa): orquestrador jurídico central, frentes especializadas e agentes IA com escopo delimitado — sempre com validação humana nos atos jurídicos sensíveis.

**Versão:** 1.0.0 | **Agentes:** 12 | **Tasks:** 12 | **Workflows:** 4 | **Templates:** 5 | **Checklists:** 3

Implementação do blueprint Notion **"Arquitetura Multiagente - JurisEnergy Recovery Platform"** (bases "Squads Multiagentes - JurisEnergy" e "Agentes IA - Papéis, Prompts e Guardrails").

---

## Objetivo

Criar uma camada de automação humanizada, auditável e juridicamente segura para melhorar os indicadores da pesquisa e da due diligence:

- aumentar recuperação líquida e taxa de acordo cumprido;
- reduzir improcedência em cobranças e dano moral em demandas passivas;
- aumentar taxa de improcedência favorável à Energisa;
- reduzir prescrição e falhas em TOI, corte, negativação, atendimento e cálculo;
- aumentar o índice de prova documental completa;
- transformar dados judiciais e operacionais em melhoria contínua.

O sistema **não substitui a decisão jurídica**: automatiza triagem, leitura, extração, classificação, checklist, sugestão de estratégia, minuta assistida e relatórios, mantendo advogado responsável nos pontos críticos.

---

## Arquitetura resumida

```text
Tier 0  juris-orchestrator (Orquestrador Jurídico Central)
  |       polo, tema, rota, consolidação, trilha de auditoria, gate humano
  |
Tier 1  Dados e Saneamento Documental
  |       datajud-intelligence-analyst · document-intake-validator
  |
Tier 2  Frentes Jurídicas Especializadas
  |       recovery-score-analyst · passive-defense-strategist
  |       toi-legal-builder · cortesafe-validator · negativesafe-validator
  |
Tier 3  Qualidade, Governança e Comunicação
          legal-thesis-curator · lgpd-compliance-auditor
          humanized-communication-writer · kpi-board-reporter
```

### Lógica de funcionamento

1. O caso entra pela plataforma.
2. O orquestrador identifica o polo da Energisa: ativo, passivo, pré-contencioso ou administrativo.
3. O orquestrador identifica o tema: cobrança, TOI, corte, negativação, religação, dano elétrico, infraestrutura, ação coletiva.
4. O caso vai à frente apropriada; os agentes extraem dados, validam documentos, calculam score e identificam riscos.
5. O orquestrador consolida a recomendação.
6. **O advogado valida, ajusta ou bloqueia.**
7. O resultado alimenta dashboards, KPIs e base de aprendizado.

---

## Regras estruturantes

- Todo agente tem escopo delimitado e produz saída estruturada.
- Toda recomendação jurídica sensível exige revisão humana.
- Todo documento faltante gera pendência objetiva para o setor responsável.
- Toda decisão automatizada possui justificativa, fonte e nível de confiança.
- Toda classificação é rastreável ao documento analisado.
- O orquestrador **impede** judicialização, corte, negativação ou defesa automática sem validação jurídica.

Os guardrails de cada agente (pode automatizar / não pode automatizar / nível de risco) estão em [`data/agent-guardrails.yaml`](data/agent-guardrails.yaml).

---

## Agentes

| Tier | Agente | Papel | Risco |
|---|---|---|---|
| 0 | `juris-orchestrator` | Polo, tema, roteamento, consolidação e trilha de auditoria. | Crítico |
| 1 | `datajud-intelligence-analyst` | DATAJUD/TPU/PJe: classificação, deduplicação e inteligência territorial. | Alto |
| 1 | `document-intake-validator` | Checklist documental por demanda, OCR, pendências setoriais e score documental. | Alto |
| 2 | `recovery-score-analyst` | Score de viabilidade 0-100, régua extrajudicial e judicialização seletiva com ROI. | Alto |
| 2 | `passive-defense-strategist` | Leitura de inicial, riscos, tese defensiva, minuta assistida e acordo mitigador. | Crítico |
| 2 | `toi-legal-builder` | Robustez de TOI: fotos, laudo, cálculo, notificação e contraditório. | Crítico |
| 2 | `cortesafe-validator` | Corte/religação: notificação, feriados, pagamento, SLA e vulnerabilidade. | Crítico |
| 2 | `negativesafe-validator` | Negativação: titularidade, exigibilidade, prescrição, contestação e baixa. | Crítico |
| 3 | `legal-thesis-curator` | Jurisprudência setorial, teses por tema/comarca e retroalimentação das frentes. | Alto |
| 3 | `lgpd-compliance-auditor` | LGPD, minimização, base legal, retenção e auditoria das decisões de IA. | Crítico |
| 3 | `humanized-communication-writer` | Comunicações claras, respeitosas e juridicamente seguras. | Médio |
| 3 | `kpi-board-reporter` | KPIs executivos, ROI e narrativa de Conselho com dados rotulados. | Alto |

---

## Casos de uso

| UC | Nome | Quando usar |
|---|---|---|
| UC-JE-001 | Triagem e Roteamento de Caso | Todo caso novo entrando na plataforma. |
| UC-JE-002 | Cobrança Ativa e Recuperação de Receita | Carteiras, débitos, régua extrajudicial e judicialização seletiva. |
| UC-JE-003 | Defesa Passiva Consumerista | Ações contra a Energisa: dano moral, cobrança indevida, liminar. |
| UC-JE-004 | TOI e Recuperação de Consumo | Validação probatória de TOI antes de cobrar ou defender. |
| UC-JE-005 | Corte, Religação e Negativação Segura | Checagem regulatória antes da execução ou defesa do ato. |
| UC-JE-006 | Inteligência Judicial e DATAJUD | Classificação de processos, litigiosidade e estatística por comarca. |
| UC-JE-007 | Compliance LGPD e Auditoria de IA | Fluxos com dados pessoais, prompts e trilhas de auditoria. |
| UC-JE-008 | Dashboard, KPIs e Conselho | Relatórios executivos, ROI e alertas de indicadores. |

---

## Workflows

| Workflow | Pipeline |
|---|---|
| `wf-active-collection` | Roteamento → intake → score → (NegativeSafe) → comunicação → LGPD → **validação humana**. |
| `wf-passive-defense` | Roteamento → intake → (CorteSafe/NegativeSafe) → estratégia → teses → LGPD → **validação humana**. |
| `wf-toi-review` | Roteamento → intake → robustez TOI → teses → (rota de cobrança) → **validação humana**. |
| `wf-cut-negativation-safety` | Roteamento → intake → CorteSafe ∥ NegativeSafe → aviso humanizado → **validação humana**. |

Todos os workflows terminam no gate QG-JE-004: nenhum ato sensível é executado pelo squad.

---

## Como usar

```text
@jurisenergy-recovery:juris-orchestrator

"Chegou uma ação de dano moral por negativação após pagamento, comarca de Porto Velho.
Classifique, monte o checklist e proponha a estratégia."
```

O orquestrador identifica polo passivo + tema negativação, aciona intake, NegativeSafe e defesa passiva, consolida a recomendação e entrega o pacote para validação do advogado responsável.

---

## Humanização da automação

Nos fluxos de cobrança extrajudicial e comunicação setorial, a IA adota postura clara, objetiva, respeitosa e orientada à solução — sem linguagem agressiva, robótica ou padronizada em excesso — preservando segurança jurídica e imagem institucional (gate QG-JE-006).

---

## Estrutura do squad

```text
squads/jurisenergy-recovery/
├── agents/          # 12 agentes com persona, voice_dna, heuristics e guardrails
├── tasks/           # 12 tasks executáveis
├── templates/       # 5 templates de saída (roteamento, dossiê, TOI, defesa, KPI)
├── data/            # guardrails, mapa de KPIs e checklists documentais
├── workflows/       # 4 pipelines encadeando tasks e gates
├── checklists/      # gates de validação humana, documental e LGPD
├── config.yaml
└── README.md
```

---

## Aviso

Este squad é uma camada de apoio (LegalOps). Nenhuma saída substitui a atuação de advogado habilitado; atos processuais, cortes, negativações e acordos dependem sempre de decisão humana registrada em trilha de auditoria.
