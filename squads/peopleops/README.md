# PeopleOps — Departamento Pessoal & Folha

> 🟢 **Ativo.** Módulo construído da plataforma [Apex-Talent](../apex-talent/). Cobre o ciclo de vida de **DP & Folha**: admissão digital, folha de pagamento explicável, eventos eSocial e prazos, férias, afastamentos e rescisão — encerrando num **gate de fechamento de folha** obrigatório (anomalias + privacidade) antes de qualquer fechamento. A IA é suporte à decisão e à conformidade; transmissões oficiais e decisões trabalhistas ficam com profissionais habilitados.

## Área

**Departamento Pessoal & Folha** — parte da suíte de RH AI-native Apex-Talent.

Ciclo de vida ponta a ponta: admissão digital com coleta de documentos, preparação e explicação de folha (proventos/descontos, INSS/IRRF/FGTS), mapeamento de eventos eSocial com prazos, gestão de férias/afastamentos/rescisão e auditoria de fechamento.

## Princípio central

**Conformidade primeiro, clareza sempre.** Tudo é ancorado em CLT/eSocial/LGPD vigentes e explicado em linguagem simples. A IA **prepara** e **explica** — nunca **transmite** uma obrigação oficial (eSocial, FGTS, GFIP) nem decide um desligamento sozinha; isso fica com um humano responsável. **Nenhuma folha fecha sem passar pelo `payroll-auditor`.** Dados pessoais e financeiros são tratados como sensíveis (LGPD): coleta mínima, sem segredos ou documentos completos em log.

## Agentes

| Agente | Tier | Papel |
|--------|------|-------|
| `peopleops-chief` | T0 | Orquestra o ciclo; enquadra a necessidade; impõe o gate de fechamento |
| `admission-officer` | T1 | Admissão digital, documentos e contrato (S-2200 pronto antes do dia 1) |
| `payroll-analyst` | T1 | Folha rastreável (proventos/descontos/FGTS) e explicação de holerite |
| `esocial-compliance` | T2 | Mapa de eventos eSocial, prazos e conformidade CLT |
| `leave-manager` | T2 | Férias, afastamentos e rescisão (com prazos e verbas) |
| `payroll-auditor` | T3 | **Gate de fechamento** — auditoria de anomalias + privacidade (poder de veto) |

## Fluxo (workflow `wf-personnel-lifecycle`)

```text
INTAKE ─▶ ADMISSION ─▶ PAYROLL ─▶ COMPLIANCE & LIFECYCLE ─▶ PAYROLL CLOSE GATE
chief     admission-     payroll-    esocial-compliance /     payroll-auditor (veto)
          officer        analyst      leave-manager
```

## Como usar

Selecione `peopleops:peopleops-chief` no chatbot ou na web e descreva a necessidade.

Comandos do Chief:

- `*digital-admission` — conduz a admissão digital (documentos, contrato, S-2200)
- `*run-payroll` — prepara a folha e explica o holerite
- `*check-esocial` — mapeia eventos eSocial, prazos e conformidade
- `*manage-leave` — processa férias, afastamentos e rescisão
- `*audit-payroll` — roda o gate de fechamento (PASS/VETO)
- `*help` — lista os comandos
- `*exit` — encerra o agente

## Conexões com a plataforma

- **← `org-architect`** — cargo, faixa e leveling definidos chegam para a admissão/folha.
- **← `talent-compass`** — uma contratação concluída vira admissão digital aqui.
- **→ `apex-talent`** — necessidades fora de DP/folha voltam pelo orquestrador da plataforma.
- **↔ `profiler-dna`** — contexto comportamental é apenas consultivo, nunca filtro de pay/seleção.

## Documentação de referência

- [`data/clt-essentials.md`](data/clt-essentials.md) — fundamentos de contrato, verbas e rescisão (CLT).
- [`data/esocial-events.md`](data/esocial-events.md) — catálogo de eventos eSocial, prazos e dependências.
- [`data/payroll-calculation.md`](data/payroll-calculation.md) — ordem de cálculo (INSS, IRRF, FGTS, verbas).
- [`data/privacy-lgpd.md`](data/privacy-lgpd.md) — privacidade e minimização de dados (LGPD).

## Minutas / impressos

- [`templates/termination-statement.md`](templates/termination-statement.md) — demonstrativo de rescisão (minuta imprimível, não oficial).

## Guardrail de fechamento

- [`checklists/payroll-close-gate.md`](checklists/payroll-close-gate.md) — checklist PASS/VETO do `payroll-auditor`.

## Referência

Baseado em: *CLT*, layouts e prazos do *eSocial* (S-2200, S-1200, S-2230, S-2299), cálculo de folha (INSS progressivo, IRRF, FGTS) e princípios de privacidade da *LGPD*. Tabelas e percentuais mudam — confirme sempre os valores oficiais vigentes.
