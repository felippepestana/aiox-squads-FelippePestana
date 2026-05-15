# generate-procedure

## Task: Gerar Pacote Completo de Materiais para Procedimento

### Metadata
- **executor:** marketing-chief (orquestra todos os agentes)
- **elicit:** true
- **mode:** parallel-then-sequential-then-review
- **output:** 5 arquivos em `output/marketing/{procedure_slug}/`

---

### Inputs Required

```
procedure_name: Nome do procedimento (ex: "Lifting Facial com Fios de PDO")
audience: feminino | masculino | misto
clinic_name: (opcional — default: [NOME DA CLÍNICA])
clinic_contact: (opcional — default: [CONTATO])
tone: tecnico | emocional | direto | misto
color_palette: (opcional — default por audience)
differentials: (opcional — diferenciais da clínica para CTAs)
display_restriction: (opcional — ex: "não exibir em recepção mista")
```

---

### Elicitation

```
Qual o procedimento? (ex: Botox, Preenchimento Labial, Peeling Químico)
> [usuário informa]

Público-alvo: feminino | masculino | misto?
> [usuário informa]

Tom desejado: técnico | emocional | direto | misto?
> [usuário informa — se não souber, respondo: "misto" por padrão]

Nome da clínica e WhatsApp para o CTA? (pode pular — uso placeholder)
> [usuário informa ou pula]

Algum diferencial da clínica a destacar? (pode pular)
> [usuário informa ou pula]
```

---

### Execution Steps

#### Step 1: Briefing e Estrutura
- marketing-chief coleta os dados acima
- Define slug: `{procedure_name_lowercase_hyphenated}`
- Cria diretório: `output/marketing/{slug}/`
- Prepara contexto compartilhado para os agentes

#### Step 2: Geração Paralela (todos simultâneos)

| Agente | Entrega |
|--------|---------|
| slide-copywriter | `slides-imagem.md` — sequência de 5 slides |
| video-director | `roteiro-video.md` — storyboard 15s |
| cta-strategist | `cta-hook.md` — CTA principal + ganchos |
| visual-briefer | Brief fotográfico integrado nos slides |

#### Step 3: Geração Sequencial (variações)

| Agente | Entrega |
|--------|---------|
| slide-copywriter | `variacoes-slides.md` — 5 tons diferentes |
| video-director | `variacoes-video.md` — 5 abordagens narrativas |

#### Step 4: Revisão de Compliance

| Agente | Entrega |
|--------|---------|
| compliance-guard | Revisão de todos os arquivos gerados |
| compliance-guard | Relatório de aprovação/correções |

#### Step 5: Finalização
- marketing-chief aplica correções do compliance-guard
- Atualiza `output/marketing/README.md` com links para novos arquivos
- Apresenta sumário ao usuário: arquivos gerados + pontos de atenção

---

### Output Files

```
output/marketing/{slug}/
├── slides-imagem.md       # 5 slides × 15s com textos e direção fotográfica
├── roteiro-video.md       # Storyboard 3 cenas × 5s com legendas e notas
├── cta-hook.md            # CTA principal + 5 ganchos + 4 variações
├── variacoes-slides.md    # 5 variações de tom (técnico→contextual)
└── variacoes-video.md     # 5 variações de abordagem narrativa
```

---

### Acceptance Criteria

- [ ] 5 slides com textos dentro do limite de 15 palavras
- [ ] Vídeo com 3 cenas × ~5s (total 15s)
- [ ] Pelo menos 5 ganchos e 4 variações de CTA
- [ ] 5 variações de tom para slides (técnico, emocional, direto, comparativo, contextual)
- [ ] 5 variações de abordagem para vídeo
- [ ] Compliance-guard aprovou ou listou correções aplicadas
- [ ] Todos os arquivos salvos em `output/marketing/{slug}/`
- [ ] README.md atualizado com links para novos arquivos

---

### Loop Structure Validation

Verificar que a sequência respeita o loop de 90s:

```
[VÍDEO 15s] → [SLIDE 1 Gancho 15s] → [SLIDE 2 Definição 15s]
           → [SLIDE 3 Como funciona 15s] → [SLIDE 4 Benefícios 15s]
           → [SLIDE 5 CTA 15s] → LOOP (90s total)
```
