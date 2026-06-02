# DESIGN_GUIDE — Produto Jurídico Legal Performance

## Propósito

Este guia orienta a elaboração do design e da futura interface frontend do Squad Jurídico Legal Performance. O objetivo é criar um ambiente de usabilidade de alta qualidade para análise jurídica, processual, estratégica, recursal, pericial e de revisão humana.

## Quando usar este guia

Use este arquivo antes de qualquer implementação frontend quando a demanda envolver:

- Dashboard jurídico.
- Upload e leitura de peças.
- Timeline processual.
- Análise de riscos e prazos.
- Pesquisa jurisprudencial.
- Estratégia e cenários.
- Laudos periciais e quesitos.
- Revisão humana e exportação.

## Princípios de design

### 1. Confiança antes de estética

Cada conclusão deve mostrar sua origem. A interface deve deixar claro se a informação veio de peça processual, jurisprudência, lei, norma técnica, evidência pericial ou inferência do agente.

### 2. Humano no controle

O sistema apoia a análise, mas não substitui advogado, perito ou profissional habilitado. Toda entrega externa deve passar por revisão e aprovação humana.

### 3. Complexidade progressiva

O usuário deve ver primeiro o resumo executivo, prazos e riscos críticos. Detalhes, fundamentos e evidências devem estar disponíveis em camadas expansíveis.

### 4. Rastreabilidade contínua

A navegação deve permitir responder rapidamente: "de onde veio esta conclusão?", "qual documento sustenta isso?", "qual agente produziu esta etapa?" e "qual quality gate aprovou?".

### 5. Acessibilidade como requisito

WCAG AA é o mínimo. O produto deve funcionar por teclado, leitor de tela, contraste adequado e estados de foco visíveis.

## Personas prioritárias

| Persona | Necessidade | Risco de design | Resposta esperada |
|---|---|---|---|
| Advogado | Entender riscos, prazos, estratégia e fundamentos. | Sobrecarga de informação jurídica. | Resumo, filtros, fontes e plano de ação. |
| Perito judicial | Organizar cadeia de custódia, quesitos, evidências e laudo. | Omitir norma ou evidência crítica. | Checklist pericial, anexos e validação normativa. |
| Gestor jurídico | Ver portfólio, gargalos, riscos e performance. | Perder visão executiva. | Dashboard com risco, prazo, status e tendências. |
| Analista jurídico | Triar documentos e montar relatórios. | Fluxo lento e repetitivo. | Upload guiado, extrações e revisões rápidas. |
| Cliente/parte | Compreender status e próximos passos. | Linguagem técnica excessiva. | Comunicação simplificada e expectativas realistas. |
| Assistente técnico | Revisar laudo e quesitos. | Falta de detalhe técnico. | Evidências, medições, fotos e normas vinculadas. |

## Jornadas principais

### Jornada 1 — Upload e triagem

1. Usuário envia peças ou descreve o caso.
2. Sistema identifica tipo de documento, partes, datas e urgências.
3. Usuário revisa lacunas críticas.
4. Quality gate de classificação é exibido.

### Jornada 2 — Análise jurídica completa

1. Leitura de peças.
2. Pesquisa de leis e jurisprudência.
3. Estratégia com cenários.
4. Plano de ação.
5. Relatório final com citações rastreadas.

### Jornada 3 — Estratégia recursal

1. Seleção da decisão impugnada.
2. Checklist de admissibilidade.
3. Pesquisa de precedentes.
4. Recomendação: interpor, não interpor ou interpor com cautelas.
5. Plano de prazos e documentos necessários.

### Jornada 4 — Perícia e laudo

1. Cadastro do processo e objeto pericial.
2. Cadeia de custódia.
3. Quesitos.
4. Diagnóstico técnico.
5. Laudo e validação final.

### Jornada 5 — Revisão e exportação

