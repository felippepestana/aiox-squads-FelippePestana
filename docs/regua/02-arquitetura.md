# 02 — Arquitetura da Solução

## Stack recomendado (do blueprint)

| Camada | Escolha | Por quê |
|---|---|---|
| Frontend/portais | **Next.js** (App Router, monorepo Turborepo) | SSR para dashboards; 3 apps (backoffice, instituição, devedor) |
| Dados | **Supabase/Postgres com RLS** | RLS isola dados por instituição (multi-tenant lógico) e por perfil; auditoria nativa |
| Esteira/orquestração | **Temporal** (ou **Trigger.dev**, alternativa TS-native) | Durable execution para prazos processuais longos e réguas; replay determinístico; recuperação pós-crash. Temporal exige ~2–4GB RAM + Postgres — se o ônus operacional pesar no MVP, começar com Trigger.dev |
| Filas leves | **BullMQ (Redis)** | Envios em lote, throttling de WhatsApp |
| WhatsApp | **Cloud API oficial** (massa) + Evolution/Baileys (só fluxos internos) | Oficial evita banimento; per-message pricing exige segmentação |
| Atendimento humano | **Chatwoot** | Caixa omnichannel quando o bot escala |
| Pagamentos | **Asaas** (Pix/boleto/cartão, negativação Serasa integrada, régua nativa) | Custo transacional baixo; alternativas Efí/Iugu/Banco Inter por tarifa em volume |
| Agentes IA | Orquestração supervisor-worker + roteamento multi-provider | Ver mapa de reuso abaixo |
| Judicial | API DataJud/CNJ + `busca-processos-judiciais` (TS) | Acompanhamento; peticionamento por RPA/tribunal só em V2 |
| Cálculo | Engine **REPACTUA** | Débito/juros/correção/acordos determinísticos + memória de cálculo (Tema 474 STJ) |
| Docs jurídicos | Templates DOCX/PDF + squad de agentes | Notificações, confissões de dívida, petições em massa |
| Hospedagem | Railway + Cloudflare Workers/D1/KV | Workers no edge para o portal do devedor |

## Módulos (8)

1. **Ingestão de carteiras (ETL):** planilhas / ERPs escolares; higienização (CPF/telefone/e-mail), enriquecimento, dedupe, validação de boletos.
2. **Motor de régua multicanal:** WhatsApp/e-mail/SMS/voz por aging; trilha extrajudicial (notificação → negativação → protesto). Temporal orquestra.
3. **Motor de negociação e acordos:** descontos por aging com **alçadas**; simulador; confissão de dívida (reinicia prescrição); parcelamento Pix/boleto.
4. **Esteira judicial (V1):** decisão execução vs. monitória vs. cobrança vs. JEC pela documentação; petições por template; acompanhamento DataJud.
5. **Portal da instituição:** dashboards de carteira/aging/recuperação, aprovações de alçada, relatórios.
6. **Portal do devedor (mobile-first):** consulta, negociação assistida, Pix/boleto, 2ª via, acordos.
7. **Camada de agentes IA:** negociador WhatsApp com guardrails; classificador de documentos; gerador de peças — ver `squads/toga-recupera/`.
8. **Compliance e auditoria:** trilha completa, consentimentos, logs de contato (prova anti-abuso), triagem de superendividamento, retenção/eliminação LGPD.

## Modelo de dados central

```text
Instituicao (cliente/credora)
  └─ Carteira (lote ingerido, contrato de honorários, success fee %)
       └─ Contrato (educacional; tem_2_testemunhas? tem_assinatura? → define via processual)
            └─ Devedor (responsável financeiro) ─┬─ Aluno (menor; dados minimizados)
                 └─ Parcela (vencimento; valor; status; aging; prescrita?)
                      ├─ EventoCobranca (canal, timestamp, resultado, CPC?)
                      ├─ Acordo (desconto, parcelamento, confissao_divida_id)
                      │    └─ Pagamento (Pix/boleto; conciliação CNAB)
                      ├─ ProcessoJudicial (tipo; nº CNJ; movimentações DataJud)
                      └─ Negativacao / Protesto (órgão, data, baixa)
       ├─ Alcada (nível de desconto aprovável por instituição/backoffice)
       └─ TrilhaAuditoria (LGPD, consentimentos, acessos)
```

