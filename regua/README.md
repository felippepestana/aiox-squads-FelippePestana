# @aiox/regua-core

Núcleo de domínio da plataforma **RÉGUA / Toga Recupera** — Sprint 1 do [backlog do MVP](../docs/regua/03-backlog-mvp.md).

## O que está implementado

| Módulo | User stories | Conteúdo |
|---|---|---|
| `src/ingestao/parse.ts` | US-E1.1 | Parser de planilha CSV (vírgula/ponto-e-vírgula, datas BR/ISO, valores BR) com validação linha a linha, relatório de erros e dedupe idempotente por CPF+contrato+competência |
| `src/domain/prescricao.ts` | US-E7.1 | Motor de prescrição — regras P1/P2 de [compliance](../docs/regua/05-compliance-e-guardrails.md): quinquenal por parcela, regra da anuidade (REsp 2.086.705/SP), reinício por confissão de dívida, e guard `assertNenhumaPrescrita` que bloqueia cobrança |
| `src/domain/aging.ts` | US-E7.1/E5.1 | Buckets de aging (0–30/31–60/61–90/91–180/180+/prescrito) e relatório consolidado |
| `src/domain/types.ts` | US-E1.2 | Modelo de domínio (Instituicao → Carteira → Contrato → Devedor/Aluno → Parcela); `Aluno` sem campos de contato por design (LGPD L1) |
| `src/lib/br-docs.ts` | US-E1.1 | Validadores CPF/CNPJ/e-mail (portados de `web/server/validation/br-docs.ts`) |
| `src/lib/phone.ts` | US-E1.1 | Normalização de telefone BR (padrão de `legendarios-top/src/lib/whatsapp.ts`) |
| `supabase/migrations/0001_regua_core.sql` | US-E1.2/E7.2 | Schema `regua` com RLS por instituição e trilha de auditoria append-only |

## Uso

```bash
npm install
npm test        # compila e roda os testes (node --test)
npm run build   # gera dist/
```

```ts
import { parseCarteiraCsv, assertNenhumaPrescrita, agingReport } from "@aiox/regua-core";

const { validas, erros } = parseCarteiraCsv(csv);
// erros: [{ linha, campo, motivo }] — linhas inválidas nunca persistem

assertNenhumaPrescrita(parcelasACobrar, todasDaCarteira, new Date());
// lança erro se qualquer parcela estiver prescrita (regra P1)
```

## Decisão de projeto: prescrição conservadora

Quando o agrupamento por anuidade (`anuidadeId`) é desconhecido, o termo inicial usado é o **vencimento da própria parcela** — que prescreve **antes** da regra da anuidade do REsp 2.086.705/SP. Ou seja: na ausência de informação, o motor **bloqueia mais**, nunca menos. Preencher `anuidadeId` na ingestão libera corretamente as parcelas cujo termo corre da última parcela da anuidade.

## Próximos passos (Sprint 2+)

Régua durável (Temporal/Trigger.dev) + WhatsApp Cloud API (E2), engine REPACTUA de débito atualizado (E3), portais Next.js (E4/E5 — telas via [Claude Design](../docs/regua/04-claude-design-handoff.md)).
