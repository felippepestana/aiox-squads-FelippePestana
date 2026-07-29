# Exemplo — Cobrança ativa de carteira inadimplente

## Objetivo

Demonstrar a execução esperada do `UC-JE-002` (workflow `wf-active-collection`) para uma carteira de débitos comerciais, combinando intake documental, score de viabilidade, régua extrajudicial humanizada, checagem LGPD e gate de validação humana.

## Input fictício

```text
Recebemos do setor comercial uma carteira com 180 débitos de UCs comerciais em Porto Velho e Ji-Paraná, valores entre R$ 600 e R$ 38.000, vencimentos entre 2022 e 2025. Parte tem acordo descumprido, parte nunca foi notificada. Quero priorizar a cobrança, saber o que dá para judicializar com ROI positivo e montar a régua extrajudicial dos demais.
```

## Classificação esperada

| Campo | Valor |
|---|---|
| Polo | Ativo |
| Tema | Cobrança |
| UC | `UC-JE-002` |
| Workflow | `wf-active-collection` |
| Validação humana | Obrigatória antes de qualquer judicialização |

## Rota esperada

```text
juris-orchestrator
-> document-intake-validator
-> recovery-score-analyst
-> negativesafe-validator (apenas débitos com rota de negativação)
-> humanized-communication-writer
-> lgpd-compliance-auditor
-> juris-orchestrator (gate QG-JE-004: advogado valida, ajusta ou bloqueia)
```

## Saída esperada resumida

### 1. Intake documental

| Resultado | Esperado |
|---|---|
| Checklist aplicado | `active-collection` (data/document-checklists.yaml) |
| Casos aptos | Somente com faturas, titularidade, histórico e notificação presentes |
| Pendências | Devolvidas por setor (Comercial, Financeiro, Cobrança) com documento e impacto |
| Débitos sem notificação | Marcados `pendente de saneamento` — não avançam |

### 2. Score de viabilidade

| Faixa | Rota esperada |
|---|---|
| Score alto + valor relevante + prova completa | Candidato a judicialização seletiva, com dossiê (`templates/recovery-dossier-tmpl.md`) |
| Score médio | Régua extrajudicial com proposta de acordo |
| Prescrição provável | Rota judicial BLOQUEADA; tratativa extrajudicial ou arquivamento |
| Antieconômico (ROI negativo) | Arquivamento recomendado |

Cada score deve vir decomposto (prova documental, titularidade, prescrição, histórico, comarca) com justificativa e nível de confiança.

### 3. Régua extrajudicial humanizada

- Mensagens sem ameaças nem tom robótico, sempre com caminho de solução (canais, opções, prazo).
- Dados pessoais minimizados conforme orientação LGPD.
- Comunicações sensíveis marcadas para aprovação antes do envio.

### 4. Gate de validação humana

- Nenhuma ação é protocolada pelo squad.
- Dossiês entregues ao advogado responsável com decisão registrada em trilha de auditoria: validado / ajustado / bloqueado.

## Quality gates esperados

- `QG-JE-001`: polo, tema e rota declarados antes da análise.
- `QG-JE-002`: caso classificado apto/pendente/bloqueado com pendências por setor.
- `QG-JE-003`: score decomposto com justificativa, fonte e confiança.
- `QG-JE-004`: judicialização condicionada a advogado.
- `QG-JE-005`: minimização e trilha LGPD aplicadas.
- `QG-JE-006`: comunicação clara, respeitosa e orientada à solução.

## Critério de aprovação do exemplo

O exemplo passa se a saída final priorizar a carteira em quatro rotas (extrajudicial, acordo, judicialização seletiva, arquivamento), bloquear débitos prescritos ou sem prova, devolver pendências setoriais objetivas e condicionar todo ato sensível à validação humana — sem inventar documentos não fornecidos.