1. Usuário revisa pendências.
2. Quality gates mostram bloqueios.
3. Profissional aprova ou devolve para ajuste.
4. Sistema exporta relatório, laudo ou brief.

## Arquitetura de informação sugerida

```text
Home
├── Casos
│   ├── Visão geral
│   ├── Documentos
│   ├── Timeline
│   ├── Riscos e prazos
│   ├── Pesquisa jurídica
│   ├── Estratégia
│   ├── Relatórios
│   └── Histórico de decisões
├── Perícias
│   ├── Cadeia de custódia
│   ├── Quesitos
│   ├── Evidências técnicas
│   ├── Normas
│   └── Laudos
├── Performance
│   ├── Gargalos
│   ├── Maturidade
│   └── Roadmap
└── Configurações
    ├── Fontes autorizadas
    ├── Templates
    └── Quality gates
```

## Componentes essenciais

| Componente | Função | Requisito crítico |
|---|---|---|
| Case Header | Identificação do caso, fase, risco e prazo. | Status claro e fonte da fase. |
| Evidence Drawer | Mostra fonte de cada conclusão. | Link para documento/trecho. |
| Procedural Timeline | Eventos, prazos e atos processuais. | Datas e origem do evento. |
| Risk Matrix | Probabilidade x impacto. | Critério visível. |
| Citation Block Viewer | Citações rastreadas. | Tipo, fonte, confiabilidade. |
| Quality Gate Panel | Aprovado, pendente ou bloqueado. | Explicação acionável. |
| Human Review Banner | Indica revisão obrigatória. | Não pode ser escondido em exportações. |
| Forensic Evidence Table | Fotos, medições, equipamentos e normas. | Unidade, método e anexos. |

## Padrões visuais

### Cores por semântica

- Crítico: risco processual, prazo fatal, fonte ausente.
- Atenção: lacuna, informação a verificar, fonte secundária.
- Sucesso: gate aprovado, fonte verificada, revisão concluída.
- Neutro: informação documental sem juízo de valor.

### Tipografia

- Priorizar leitura longa e tabelas densas.
- Usar hierarquia clara: título, resumo, seção, evidência.
- Evitar blocos extensos sem divisão visual.

### Tabelas

- Devem ter filtros, ordenação, linhas compactas e expansão por detalhe.
- Colunas jurídicas densas precisam de tooltip ou descrição curta.
- Sempre mostrar origem/fonte quando a linha representar evidência.

## Estados obrigatórios

- Empty state com orientação clara.
- Loading com etapa atual do pipeline.
- Erro recuperável com ação sugerida.
- Bloqueado por quality gate.
- Revisão humana pendente.
- Exportação aprovada.

## Acessibilidade

- Contraste mínimo WCAG AA.
- Navegação completa por teclado.
- Foco visível em todos os componentes interativos.
- Tabelas com cabeçalhos semânticos.
- Mensagens de erro vinculadas ao campo.
- Não depender apenas de cor para risco/status.

## Critérios para iniciar implementação

Antes de chamar o squad `apex` ou iniciar código frontend, é obrigatório ter:

- [ ] Personas e jornada principal definidas.
- [ ] Arquitetura de informação aprovada.
- [ ] Componentes críticos listados.
- [ ] Estados obrigatórios mapeados.
- [ ] Requisitos WCAG AA definidos.
- [ ] Quality gates visíveis no fluxo.
- [ ] Modelo de rastreabilidade definido.
- [ ] Brief salvo com `legal-product-design-brief-tmpl.md`.

## Como fazer na prática

1. Ative `@squad-juridico-legal-performance:legal-performance-chief`.
2. Descreva o produto ou fluxo desejado.
3. O chief deve classificar como `UC-LP-008`.
4. O `legal-ux-architect` gera o brief.
5. O `quality-compliance-validator` aplica `design-readiness-checklist.md`.
6. Somente depois disso o trabalho deve ser encaminhado ao squad `apex` para implementação frontend.
