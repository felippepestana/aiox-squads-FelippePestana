# Task: Configurar PiP (Picture-in-Picture)

```yaml
task_name: "Configurar PiP nas cenas SLIDES_PIP e TELA_PIP"
status: pending
responsible_executor: hybrid
execution_type: Hybrid
estimated_time: "2h"
quality_gate: QG-PIP
dependencies:
  - build-scene-pack.md

input:
  - "Cenas SLIDES_PIP e TELA_PIP criadas (esqueleto)"
  - "templates/pip-layout.yaml"

output:
  - "PiP a 25% (480×270) no canto inferior direito por default"
  - "Source Mirror dinâmica que segue a câmera ativa"
  - "Border 2px branca + drop shadow"
  - "Alternativas configuráveis: 20%/25%/30% e 4 cantos"
```

## Action Items

### 1. Source Mirror dinâmica

- [ ] Criar fonte global `CamAtivaMirror` (Source Mirror)
- [ ] Inicialmente apontando para CAM1
- [ ] Esta fonte será atualizada via obs-websocket pelo painel operador (F5) ou manualmente nesta release

### 2. Aplicar PiP em SLIDES_PIP

- [ ] Em SLIDES_PIP, adicionar `CamAtivaMirror` como segunda fonte (acima dos slides)
- [ ] Coordenadas default: x=1410, y=780, 480×270
- [ ] Filtros aplicados:
  - **Stroke**: 2px branco
  - **Drop Shadow**: offset x=4, y=4, opacity 60%, blur 8px
- [ ] Bloquear posição (cadeado)

### 3. Aplicar PiP em TELA_PIP

- [ ] Repetir passos do item 2, agora em TELA_PIP

### 4. Validar legibilidade

- [ ] Abrir PowerPoint ou Keynote com slide rico em texto
- [ ] Selecionar SLIDES_PIP no programa
- [ ] Verificar que:
  - Texto dos slides legível em 1080p
  - PiP não cobre conteúdo central
  - Drop shadow não sangra texto adjacente

### 5. Configurar alternativas (presets de canto + tamanho)

Criar **6 cenas variantes** de PiP (ou usar Studio Mode com presets) cobrindo:

| Cena | Tamanho | Canto |
|---|---|---|
| SLIDES_PIP | 25% | bottom_right (default) |
| SLIDES_PIP_TL | 25% | top_left |
| SLIDES_PIP_TR | 25% | top_right |
| SLIDES_PIP_BL | 25% | bottom_left |
| SLIDES_PIP_S | 20% | bottom_right |
| SLIDES_PIP_L | 30% | bottom_right |

> **Nota**: Para esta release, criar APENAS as variantes que serão de fato usadas. Uma só (default) é suficiente para QG-PIP. Demais ficam como instrução em `templates/pip-layout.yaml`.

### 6. Definir margens

- [ ] Margem mínima de 30 px de qualquer borda
- [ ] Coordenadas default validadas em `templates/pip-layout.yaml`

### 7. Testar atualização da Source Mirror

- [ ] No OBS, alterar a câmera-alvo da `CamAtivaMirror` (manual)
- [ ] Cronometrar tempo até o PiP refletir a mudança
- [ ] Aceitável: < 300 ms

## Acceptance Criteria

- ✅ PiP a 25% bottom_right por default
- ✅ Source Mirror atualiza em < 300 ms
- ✅ Slides legíveis com PiP ativo (texto principal não obscurecido)
- ✅ Border 2px + drop shadow aplicados
- ✅ `templates/pip-layout.yaml` reflete a configuração real

## Quality Gate: QG-PIP

Critérios em `config.yaml` → `quality_gates.QG-PIP`.

## Handoff

Próximo: `configure-standby.md`.
