# Brief de Design: Dashboard Jurídico Legal Performance

> Gerado em: 2026-06-01 (fictício) | Modo: PRODUTO | UC: UC-LP-008 | Quality gates: QG-LP-001, 006, 007 — aprovados | Handoff Apex: **pendente** até aprovação do usuário

## 1. Objetivo do Produto

Oferecer um **dashboard jurídico** para equipes que acompanham múltiplos casos: upload estruturado de peças, timeline processual, matriz de riscos, pesquisa jurisprudencial integrada, fluxo de revisão humana e exportação de relatórios rastreados — com segurança, acessibilidade (WCAG AA) e linguagem adequada a advogados e gestores.

**Fora de escopo nesta fase:** implementação visual, código React/Vue, deploy ou integração com APIs externas. Handoff ao squad `apex` somente após checklist de readiness aprovado.

## 2. Personas

| Persona | Necessidade | Risco de UX | Critério de sucesso |
|---|---|---|---|
| Advogado | Decidir próximos passos com base em riscos, prazos e fontes | Sobrecarga de informação sem hierarquia | Ver risco, prazo e plano em uma tela |
| Gestor jurídico | Carteira, SLA e tendência de risco | Métricas sem rastreio de origem | Dashboard com filtros e exportação gerencial |
| Analista jurídico | Triar documentos e preparar relatório | Upload confuso ou perda de contexto | Wizard com validação e pendências claras |
| Cliente/parte | Entender status sem jargão excessivo | Exposição indevida de dados | Visão simplificada pós-revisão humana |

## 3. Jornadas Principais

1. **Onboarding de caso** — criar caso, metadados (partes, número, comarca), política de sigilo.
2. **Ingestão documental** — upload em lote, classificação automática sugerida, lacunas sinalizadas.
3. **Triagem e auditoria** — confirmar UC, fase CPC e riscos antes de análise profunda.
4. **Análise e pesquisa** — timeline, matriz de riscos, painel de jurisprudência com fontes.
5. **Revisão humana** — bloqueio de exportação até aprovação nominada.
6. **Exportação** — PDF/Markdown com versão, data e responsável pela revisão.

## 4. Arquitetura de Informação

```text
App
├── Dashboard (home)
│   ├── Casos ativos
│   ├── Prazos críticos (≤ 7 dias)
│   ├── Riscos altos
│   ├── Pendências de revisão humana
│   └── Relatórios recentes
├── Caso (detalhe)
│   ├── Visão geral (header + status + gates)
│   ├── Documentos (upload, tipos, extrações)
│   ├── Timeline processual
│   ├── Riscos (matriz)
│   ├── Jurisprudência e normas
│   ├── Estratégia e cenários
│   ├── Quality gates
│   └── Exportação
└── Configurações
    ├── Perfis e permissões
    ├── Modelos de relatório
    └── Auditoria de acesso
```

## 5. Componentes Críticos

| Componente | Propósito | Requisito não funcional |
|---|---|---|
| Case Header | Identidade do caso, fase, risco agregado | Exibir origem da fase (manual vs. inferida) |
| Upload Wizard | Ingestão segura de peças | Validação tipo/tamanho; alerta de sigilo |
| Procedural Timeline | Atos e prazos | Cada evento com fonte (documento ou manual) |
| Risk Matrix | Priorização | Probabilidade × impacto; não usar só cor |
| Evidence Drawer | Rastreabilidade | Trecho, documento, confiabilidade |
| Quality Gate Panel | Transparência de bloqueios | Ação para desbloquear (ex.: revisão humana) |
| Human Review Banner | Compliance | Obrigatório antes de exportar |
| Export Panel | Entrega controlada | Versão, hash opcional, log de download |

## 6. Estados de Interface

| Estado | Comportamento | Copy mínima |
|---|---|---|
| Empty | Nenhum caso | CTA: "Criar primeiro caso" + link para política de upload |
| Loading | Pipeline de agentes em execução | Etapa atual + tempo estimado indeterminado |
| Erro recuperável | Falha de upload ou timeout de pesquisa | Ação: tentar novamente + suporte |
| Bloqueado (gate) | Exportação impedida | Qual QG falhou e responsável |
| Revisão pendente | Análise pronta, não exportável | Nome do revisor e prazo interno |
| Exportação aprovada | Download liberado | Formato, versão, timestamp |

## 7. Requisitos de Acessibilidade e Confiança

- **WCAG 2.1 nível AA** (contraste, foco visível, labels).
- Navegação por teclado em timeline, tabelas e drawers.
- Riscos com ícone + texto + padrão (não apenas vermelho/verde).
- Tabelas com `<th scope>` e captions quando necessário.
- Mensagens de erro associadas a campos (`aria-describedby`).
- Log de decisões automáticas vs. humanas (quem aprovou exportação).
- Confirmação modal para exclusão de caso ou documento.

## 8. Rastreabilidade na UI

Cada conclusão exibida ao usuário deve permitir abrir o **Evidence Drawer** com:

- identificador do documento ou fonte normativa;
- trecho ou resumo;
- tipo (`peca-processual`, `legislacao`, `jurisprudencia`, etc.);
- nível de confiabilidade (`alta`, `media`, `baixa`).

## 9. Checklist de Design Readiness (preenchimento esperado)

| Item | Status |
|---|---|
| Personas definidas | Aprovado |
| Jornada principal mapeada | Aprovado |
| Arquitetura de informação | Aprovado |
| Componentes críticos listados | Aprovado |
| Estados obrigatórios definidos | Aprovado |
| WCAG AA planejado | Aprovado |
| Revisão humana no fluxo | Aprovado |
| Handoff ao Apex | **Pendente** — aguardar aprovação explícita do usuário |

## 10. Handoff para Apex

**Critérios para iniciar implementação com o squad `apex`:**

1. Usuário aprovar este brief e o checklist acima.
2. Tokens de design alinhados a [`DESIGN_GUIDE.md`](../../DESIGN_GUIDE.md) do squad jurídico.
3. Protótipo de baixa fidelidade validado em jornada 1–6 (opcional recomendado).
4. Matriz de permissões (advogado, gestor, analista, cliente) assinada.
5. Definição de integração com backend (ex.: `analista-processual-web`) documentada separadamente.

**Entregáveis para o Apex:** wireframes, mapa de componentes, especificação de estados, critérios de aceite por tela, referência a design system existente no repositório.

## 11. Revisão Humana Obrigatória

Brief de produto deve ser validado por responsável de produto e representante jurídico antes de qualquer sprint de frontend. Não constitui especificação contratual nem aprovação de segurança da informação — avaliação de LGPD e sigilo deve ser feita em etapa dedicada.
