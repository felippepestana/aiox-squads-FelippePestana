# Marketing para Clínicas Estéticas

Squad especializado em geração de materiais de marketing para clínicas estéticas. Produz pacotes completos de conteúdo para **display TV de recepção** — sequências de slides, roteiros de vídeo, CTAs e variações de copy — dentro das normas do **CFM Res. 2.336/2023**.

---

## Fluxo de Trabalho

```
Phase 1: BRIEFING         Phase 2: CRIAÇÃO           Phase 3: COMPLIANCE
Procedimento +        →  Slides + Vídeo +        →   CFM review →
Clínica + Público        CTAs + Variações             Aprovação
```

## Formato de Entrega

**Loop de ~90s para TV de Recepção (16:9)**

```
[VÍDEO 15s] → [SLIDE 1 Gancho] → [SLIDE 2 Definição]
           → [SLIDE 3 Como funciona] → [SLIDE 4 Benefícios]
           → [SLIDE 5 CTA] → LOOP
```

**Dual-use:** O mesmo conteúdo serve para corte vertical 9:16 (Reels/TikTok)

---

## Agentes (5)

| Agente | Tier | Papel |
|--------|------|-------|
| [marketing-chief](agents/marketing-chief.md) | T0 | Orquestrador — briefing e pipeline completo |
| [slide-copywriter](agents/slide-copywriter.md) | T1 | Textos dos slides — 5 tons × 5 slides |
| [video-director](agents/video-director.md) | T1 | Storyboard 15s — 3 cenas com notas técnicas |
| [cta-strategist](agents/cta-strategist.md) | T1 | CTAs, ganchos e variações persuasivas |
| [compliance-guard](agents/compliance-guard.md) | T2 | Revisão CFM 2.336/2023 em todo o output |
| [visual-briefer](agents/visual-briefer.md) | T2 | Direção de arte e brief fotográfico |

---

## Comandos

```
@marketing:marketing-chief *gerar-materiais     # Pacote completo para 1 procedimento
@marketing:marketing-chief *gerar-slides        # Apenas sequência de slides
@marketing:marketing-chief *gerar-roteiro       # Apenas storyboard de vídeo
@marketing:marketing-chief *gerar-cta          # Apenas CTAs e ganchos
@marketing:compliance-guard *revisar-compliance  # Revisar materiais existentes
```

---

## Como Usar

**1. Ativar:**
```
@marketing:marketing-chief
```

**2. Executar:**
```
*gerar-materiais
```

**3. Responder ao briefing:**
```
Procedimento: Lifting Facial com Fios de PDO
Público: misto
Tom: técnico + emocional
Nome da clínica: [opcional]
Contato: [opcional]
```

**4. Receber os 5 arquivos:**
```
output/marketing/lifting-facial-fios-pdo/
├── slides-imagem.md
├── roteiro-video.md
├── cta-hook.md
├── variacoes-slides.md
└── variacoes-video.md
```

---

## Exemplos de Materiais Gerados

Os exemplos abaixo foram gerados por este squad e estão em `output/marketing/`:

| Procedimento | Materiais |
|---|---|
| [Foto Terapia Facial](../../output/marketing/foto-terapia-facial/) | slides, vídeo, CTAs, variações |
| [Toxina Botulínica](../../output/marketing/botox/) | slides, vídeo, CTAs, variações |
| [Harmonização Íntima Feminina](../../output/marketing/harmonizacao-intima-feminina/) | slides, vídeo, CTAs, variações |
| [Harmonização Íntima Masculina](../../output/marketing/harmonizacao-intima-masculina/) | slides, vídeo, CTAs, variações |

---

## Compliance CFM

Todo material gerado segue a **CFM Resolução 2.336/2023**:

- ✅ Sem garantias de resultado ("pode auxiliar", "visa", "tende a")
- ✅ Nomenclatura técnica (sem marcas comerciais)
- ✅ Restrições de exibição por público (procedimentos íntimos)
- ✅ Nota de consentimento para imagens de pacientes
- ✅ Sem preços em materiais de divulgação pública

Ver [`data/cfm-2336-guidelines.md`](data/cfm-2336-guidelines.md) para o guia completo.

---

## Platform

O **Marketing Platform** (`marketing-platform/`) é o display digital que exibe os materiais deste squad:

| Rota | Descrição |
|------|-----------|
| `/` | Landing page com os procedimentos |
| `/display` | Display TV: loop 90s full-screen |
| `/admin` | Painel admin: configurar clínica e slides |

Stack: Next.js 16 · TypeScript · Tailwind CSS · Supabase · Vercel

---

## Referências

| Fonte | Aplicação |
|-------|-----------|
| [CFM Res. 2.336/2023](data/cfm-2336-guidelines.md) | Compliance de marketing médico |
| [Referência de Procedimentos](data/procedure-reference.md) | Contexto técnico dos procedimentos |
| [Template Slides](templates/slide-sequence.md) | Estrutura padrão dos slides |
| [Template Vídeo](templates/video-script.md) | Estrutura padrão do roteiro |
