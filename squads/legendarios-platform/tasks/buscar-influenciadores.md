# Task: Buscar e Briefar Influenciadores Locais

**Task ID:** `lp-buscar-influenciadores`
**Versão:** 1.0
**Agente Executor:** `influencer-scout`
**Squad:** `legendarios-platform`
**Use Case:** UC-LP-005
**Comando:** `*buscar-influenciadores [cidade] [estado] [budget]`

---

## Objetivo

Identificar influenciadores digitais com fit para o Movimento Legendários na cidade/região
do evento, ranqueá-los por relevância e criar briefings individuais prontos para abordagem.

## Inputs

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| cidade | string | Sim | Cidade-alvo do evento |
| estado | string | Sim | Estado/região para ampliar busca |
| budget_influenciadores | decimal | Sim | Budget total para influenciadores |
| data_evento | date | Não | Para definir janela de publicação |
| nicho_prioritario | string | Não | Ex: "pastores", "atletas", "empresários" |

## Precondições

- [ ] Cidade e estado confirmados
- [ ] Budget para influenciadores definido
- [ ] Valores Legendários claros (cristão, masculino, família, transformação)

## Passos

1. **Definir critérios de fit** — gênero, valores, localização, engajamento mínimo
2. **WebSearch categoria 1** — pastores e líderes cristãos da cidade/estado no Instagram
3. **WebSearch categoria 2** — atletas, coaches, lutadores da região com presença digital
4. **WebSearch categoria 3** — empresários/empreendedores evangélicos locais/regionais
5. **WebSearch categoria 4** — homens com conteúdo de paternidade/família no Norte/região
6. **Avaliar cada perfil** — seguidores, taxa de engajamento estimada, fit de valores
7. **Ranquear lista** — por fit + engajamento + localização + custo estimado
8. **Criar briefings individuais** — apresentação + proposta + entregáveis + métricas
9. **Alocar budget** — distribuir entre perfis selecionados
10. **Salvar via Write** — `influenciadores-[cidade-slug]-[AAAA-MM].md`

## Output

- **Local:** `influenciadores-[cidade-slug]-[AAAA-MM].md`
- **Formato:** Markdown com tabela ranqueada + briefings
- **Seções:**
  - Lista ranqueada (nome, perfil, seguidores estimados, engajamento, budget sugerido, fit score)
  - Prova social gratuita (Neymar Sr., Joel Jota etc. — sem custo)
  - Briefing individual para cada influenciador selecionado
  - Proposta de entregáveis e timeline
  - Links UTM sugeridos por influenciador

## Condições de Veto (auto-FAIL)

- Recomendar influenciador sem verificar fit de valores cristãos
- Alocar todo budget em 1 único macro-influenciador quando budget ≤ R$ 10.000
- Omitir prova social gratuita (participantes famosos verificados)
- Criar briefing sem UTM de rastreamento

## Critérios de Aceite

- [ ] WebSearch realizado em pelo menos 3 categorias de nicho
- [ ] Mínimo 5 perfis identificados e avaliados
- [ ] Lista ranqueada por fit + engajamento + custo
- [ ] Prova social gratuita listada separadamente
- [ ] Briefing individual para cada influenciador selecionado
- [ ] Budget alocado com distribuição justificada
- [ ] UTM definido por influenciador
- [ ] Arquivo salvo via Write
