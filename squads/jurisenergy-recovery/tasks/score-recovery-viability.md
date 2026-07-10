# Task: Calcular Viabilidade de Cobrança

**Executor:** `recovery-score-analyst`
**Squad:** `jurisenergy-recovery`

## Objetivo

Calcular a viabilidade jurídico-financeira da cobrança ativa, priorizar a carteira e recomendar rota extrajudicial ou judicialização seletiva com ROI positivo.

## Inputs

- Débitos, faturas, titularidade, pagamentos, acordos, prescrição, comarca e documentos.
- Score documental do intake e risco territorial do DATAJUD.

## Passos

1. Verificar exigibilidade: valor, vencimento, prescrição, titularidade e prova documental.
2. Ponderar histórico de pagamento, comarca e risco de dano moral reverso.
3. Gerar score de viabilidade 0-100 com justificativa objetiva.
4. Recomendar rota: régua extrajudicial, acordo, judicialização seletiva ou arquivamento.
5. Montar dossiê de judicialização (template `recovery-dossier-tmpl.md`) para os casos aptos.

## Critérios de Aceite

- [ ] Score 0-100 com justificativa, fonte e nível de confiança (QG-JR-003).
- [ ] Prescrição iminente sinalizada como crítica.
- [ ] Rota recomendada com indicação de ROI.
- [ ] Documentos faltantes devolvidos como pendência.

## Observações de Segurança

- Não protocolar ação, assinar peça ou assumir risco jurídico sem advogado (QG-JR-004).
- Judicialização recomendada apenas com ROI positivo e prova documental completa.
