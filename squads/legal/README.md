# Squad Legal — Redação e Formatação de Peças Processuais

> **Squad:** legal
> **Versão:** 1.0.0
> **Agente principal:** processual-writer

---

## Visão Geral

O **Squad Legal** é especializado na redação, formatação e revisão de peças processuais. Aplica um padrão rigoroso de formatação jurídica que combina hierarquia visual clara com linguagem técnica sóbria — sem juridiquês arcaico — e forte carga argumentativa.

---

## Agente

### `processual-writer` — Redator Processual

Especialista em geração e formatação de peças processuais. Aplica automaticamente as diretrizes de formatação a qualquer tipo de peça: petições iniciais, contestações, recursos, impugnações, incidentes processuais e manifestações.

**Comandos:**

| Comando | Descrição |
|---------|-----------|
| `*redigir {tipo} {fatos}` | Redige peça completa com formatação aplicada |
| `*formatar {texto}` | Aplica padrão de formatação a texto existente |
| `*revisar {texto}` | Revisa linguagem, argumentação e formatação |
| `*qualificar {parte} {dados}` | Gera bloco de qualificação da parte |
| `*citar {decisao}` | Formata citação de jurisprudência em bloco recuado |

---

## Diretrizes de Formatação

### 1. Estrutura e Alinhamento

| Elemento | Estilo | Alinhamento |
|----------|--------|-------------|
| Endereçamento (capa) | **NEGRITO + CAIXA ALTA** | Justificado |
| Informações do processo | Rótulos em negrito | Esquerda |
| Nome da parte | **NEGRITO + CAIXA ALTA** | — |
| Texto de qualificação | Normal | Justificado |
| Corpo do texto | Normal | Justificado |

### 2. Hierarquia de Títulos

| Nível | Formato | Alinhamento | Exemplo |
|-------|---------|-------------|---------|
| Título da peça | **NEGRITO + CAIXA ALTA** | Justificado | `**PETIÇÃO INICIAL**` |
| Seção (Nível 1) | **NEGRITO + CAIXA ALTA** + numeral romano | Centralizado | `**I. DOS FATOS**` |
| Subseção (Nível 2) | **Negrito + Title Case** | Esquerda | `**I.A. Da Qualificação**` |

### 3. Destaques no Texto (negrito intensivo)

| Elemento | Estilo |
|----------|--------|
| Artigos de lei (número + nome) | **negrito** |
| Valores monetários | **negrito** |
| Prazos e datas críticas | **negrito** |
| Doenças e diagnósticos | **NEGRITO + CAIXA ALTA** |
| Nomes de terceiros em listas | **NEGRITO + CAIXA ALTA** |
| Conclusões jurídicas | **negrito** |

### 4. Citações de Jurisprudência

```markdown
> *"Trecho da ementa."*
>
> (Tribunal, Órgão, Tipo nº Número/UF, Rel. Nome, j. DD.MM.AAAA, DJe DD.MM.AAAA)
```

---

## Estrutura do Squad

```
squads/legal/
├── README.md                          # Este arquivo
├── agents/
│   └── processual-writer.md           # Agente principal (redação + formatação)
├── tasks/
│   └── format-document.md             # Task de formatação passo a passo
├── templates/
│   └── peca-processual-tmpl.md        # Template base para peças processuais
└── checklists/
    └── formatting-checklist.md        # Checklist de validação (33 itens)
```

---

## Como Usar

1. Carregue o agente `processual-writer` no chatbot
2. Use `*redigir` para gerar uma nova peça ou `*formatar` para formatar um texto existente
3. O agente aplicará automaticamente todas as diretrizes de formatação
4. Ao final, o checklist de 33 itens é executado para validação
5. Qualquer referência de jurisprudência incompleta é marcada como `[VERIFICAR ANTES DE PROTOCOLAR]`

---

## Anti-patterns (O que este agente NUNCA faz)

- ❌ "Vem mui respeitosamente à presença de Vossa Excelência"
- ❌ "DD. Juiz" / "MM. Juiz"
- ❌ "data venia", "nesta senda", "dessarte", "mister", "hialino", "cediço"
- ❌ Citar jurisprudência sem referência completa (número + relator + data)
- ❌ Pedidos vagos ("tudo o mais que de direito" sem especificação)
- ❌ Afirmações jurídicas sem fundamento legal ou jurisprudencial