Regras estruturais:
- `Parcela.prescrita` é **calculada e bloqueante** em todo fluxo (regra P1 do doc 05).
- `Contrato.tem_assinatura` + `tem_2_testemunhas` alimentam o motor de decisão da via processual (V1).
- RLS: instituição enxerga apenas a própria `Carteira`; devedor enxerga apenas as próprias `Parcela`/`Acordo`.

## Mapa de reuso — ativos já existentes neste repositório

| Necessidade RÉGUA | Ativo existente | Como reusar |
|---|---|---|
| Validação CPF/CNPJ/e-mail na ingestão (E1) | `web/server/validation/br-docs.ts` | Importar/portar as funções `isValidCPF`/`isValidCNPJ`/`isValidEmail` |
| Cliente WhatsApp + normalização de telefone BR | `legendarios-top/src/lib/whatsapp.ts` | Padrão de cliente; trocar Evolution → Cloud API oficial para massa (Evolution só interno) |
| Base da engine REPACTUA | `analista-processual-web/src/lib/agents/agents/calculator.ts` (+ testes em `__tests__/calculator.test.ts`) | Forkar a estrutura (classe determinística + tabela de regras + testes) trocando prazos CPC por juros/correção/multa |
| Orquestração multiagente TS | `analista-processual-web/src/lib/agents/` (`workflow.ts`, `chief.ts`) | Padrão supervisor-worker com callbacks de progresso |
| Roteamento multi-provider de LLM | `analista-processual-web/src/lib/agents/llm-gateway.ts` | Reusar direto (tiers budget/standard/premium por complexidade) |
| Extração/classificação de documentos (PDF) | `analista-processual-web/src/lib/agents/agents/extractor.ts` + `squads/analista-processual/agents/leitor-de-pecas.md` | Base do classificador de documentação de carteira (contrato assinado? testemunhas?) |
| Redação de notificação extrajudicial e peças | `squads/analista-processual/` (UC-AP-005, `tasks/elaborar-peca-processual.md`, `templates/peca-processual-tmpl.md`) | O squad `toga-recupera` delega a redação a este squad |
| Estratégia de execução/cumprimento | `squads/analista-estrategista-processual-civil/` (UC-AEPC-005) | Consultoria de estratégia judicial em V1 |
| Exemplo trabalhado de ação de cobrança | `squads/squad-juridico-legal-performance/examples/processo-civil-acao-cobranca.md` | Referência de qualidade para as peças de cobrança |
| Design system tematizável | `web/client/src/design-system/tokens.css` + `components.css` | Adicionar token set "Toga Noturna" (doc 04) sem reconstruir componentes |
| Impressão de documentos (minutas) | `web/client/src/minutas/` (print.css) | Padrão para notificações/confissões imprimíveis |
| Persistência Supabase + repositórios | `supabase/migrations/`, `web/server/db/repositories.ts` | Padrão de migrations e repositórios com escopo por organização |
| Upload de arquivos (Files API, PDF) | `chatbot/src/files.ts`, `web/server/files.ts` | Plumbing de upload para o classificador de documentos |

## Net-new (não existe no repo — construir)

- **MCP servers jurídicos:** DataJud/CNJ, consulta OAB, jurisprudência (hoje a pesquisa jurisprudencial é via WebSearch nos squads — suficiente para MVP; MCPs em V1).
- **Engine REPACTUA** (financeira) — forkar `calculator.ts` como esqueleto.
- **Pipeline de classificação de PDFs de carteira** — estender `extractor.ts`/`leitor-de-pecas`.
- **Domínio de cobrança educacional** (modelo de dados, régua, acordos) — todo novo.
- **Marca "Toga Noturna"** — tokens no doc 04; nenhum brandbook Toga existe no repo hoje.

## Referências externas priorizadas (do blueprint)

- Dunning/domínio: `killbill/killbill` (referência conceitual, não rodar). Pix: `bacen/pix-api` (contrato oficial), `pix-utils`/`brcode` (TS). Boleto: `mrmgomes/boleto-utils` (TS, fator de vencimento 2025 — usar direto). Judicial: `joaotextor/busca-processos-judiciais` (TS, DataJud). Workflow: `temporalio/temporal` ou `triggerdotdev/trigger.dev`.
- ⚠️ Licenças: Lago é AGPLv3 (isolar se usar); Evolution API tem cláusula de marca; validar cada licença antes de incorporar código.
