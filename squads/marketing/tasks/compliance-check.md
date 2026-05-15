# compliance-check

## Task: Revisão de Compliance CFM em Materiais Existentes

### Metadata
- **executor:** compliance-guard
- **elicit:** true
- **mode:** sequential-review
- **output:** `output/marketing/{slug}/compliance-report.md`

---

### Inputs Required

```
target: Caminho para o arquivo ou diretório a revisar
  ex: "output/marketing/botox/" ou "output/marketing/botox/slides-imagem.md"
procedure_type: (opcional) tipo do procedimento para regras específicas
```

---

### Elicitation

```
Qual arquivo ou pasta de materiais deseja revisar?
> [usuário informa o caminho]

É um procedimento íntimo? (afeta regras de exibição em recepção mista)
> [sim | não | não sei]
```

---

### Execution Steps

#### Step 1: Leitura de Materiais
- Ler todos os arquivos `.md` no diretório informado
- Identificar tipo de procedimento e público-alvo
- Carregar regras específicas do CFM aplicáveis

#### Step 2: Revisão por Categoria

| Categoria | Verificação |
|-----------|-------------|
| Garantias de resultado | Presença de "garante", "elimina", "cura", "100%" |
| Nomenclatura técnica | Uso de marcas no lugar de termos técnicos |
| Restrições de exibição | Conteúdo íntimo em contexto misto |
| Imagens de pacientes | Menção a antes/depois sem nota de consentimento |
| Preços | Menção a valores ou condições de pagamento |
| Títulos profissionais | Uso de especialidades não reconhecidas pelo CFM |

#### Step 3: Geração do Relatório

Para cada arquivo revisado:
- Status: ✅ APROVADO | ⚠️ RESSALVAS | ❌ REPROVADO
- Lista de itens problemáticos com linha e sugestão de correção
- Referência normativa para cada item (CFM 2.336/2023, Art. X)

#### Step 4: Consolidação
- Relatório consolidado com status geral
- Lista priorizada de correções necessárias
- Aprovação final ou lista de pendências

---

### Output File

```
output/marketing/{slug}/compliance-report.md
```

Formato:
```markdown
# Relatório de Compliance — [PROCEDIMENTO]
**Data:** [data]
**Revisado por:** compliance-guard
**Status Geral:** ✅ APROVADO | ⚠️ APROVADO COM RESSALVAS | ❌ REPROVADO

## Arquivos Revisados
| Arquivo | Status |
|---------|--------|
| slides-imagem.md | ✅ |
| roteiro-video.md | ✅ |
| cta-hook.md | ⚠️ |
| variacoes-slides.md | ✅ |
| variacoes-video.md | ✅ |

## Correções Necessárias
1. **cta-hook.md, linha 23:** "elimina as rugas" → sugestão: "pode auxiliar na suavização das linhas de expressão" (CFM 2.336/2023, Art. 4º)

## Declaração de Aprovação
[texto de aprovação ou pendências]
```

---

### Acceptance Criteria

- [ ] Todos os arquivos do diretório foram revisados
- [ ] Nenhum item ❌ no relatório final (ou correções aplicadas)
- [ ] Relatório salvo em `output/marketing/{slug}/compliance-report.md`
- [ ] Fundamento normativo citado para cada item identificado
