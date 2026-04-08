# Task: Analisar Imagens do Imóvel

**ID:** `pd-analisar-imagens`
**Executor:** `analista-visual`
**Tier:** Tier 1
**Use Cases:** UC-PD-006, UC-PD-007, UC-PD-ALL

## Overview

Analisa fotos do imóvel, imagens de satélite e mapas públicos para verificar geolocalização, padrão construtivo, estado de conservação, confrontações e entorno, utilizando metodologia OSINT adaptada.

## Input

- Fotos do imóvel fornecidas pelo usuário (via leitor-documental)
- Endereço completo para busca de imagens de satélite
- Dados de matrícula para cruzamento de medidas (quando disponíveis)

## Output

Relatório visual estruturado com:
- Verificação de geolocalização (endereço vs satélite)
- Padrão construtivo observado (tipo, materiais, pavimentos)
- Estado de conservação com classificação
- Confrontações visuais
- Descrição do entorno
- Grau de confiança (6 níveis) para cada observação

## Action Items

1. Se fotos fornecidas: analise materiais, estado, padrão construtivo, pavimentos
2. Use WebSearch para buscar imagens de satélite do endereço
3. Verifique correspondência entre endereço declarado e localização real (geolocalização)
4. Identifique confrontações visuais (vizinhos, limites, vias)
5. Descreva entorno: infraestrutura urbana, serviços próximos, padrão do bairro
6. Se disponível, compare imagens históricas (evolução temporal)
7. Cruze medidas visuais com dados da matrícula — sinalize divergências
8. Atribua grau de confiança (1-6) para cada observação

## Acceptance Criteria

- [ ] Geolocalização verificada com grau de confiança atribuído
- [ ] Padrão construtivo descrito (tipo, materiais, pavimentos)
- [ ] Estado de conservação classificado
- [ ] Entorno descrito com infraestrutura e serviços
- [ ] Cada observação com grau de confiança (Confirmado/Provável/Fraco/etc.)
