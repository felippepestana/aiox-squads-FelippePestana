# Task: Classificar Dados Judiciais

**Executor:** `datajud-intelligence-analyst`
**Squad:** `jurisenergy-recovery`

## Objetivo

Extrair, limpar, classificar e cruzar metadados processuais (DATAJUD, TJRO/PJe, CNJ/TPU e bases internas), gerando base deduplicada e inteligência territorial.

## Inputs

- Metadados DATAJUD, classes, assuntos, movimentos, órgão julgador, grau e bases internas.

## Passos

1. Classificar classe, assunto e movimento conforme TPU/CNJ.
2. Deduplicar registros entre bases e sinalizar divergências.
3. Agrupar por tema executivo, comarca e resultado quando houver decisão.
4. Marcar lacunas como pendentes de validação — nunca inferir dado ausente.
5. Gerar mapa de litigiosidade e ranking de temas com amostra e período.

## Critérios de Aceite

- [ ] Base classificada e deduplicada com rastreabilidade ao registro-fonte.
- [ ] Lacunas e inconsistências declaradas.
- [ ] Indicadores com amostra, período e status (confirmado/estimado/pendente).

## Observações de Segurança

- Não atribuir resultado processual sem movimento ou decisão suficiente.
- Não validar mérito sem inteiro teor.
