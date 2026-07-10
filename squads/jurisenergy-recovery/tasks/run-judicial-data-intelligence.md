# Task: Executar Inteligência Judicial (DATAJUD/TPU)

**Executor:** `datajud-intelligence-analyst`
**Squad:** `jurisenergy-recovery`

## Objetivo

Extrair, limpar, classificar e cruzar dados judiciais (DATAJUD, PJe, CNJ/TPU e bases internas) para gerar inteligência territorial e estatística.

## Inputs

- Metadados DATAJUD, classes, assuntos, movimentos, órgão julgador e grau.
- Processos internos, decisões e comarcas.

## Passos

1. Classificar classe, assunto, movimento, órgão julgador, grau e tema executivo.
2. Deduplicar registros preliminarmente e sinalizar inconsistências.
3. Marcar dados ausentes como pendentes de validação — nunca inventar.
4. Agrupar por tema e comarca; gerar mapa de litigiosidade e rankings.
5. Publicar indicadores de procedência, improcedência e dano moral por território.

## Critérios de Aceite

- [ ] Base classificada e deduplicada com fonte por registro.
- [ ] Lacunas marcadas como pendentes de validação.
- [ ] Ranking de temas e mapa de litigiosidade por comarca gerados.
- [ ] Nenhum resultado processual atribuído sem movimento/decisão suficiente.

## Observações de Segurança

- Não validar mérito sem inteiro teor.
- Separar dado confirmado de estimativa em todo indicador (QG-JR-008).
