# Task: Pesquisar Registro do Imóvel

**ID:** `pd-pesquisar-registro`
**Executor:** `pesquisador-registral`
**Tier:** Tier 1
**Use Cases:** UC-PD-001, UC-PD-ALL

## Overview

Pesquisa e compila dados registrais do imóvel nas 5 dimensões padronizadas, cruzando com dados já extraídos pelo leitor-documental quando disponíveis.

## Input

- Endereço completo do imóvel
- Dados extraídos pelo leitor-documental (quando disponíveis)
- Número de matrícula (quando informado)

## Output

Relatório registral estruturado com:
- Dados de matrícula e cadeia dominial
- Certidões localizadas (habite-se, ônus, IPTU)
- Dados cadastrais municipais
- Situação fiscal
- Divergências entre documento fornecido e pesquisa online (quando aplicável)

## Action Items

1. Pesquise a matrícula do imóvel via WebSearch (cartórios online, e-Certidão)
2. Pesquise a cadeia dominial (histórico de proprietários)
3. Pesquise certidão de habite-se no portal da prefeitura
4. Pesquise dados cadastrais municipais (inscrição, área, confrontações)
5. Pesquise situação fiscal (IPTU, dívida ativa, débitos)
6. Se imóvel rural: pesquise também INCRA (CCIR) e CAR
7. Se condomínio: pesquise fração ideal e área privativa
8. Cruze dados com outputs do leitor-documental — sinalize divergências

## Acceptance Criteria

- [ ] Mínimo 3 das 5 dimensões pesquisadas com dados encontrados
- [ ] Todas as fontes citadas com URL/referência e data de consulta
- [ ] Divergências com dados do leitor-documental sinalizadas (quando aplicável)
- [ ] Campos não encontrados marcados como [NÃO ENCONTRADO — consulta presencial recomendada]
