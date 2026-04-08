# Task: Extrair Dados de Documentos

**ID:** `pd-extrair-dados-documentos`
**Executor:** `leitor-documental`
**Tier:** Tier 0.5 (Intake)
**Use Cases:** UC-PD-001, UC-PD-006, UC-PD-007, UC-PD-ALL

## Overview

Lê e extrai dados estruturados de documentos (PDF) e imagens fornecidos pelo usuário, utilizando capacidades multimodais da Anthropic Files API.

## Input

- Arquivos PDF: matrícula, certidão de habite-se, IPTU, certidão negativa, planta
- Imagens: fotos do imóvel, mapas, plantas baixas, capturas de tela

## Output

Dados extraídos em formato YAML estruturado com:
- Campos identificados e seus valores
- Marcador de confiabilidade para cada campo ([EXTRAÍDO], [INFERIDO], [PARCIALMENTE LEGÍVEL])
- Campos não encontrados marcados como [NÃO ENCONTRADO]

## Action Items

1. Use Glob para localizar documentos no workspace (se não fornecidos diretamente)
2. Use Read para ler cada documento/imagem (multimodal)
3. Para PDFs de MATRÍCULA: extraia número, cartório, proprietários, área, confrontações, ônus, averbações
4. Para PDFs de HABITE-SE: extraia número, data, alvará, área construída, uso autorizado
5. Para PDFs de IPTU: extraia inscrição, valor venal, área terreno, área construída, padrão construtivo
6. Para IMAGENS: descreva fachada, materiais visíveis, estado de conservação, pavimentos
7. Para MAPAS/PLANTAS: extraia dimensões, confrontações, orientação, localização
8. Marque cada dado com nível de confiabilidade
9. Retorne dados estruturados ao property-data-chief

## Acceptance Criteria

- [ ] Todos os documentos fornecidos foram lidos
- [ ] Dados extraídos em formato estruturado
- [ ] Cada campo tem marcador de confiabilidade
- [ ] Campos não encontrados sinalizados como [NÃO ENCONTRADO]
- [ ] Nenhum dado inventado — apenas extraído ou inferido (com marcação)
