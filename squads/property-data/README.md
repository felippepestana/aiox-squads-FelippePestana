# Property Data Squad

> Squad de 10 agentes para levantamento detalhado de dados imobiliários e avaliação de imóveis conforme ABNT NBR 14653.

## Visão Geral

O **Property Data Squad** é um pipeline especializado em pesquisa imobiliária completa, cobrindo aspectos registrais, jurídicos, urbanísticos, ambientais, condominiais e de avaliação. Suporta leitura multimodal de documentos (PDFs de matrículas, certidões, IPTU) e imagens (fotos do imóvel, satélite, mapas).

## Arquitetura

```
                    🏠 property-data-chief (Orchestrator)
                              │
                    [Classifica UC-PD-001~007]
                              │
                    📑 leitor-documental (Tier 0.5 — Intake)
                    [Lê PDFs, imagens, extrai dados]
                              │
         ┌────────┬───────────┼───────────┬──────────┐
         │        │           │           │          │
       📋       ⚖️          🏗️         🛰️        💰
  pesquisador  analista   analista   analista   avaliador
  registral   legislativo urbanístico  visual    imóvel
  (Tier 1)     (Tier 1)    (Tier 1)   (Tier 1)  (Tier 1)
         │        │           │           │          │
         └────────┴─────┬─────┴───────────┴──────────┘
                        │               │
                      🌿             🏘️
                  analista        analista
                  ambiental      condominial
                  (Tier 2)        (Tier 2)
                        │               │
                        └───────┬───────┘
                                │
                      📝 relator-imobiliario (Síntese)
                                │
                      [Relatório / Laudo Final]
```

## Agentes

| Agente | Tier | Foco |
|--------|------|------|
| 🏠 **property-data-chief** | Orchestrator | Classificação, roteamento, quality gates |
| 📑 **leitor-documental** | Tier 0.5 | Leitura multimodal de PDFs e imagens |
| 📋 **pesquisador-registral** | Tier 1 | Matrícula, certidões, cadeia dominial, IPTU |
| ⚖️ **analista-legislativo** | Tier 1 | Legislação federal/estadual/municipal |
| 🏗️ **analista-urbanistico** | Tier 1 | Plano diretor, zoneamento, uso do solo |
| 🛰️ **analista-visual** | Tier 1 | Fotos, satélite, geolocalização, padrão construtivo |
| 💰 **avaliador-imovel** | Tier 1 | Laudo de avaliação ABNT NBR 14653 |
| 🌿 **analista-ambiental** | Tier 2 | APP, APA, licenciamento, normas ambientais |
| 🏘️ **analista-condominial** | Tier 2 | Convenção, regulamento, atas, aforamento |
| 📝 **relator-imobiliario** | Síntese | Relatório analítico ou Laudo de Avaliação |

## Use Cases

| UC | Demanda | Agentes Ativados |
|---|---|---|
| UC-PD-001 | Pesquisa Registral | leitor-documental + pesquisador-registral |
| UC-PD-002 | Levantamento Legislativo | analista-legislativo |
| UC-PD-003 | Análise Urbanística | analista-urbanistico |
| UC-PD-004 | Verificação Ambiental | analista-ambiental |
| UC-PD-005 | Documentação Condominial | analista-condominial |
| UC-PD-006 | Laudo de Avaliação | leitor-documental + analista-visual + avaliador-imovel |
| UC-PD-007 | Análise Visual/Geoespacial | leitor-documental + analista-visual |
| UC-PD-ALL | Levantamento Completo | TODOS os agentes |

## Início Rápido

```
@property-data:property-data-chief
```

### Comandos

| Comando | Descrição |
|---------|-----------|
| `*levantamento-completo` | Pipeline completo com todos os agentes |
| `*laudo-avaliacao` | Laudo de Avaliação ABNT NBR 14653 |
| `*pesquisa-rapida` | Pesquisa registral + legislação básica |
| `*analise-visual` | Análise de fotos e imagens de satélite |
| `*consulta-legislacao` | Levantamento legislativo do imóvel |
| `*classificar` | Classificar demanda em use case |
| `*status` | Status do pipeline |
| `*help` | Ajuda completa |

## Capacidades Multimodais

O squad suporta leitura de:
- **PDFs**: matrículas, certidões de habite-se, IPTU, certidões negativas, plantas
- **Imagens**: fotos do imóvel (fachada, interior), mapas, plantas baixas
- **Satélite**: busca e análise de imagens de satélite públicas (Google Maps, Sentinel Hub)

## Avaliação ABNT NBR 14653

O agente `avaliador-imovel` segue as normas:
- **NBR 14653-1**: Procedimentos gerais
- **NBR 14653-2**: Imóveis urbanos
- **NBR 14653-3**: Imóveis rurais
- **NBR 12721**: CUB (Custo Unitário Básico)

Métodos disponíveis:
1. Comparativo Direto de Dados de Mercado
2. Capitalização da Renda
3. Evolutivo (terreno + benfeitoria - depreciação Ross-Heidecke)
4. Involutivo

## Quality Gates

| QG | Validação |
|---|---|
| QG-PD-001 | Demanda classificada, endereço identificado |
| QG-PD-002 | Dados extraídos com confiabilidade marcada |
| QG-PD-003 | Dados registrais cruzados com fontes online |
| QG-PD-004 | Mínimo 5 dispositivos legais identificados |
| QG-PD-005 | Geolocalização confirmada, grau de confiança atribuído |
| QG-PD-006 | Método declarado, mín. 3 comparáveis, grau ABNT |
| QG-PD-007 | Relatório/laudo salvo com fontes rastreadas |

## Estrutura de Diretórios

```
squads/property-data/
├── agents/           # 10 agentes especializados
├── tasks/            # 10 tasks executáveis
├── templates/        # 2 templates (relatório + laudo ABNT)
├── data/             # 2 arquivos de referência (fontes + normas ABNT)
├── checklists/       # 2 checklists de qualidade
├── workflows/        # 2 workflows (completo + laudo)
├── config.yaml       # Configuração do squad
└── README.md         # Esta documentação
```

## Estatísticas

| Métrica | Valor |
|---------|-------|
| Total de agentes | 10 |
| Total de tasks | 10 |
| Total de templates | 2 |
| Total de workflows | 2 |
| Total de checklists | 2 |
| Total de data files | 2 |

---

*Property Data Squad v1.0 — Levantamento e Avaliação Imobiliária*
