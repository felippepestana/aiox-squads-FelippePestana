# Task: Gerar Relatório Imobiliário

**ID:** `pd-gerar-relatorio`
**Executor:** `relator-imobiliario`
**Tier:** Tier Síntese
**Use Cases:** Todos (UC-PD-001~007, UC-PD-ALL)

## Overview

Consolida todos os outputs dos agentes em um relatório analítico estruturado ou Laudo de Avaliação Imobiliária, salvando o arquivo final no workspace.

## Input

- Outputs de todos os agentes ativados no pipeline
- Modo de relatório definido pelo property-data-chief:
  - MODO_COMPLETO: levantamento exaustivo
  - MODO_LAUDO: Laudo de Avaliação ABNT
  - MODO_REGISTRAL: apenas dados registrais
  - MODO_JURIDICO: foco em legislação

## Output

Relatório/Laudo final em Markdown, salvo no workspace via Write:
- Formato conforme template aplicável
- Todas as fontes rastreadas no bloco de citações
- Dados com grau de confiança mantido

## Action Items

1. Receba o modo de relatório do property-data-chief
2. Selecione o template adequado:
   - MODO_COMPLETO/REGISTRAL/JURIDICO → relatorio-imobiliario-tmpl.md
   - MODO_LAUDO → laudo-avaliacao-tmpl.md
3. Popule cada seção do template com dados dos agentes
4. Para dados marcados [NÃO ENCONTRADO]: registre no relatório e recomende consulta presencial
5. Para dados com divergências entre agentes: apresente ambas versões
6. Compile bloco de citações com todas as fontes, datas e tipos
7. Use Write para salvar o relatório final no workspace
8. Informe o caminho do arquivo salvo ao property-data-chief

## Acceptance Criteria

- [ ] Template correto selecionado e preenchido
- [ ] Todas as seções aplicáveis populadas com dados dos agentes
- [ ] Bloco de citações presente com todas as fontes rastreadas
- [ ] Arquivo salvo no workspace via Write
- [ ] Dados [NÃO ENCONTRADO] registrados com recomendação
- [ ] Divergências entre agentes sinalizadas
