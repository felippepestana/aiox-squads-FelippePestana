# Task: Criar Calendário de Conteúdo Instagram

**Task ID:** `lp-criar-calendario-conteudo`
**Versão:** 1.0
**Agente Executor:** `conteudo-instagram`
**Squad:** `legendarios-platform`
**Use Case:** UC-LP-001 (subtask)
**Comando:** `*criar-calendario [cidade] [data_evento] [semanas]`

---

## Objetivo

Criar calendário completo de conteúdo para Instagram com copy pronto para publicação,
cobrindo 12 semanas pré-evento (Awareness → Urgência) e 2 semanas pós-evento.

## Inputs

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| cidade | string | Sim | Cidade do evento |
| data_evento | date | Sim | Data de início do evento |
| semanas_antes | integer | Não | Semanas antes do evento (padrão: 12) |
| nome_evento | string | Não | Nome especial do evento |
| budget_criativo | decimal | Não | Para recomendar produção de fotos/vídeos |

## Passos

1. **Definir fases** — Awareness (sem1-4), Consideração (sem5-8), Urgência (sem9-10), Last Call (sem11-12)
2. **Criar calendário semana a semana** — segunda, quarta, sexta para cada semana
3. **Definir formato por publicação** — Reels, Stories, Feed Carrossel, Feed Imagem
4. **Escrever hook de cada Reels** — 1ª frase/tela com atenção garantida em 3s
5. **Escrever copy de cada post** — legenda + hashtags + CTA
6. **Incluir Stories de contador de vagas** — sexta de cada semana (semanas 6-12)
7. **Adicionar pós-evento** — D+1 a D+14 com depoimentos e prova social

## Output

- **Formato:** Tabela Markdown por semana com: dia, formato, hook/título, copy, hashtags, CTA
- **Entregue para:** @marketing-master (consolida no pacote)

## Critérios de Aceite

- [ ] 12 semanas cobertas (mínimo 3 publicações/semana)
- [ ] Todos os formatos representados (Reels, Stories, Feed)
- [ ] Hook de cada Reels ≤ 15 palavras (3 segundos)
- [ ] Pelo menos 1 depoimento de participante famoso por semana nas semanas 5-10
- [ ] Stories de urgência de vagas nas semanas 8-12
- [ ] Copy em tom Legendários (AHU, honra, transformação)
- [ ] Hashtags segmentadas (#MovimentoLegendarios #TOP #[Cidade])
