# Exemplo — Planejamento de frontend jurídico

## Objetivo

Demonstrar a execução esperada do `UC-LP-008` para planejar uma interface jurídica antes de qualquer implementação visual ou handoff ao `apex`.

## Input fictício

```text
Quero planejar um dashboard jurídico para upload de peças, timeline processual, matriz de riscos, pesquisa jurisprudencial, revisão humana e exportação de relatório. Preciso de uma interface segura, acessível e fácil para advogados e gestores acompanharem vários casos.
```

## Classificação esperada

| Campo | Valor |
|---|---|
| UC | `UC-LP-008` |
| Modo | `MODO_PRODUTO` |
| Entregável | Brief de design + checklist de readiness |
| Handoff | `apex`, somente depois de aprovação |

## Rota esperada

```text
legal-performance-chief
-> process-intake-analyst
-> legal-ux-architect
-> legal-report-writer
-> quality-compliance-validator
```

## Brief esperado resumido

### 1. Personas

| Persona | Objetivo | Necessidade de UX |
|---|---|---|
| Advogado | Revisar análise e decidir próximos passos | Riscos, prazos, fontes e plano em uma visão clara |
| Gestor jurídico | Acompanhar carteira de casos | Dashboard com status, SLA, risco e tendência |
| Analista jurídico | Triar documentos e preparar relatório | Upload guiado, extrações revisáveis e pendências |
| Cliente/parte | Entender status e próximos passos | Linguagem simples e exportação revisada |

### 2. Jornadas principais

1. Criar caso e enviar documentos.
2. Confirmar classificação e lacunas.
3. Ver timeline processual.
4. Revisar riscos e fontes.
5. Aprovar análise humana.
6. Exportar relatório.

### 3. Arquitetura de informação

```text
Dashboard
├── Casos ativos
├── Prazos críticos
├── Riscos altos
├── Pendências de revisão
└── Relatórios recentes

Caso
├── Visão geral
├── Documentos
├── Timeline
├── Riscos
├── Jurisprudência
├── Estratégia
├── Quality gates
└── Exportação
```

### 4. Componentes críticos

| Componente | Propósito | Requisito |
|---|---|---|
| Case Header | Identificar caso, fase e risco | Mostrar fonte da fase processual |
| Upload Wizard | Receber peças | Validar tipo, tamanho, sigilo e lacunas |
| Procedural Timeline | Mostrar atos e prazos | Origem de cada evento |
| Risk Matrix | Priorizar riscos | Probabilidade, impacto e mitigação |
| Evidence Drawer | Mostrar base de conclusão | Documento, trecho e confiabilidade |
| Quality Gate Panel | Expor bloqueios | Ação necessária para desbloquear |
| Human Review Banner | Garantir revisão | Obrigatório antes de exportar |

### 5. Estados obrigatórios

- Empty state: orientar primeiro upload ou criação de caso.
- Loading: mostrar etapa do pipeline e agente ativo.
- Erro recuperável: indicar documento inválido, fonte indisponível ou timeout.
- Bloqueado: explicar qual quality gate impediu exportação.
- Revisão pendente: destacar responsável e próxima ação.
- Exportação aprovada: mostrar formato, data e versão.

### 6. Acessibilidade

- WCAG AA.
- Navegação por teclado em timeline, tabela e drawer.
- Risco não pode depender apenas de cor.
- Tabelas com cabeçalhos semânticos.
- Mensagens de erro vinculadas ao campo.

## Checklist de readiness esperado

| Item | Resultado esperado |
|---|---|
| Personas definidas | Aprovado |
| Jornada principal mapeada | Aprovado |
| Componentes críticos listados | Aprovado |
| Estados obrigatórios definidos | Aprovado |
| Rastreabilidade planejada | Aprovado |
| Revisão humana explícita | Aprovado |
| Handoff ao Apex | Pendente até aprovação do usuário |

## Quality gates esperados

- `QG-LP-001`: aprovado com `UC-LP-008`.
- `QG-LP-007`: aprovado se brief cobrir personas, jornada, estados, acessibilidade e rastreabilidade.
- `QG-LP-006`: aprovado se revisão humana aparecer no fluxo.

## Critério de aprovação do exemplo

O exemplo passa se a saída for um brief de produto pronto para revisão, sem iniciar implementação frontend e com handoff ao `apex` explicitamente condicionado à aprovação do checklist.
