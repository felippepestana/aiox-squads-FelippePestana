# Smoke Tests — JurisEnergy Recovery Platform

Cenários funcionais mínimos para validar se o squad roteia, analisa e bloqueia corretamente, sempre terminando no gate de validação humana.

## Como usar

1. Ative `@jurisenergy-recovery:juris-orchestrator`.
2. Execute um cenário por vez com o input sugerido.
3. Compare polo/tema, UC, rota de agentes, quality gates e entregáveis com o esperado.
4. Registre divergências como ajuste de agente, task, workflow ou checklist.

## Critério geral de aprovação

- O `juris-orchestrator` identifica polo e tema antes de acionar qualquer frente.
- A rota declarada bate com o `config.yaml` e o workflow correspondente.
- Documento obrigatório ausente gera pendência objetiva com setor responsável — nunca suposição.
- Toda decisão automatizada traz justificativa, fonte e nível de confiança.
- Nenhum fluxo executa judicialização, corte, negativação, protocolo de defesa ou envio externo sensível sem o gate `QG-JE-004`.

---

## Cenário 1 — Cobrança ativa de carteira

Exemplo preenchido: [`examples/cobranca-carteira-inadimplente.md`](examples/cobranca-carteira-inadimplente.md).

- **Input:** carteira de 180 débitos comerciais, parte sem notificação, parte com acordo descumprido.
- **UC esperado:** `UC-JE-002` (workflow `wf-active-collection`).
- **Valida:** checklist documental por demanda, score decomposto, bloqueio de prescritos, quatro rotas de saída, régua humanizada, LGPD e gate humano.

## Cenário 2 — Defesa passiva por negativação

Exemplo preenchido: [`examples/defesa-negativacao-indevida.md`](examples/defesa-negativacao-indevida.md).

- **Input:** ação de dano moral com liminar; cronologia pagamento × inscrição controversa.
- **UC esperado:** `UC-JE-003` (workflow `wf-passive-defense`).
- **Valida:** priorização por liminar, verificação NegativeSafe como subsídio, separação fato × hipótese, tese com precedente e fonte, acordo mitigador quando a falha se confirma, minuta assistida e decisão do advogado.

## Cenário 3 — TOI com contraditório falho

Exemplo preenchido: [`examples/toi-sem-notificacao.md`](examples/toi-sem-notificacao.md).

- **Input:** TOI com prova material boa, mas sem notificação ao consumidor.
- **UC esperado:** `UC-JE-004` (workflow `wf-toi-review`).
- **Valida:** recomendação de sanear (não cobrar), robustez decomposta, risco de improcedência declarado, não acionamento do Recovery Score e ausência de afirmação conclusiva de fraude.

## Cenário 4 — Corte bloqueado por pagamento

- **Input:** corte programado para amanhã; pagamento identificado hoje pela manhã.
- **UC esperado:** `UC-JE-005` (workflow `wf-cut-negativation-safety`).
- **Valida:** veredito BLOQUEADO sem exceção automatizada, justificativa com documento-fonte e escalonamento humano.

## Cenário 5 — Negativação com contestação pendente

- **Input:** pedido de negativação de CPF com contestação aberta no PROCON na semana anterior.
- **UC esperado:** `UC-JE-005`.
- **Valida:** veredito BLOQUEADO, documentos faltantes listados e reavaliação condicionada à resposta da contestação.

## Cenário 6 — Relatório executivo para o Conselho

- **Input:** pedido de relatório trimestral com recuperação líquida, êxito e dano moral por mil cobranças.
- **UC esperado:** `UC-JE-008`.
- **Valida:** todo KPI com fonte/período/amostra e status (confirmado/estimado/pendente), comparação com baseline, pontos de decisão e limitações metodológicas — com revisão humana antes da distribuição.
