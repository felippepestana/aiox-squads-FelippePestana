# Task: Construir Pacote de Cenas (10 cenas)

```yaml
task_name: "Construir pacote de 10 cenas no OBS"
status: pending
responsible_executor: hybrid
execution_type: Hybrid
estimated_time: "3-4h"
quality_gate: QG-SCENES
dependencies:
  - provision-cameras.md

input:
  - "4 câmeras validadas (CAM1..CAM4 como fontes no OBS)"
  - "config.yaml → scene_pack como referência"

output:
  - "10 cenas criadas: STANDBY, CAM1, CAM2, CAM3, CAM4, GRID, SLIDES_FULL, SLIDES_PIP, TELA_PIP, ENCERRAMENTO"
  - "Transições Cut (default) e Fade 300ms (secundária) configuradas"
  - "Coleção exportada como referência em templates/obs-scene-collection.json"
```

## Action Items

### 1. Criar cenas solo de câmera

Para cada câmera (CAM1 → CAM4):

- [ ] OBS → botão + em Cenas → nomear `CAM<N>`
- [ ] Adicionar fonte: Captura de Vídeo (CAM<N> já criada na task anterior)
- [ ] Esticar para canvas inteiro (1920×1080)
- [ ] Bloquear posição (cadeado na fonte)

### 2. Criar cena GRID (mosaico 2x2)

- [ ] Nova cena: `GRID`
- [ ] Adicionar 4 fontes (Source Mirror para cada CAM<N>)
- [ ] Posicionar:
  - CAM1: x=0, y=0, 960×540
  - CAM2: x=960, y=0, 960×540
  - CAM3: x=0, y=540, 960×540
  - CAM4: x=960, y=540, 960×540
- [ ] Adicionar bordas pretas de 2px entre os tiles (filtro Stroke)

### 3. Criar cena SLIDES_FULL

- [ ] Nova cena: `SLIDES_FULL`
- [ ] Adicionar fonte: Captura de Janela (PowerPoint/Keynote)
- [ ] Esticar para canvas inteiro
- [ ] Adicionar fonte secundária (oculta): Source Mirror da câmera ativa (para áudio embutido se aplicável)

### 4. Criar cena SLIDES_PIP (PiP no canto inferior direito)

- [ ] Nova cena: `SLIDES_PIP`
- [ ] Adicionar fonte: Captura de Janela (slides) — esticar para canvas inteiro
- [ ] Adicionar fonte: Source Mirror (`CamAtivaMirror`) — 480×270, x=1410, y=780
- [ ] Aplicar filtro **Drop Shadow** na Source Mirror
- [ ] Adicionar borda 2px branca (filtro Stroke)
- [ ] **Detalhe configurável** em `tasks/configure-pip.md` — esta task só cria o esqueleto

### 5. Criar cena TELA_PIP

- [ ] Nova cena: `TELA_PIP`
- [ ] Adicionar fonte: Captura de Tela (Display Capture)
- [ ] Adicionar Source Mirror da câmera ativa nas mesmas coordenadas do SLIDES_PIP

### 6. Criar cena STANDBY (esqueleto — detalhes em `configure-standby.md`)

- [ ] Nova cena: `STANDBY`
- [ ] Adicionar fonte: Imagem (placeholder branded)
- [ ] Reservar área central para texto + cronômetro

### 7. Criar cena ENCERRAMENTO

- [ ] Nova cena: `ENCERRAMENTO`
- [ ] Imagem branded + texto "Obrigado" + créditos (texto via fonte GDI+)

### 8. Configurar transições

- [ ] Configurações → Transições padrão: **Cut**
- [ ] Adicionar transição secundária: **Fade 300ms**
- [ ] Atalhos de teclado opcionais para troca rápida

### 9. Configurar Studio Mode (se ainda não feito)

- [ ] Habilitar Studio Mode
- [ ] Validar fluxo Preview → Program

### 10. Exportar coleção como template

- [ ] OBS → Coleções de Cena → Exportar
- [ ] Salvar em `squads/transmissao-multicam/templates/obs-scene-collection.json` (template de referência)

## Acceptance Criteria

- ✅ 10 cenas existem com nomes exatos do `scene_pack`
- ✅ Canvas 1920×1080 @ 30fps em todas
- ✅ Transições Cut e Fade configuradas
- ✅ Studio Mode habilitado
- ✅ Coleção exportada para o template

## Quality Gate: QG-SCENES

Critérios em `config.yaml` → `quality_gates.QG-SCENES`.

## Handoff

Próximo: `configure-pip.md` (detalhar PiP) e `configure-standby.md` (cronômetro).
