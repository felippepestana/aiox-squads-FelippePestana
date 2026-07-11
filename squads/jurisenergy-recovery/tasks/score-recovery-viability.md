# Task: Calcular Score de Viabilidade de Cobrança

**Executor:** `recovery-score-analyst`
**Squad:** `jurisenergy-recovery`

## Objetivo

Calcular a viabilidade jurídico-financeira da cobrança (caso a caso ou carteira), propor rota e priorizar judicialização seletiva com ROI positivo.

## Inputs

- Débitos, faturas, titularidade, pagamentos, acordos, prescrição, comarca, precedentes e checklist documental apto.

## Passos

1. Verificar prescrição, titularidade e exigibilidade de cada débito.
2. Calcular score 0-100 decomposto (prova documental, titularidade, prescrição, histórico, comarca).
3. Estimar ROI considerando custo de judicialização, taxa de êxito local e risco de sucumbência.
4. Recomendar rota: régua extrajudicial, acordo, judicialização seletiva ou arquivamento.
5. Gerar dossiê de judicialização (templates/recovery-dossier-tmpl.md) para os casos indicados.

## Critérios de Aceite

- [ ] Score decomposto com justificativa e nível de confiança.
- [ ] Débitos prescritos bloqueados para rota judicial.
- [ ] Rota recomendada com documentos faltantes listados.
- [ ] Dossiês marcados como dependentes de validação do advogado.

## Observações de Segurança

- Não protocolar ação nem assinar peça — o dossiê é insumo para decisão humana.
- Risco de dano moral reverso integra o cálculo de ROI.
