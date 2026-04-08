# Task: Verificar Normas Ambientais

**ID:** `pd-verificar-normas-ambientais`
**Executor:** `analista-ambiental`
**Tier:** Tier 2
**Use Cases:** UC-PD-004, UC-PD-ALL

## Overview

Verifica normas ambientais (federais, estaduais e municipais) que incidem sobre o imóvel, identificando APPs, APAs, exigências de licenciamento e restrições ambientais.

## Input

- Endereço completo do imóvel
- Dados de geolocalização do analista-visual (quando disponíveis)
- Tipo de atividade pretendida (quando informado)

## Output

Tabela de normas ambientais com:
- Norma, artigo, aplicabilidade, restrição, impacto
- Mapa de restrições ambientais (quando identificadas)
- Observações sobre proximidade de cursos d'água, nascentes, áreas protegidas

## Action Items

1. Verifique incidência de APP (Código Florestal, Lei 12.651/12)
2. Pesquise APAs incidentes sobre o endereço via WebSearch
3. Verifique exigências de licenciamento ambiental para atividades no imóvel
4. Pesquise proximidade de cursos d'água e nascentes (imagens de satélite + dados)
5. Pesquise legislação ambiental municipal específica
6. Se atividade potencialmente poluidora: verifique resoluções CONAMA
7. Compile tabela de normas com aplicabilidade e impacto

## Acceptance Criteria

- [ ] Código Florestal verificado (APP/Reserva Legal)
- [ ] Normas ambientais municipais pesquisadas
- [ ] Cada norma com artigo, aplicabilidade e impacto qualificado
- [ ] Restrições ambientais sinalizadas com clareza
