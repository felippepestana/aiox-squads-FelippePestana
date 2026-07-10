# ⚖️⚡ JurisEnergy Recovery Platform — Arquitetura Multiagente

Squad AIOX que implementa a **camada de automação jurídica humanizada, auditável e juridicamente segura** da JurisEnergy Recovery Platform, para o contencioso de distribuidoras de energia (caso Energisa): cobrança ativa, defesa passiva consumerista, TOI, corte/religação/negativação segura, inteligência judicial DATAJUD, comunicação humanizada, compliance LGPD e KPIs de Conselho.

> **Fonte da especificação:** [Arquitetura Multiagente — JurisEnergy Recovery Platform (Notion)](https://app.notion.com/p/398008359d9e8137b1bdd38220513fa1)

## Princípio central

O sistema multiagente **não substitui a decisão jurídica**. Ele automatiza triagem, leitura, extração, classificação, checklist, sugestão de estratégia, minuta assistida e relatórios — mantendo **advogado responsável nos pontos críticos**. Nenhuma judicialização, corte, negativação ou defesa é efetivada sem validação humana.

## Objetivos (indicadores-alvo)

- Aumentar recuperação líquida e reduzir custo por real recuperado;
- Reduzir improcedência em cobranças e em TOI;
- Reduzir dano moral em demandas passivas;
- Aumentar taxa de improcedência favorável à Energisa;
- Reduzir prescrição e melhorar índice de prova documental completa;
- Reduzir falhas em TOI, corte, negativação, atendimento e cálculo;
- Transformar dados judiciais e operacionais em melhoria contínua.

## Arquitetura (cadeia de comando)

| Tier | Agente | Papel | Risco |
|------|--------|-------|-------|
| **0 — Chief** | `juris-recovery-chief` | Orquestrador Jurídico Central: polo, tema, roteamento, consolidação e trilha de auditoria | Crítico |
| **1 — Master** | `datajud-intelligence-analyst` | Dados, DATAJUD e inteligência judicial (CNJ/TPU) | Alto |
| **1 — Master** | `document-intake-analyst` | Intake e saneamento documental com pendências setoriais | Alto |
| **1 — Master** | `recovery-score-analyst` | Score de viabilidade e judicialização seletiva com ROI | Alto |
| **1 — Master** | `passive-defense-strategist` | Defesa passiva consumerista, tese e acordo mitigador | Crítico |
| **2 — Specialist** | `toi-legal-builder` | Robustez jurídica e técnica de TOI | Crítico |
| **2 — Specialist** | `cortesafe-analyst` | Segurança regulatória de corte e religação | Crítico |
| **2 — Specialist** | `negativesafe-analyst` | Prevenção de negativação indevida | Crítico |
| **2 — Specialist** | `humanized-communication-writer` | Comunicação humanizada e juridicamente segura | Médio |
| **3 — Support** | `jurisprudence-quality-reviewer` | Jurisprudência, teses e quality gate jurídico | Alto |
| **3 — Support** | `kpi-council-reporter` | Dashboards, KPIs e narrativa de Conselho | Alto |
| **3 — Support** | `lgpd-compliance-auditor` | LGPD, minimização, retenção e auditoria de IA | Crítico |

## Lógica de funcionamento

1. O caso entra pela plataforma.
2. O orquestrador identifica **polo** (ativo, passivo, pré-contencioso, administrativo) e **tema** (cobrança, TOI, corte, negativação, religação, dano elétrico, infraestrutura, ação coletiva).
3. O caso é roteado ao(s) agente(s) apropriado(s).
4. Os agentes extraem dados, validam documentos, calculam scores e identificam riscos.
5. O orquestrador consolida a recomendação com justificativa, fonte e nível de confiança.
6. **O advogado valida, ajusta ou bloqueia.**
7. O resultado alimenta dashboards, KPIs e base de aprendizado.

## Regras estruturantes

- Todo agente tem escopo delimitado e produz saída estruturada.
- Toda recomendação jurídica sensível exige revisão humana.
- Todo documento faltante gera pendência objetiva para o setor responsável.
- Toda decisão automatizada possui justificativa, fonte e nível de confiança.
- Toda classificação é rastreável ao documento analisado.
- O orquestrador impede judicialização, corte, negativação ou defesa automática sem validação jurídica.

Os limites do que cada agente **pode** e **não pode** automatizar estão em [`data/agent-guardrails.yaml`](data/agent-guardrails.yaml).

## Como usar

```text
@jurisenergy-recovery:juris-recovery-chief
```

Exemplos de acionamento:

```text
# Cobrança ativa
"Recebemos uma carteira de 200 débitos comerciais para análise de cobrança."

# Defesa passiva
"Fomos citados em ação de dano moral por negativação após pagamento."

# TOI
"Validar este TOI antes de cobrar a recuperação de consumo."

# Corte seguro
"Este lote de cortes está apto para execução na sexta-feira?"
```

## Workflows

| Workflow | Pipeline |
|----------|----------|
| [`wf-active-recovery`](workflows/wf-active-recovery.yaml) | Triagem → intake → score → NegativeSafe/CorteSafe → comunicação → qualidade → **validação humana** |
| [`wf-passive-defense`](workflows/wf-passive-defense.yaml) | Triagem → intake → reconstrução do ato → estratégia → qualidade → **validação humana** |
| [`wf-toi-safe-collections`](workflows/wf-toi-safe-collections.yaml) | Triagem → intake → robustez TOI → segurança de execução → comunicação → LGPD → **validação humana** |

## Estrutura

```text
squads/jurisenergy-recovery/
├── agents/          # 12 agentes (Tier 0-3) com persona, prompt-base e guardrails
├── tasks/           # 12 tasks executáveis
├── templates/       # Triagem, dossiê de cobrança, estratégia de defesa e relatório de KPIs
├── data/            # Mapa dos squads, guardrails por agente e catálogo de KPIs
├── workflows/       # 3 pipelines com human gate obrigatório
├── checklists/      # Validação humana, prova documental e LGPD
├── config.yaml      # Configuração do squad
└── README.md
```

## Humanização da automação

A automação evita linguagem agressiva, robótica ou padronizada em excesso. Nos fluxos de cobrança extrajudicial e comunicação setorial, a IA adota postura clara, objetiva, respeitosa e orientada à solução, preservando segurança jurídica e imagem institucional.

## Aviso legal

Este squad produz **apoio analítico e minutas assistidas**. Nenhuma saída substitui a atuação de advogado habilitado. Atos jurídicos sensíveis exigem validação humana registrada em trilha de auditoria (ver [`checklists/human-validation-gate-checklist.md`](checklists/human-validation-gate-checklist.md)).
