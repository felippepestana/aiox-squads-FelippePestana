# Task: Provisionar PC Host

```yaml
task_name: "Provisionar PC Host (OBS + Plugin OBSBOT + Virtual Camera)"
status: pending
responsible_executor: human
execution_type: Hybrid
estimated_time: "1-2h"
quality_gate: QG-USB
dependencies: []

input:
  - "PC com Windows 11 Pro 64-bit, CPU 8c+, GPU NVENC, 32GB RAM"
  - "Acesso administrativo"
  - "Conexão de internet estável"

output:
  - "OBS Studio 30+ instalado"
  - "OBSBOT OBS Plugin instalado"
  - "OBSBOT Center DESINSTALADO da máquina"
  - "Virtual Camera disponível como webcam do sistema"
  - "obs-advanced-timer plugin instalado"
  - "obs-websocket habilitado (porta + senha anotadas)"
```

## Action Items

### 1. Validar hardware

- [ ] Conferir specs em `data/hardware-spec.yaml`
- [ ] Identificar portas USB 3.x traseiras (cor azul / SS / SS10)
- [ ] Verificar se há ao menos 2 USB-A + 2 USB-C traseiras

### 2. Instalar OBS Studio

- [ ] Baixar OBS Studio 30+ em https://obsproject.com/download
- [ ] Instalar com opções padrão
- [ ] Abrir e selecionar: canvas 1920×1080, output 1920×1080, 30 fps
- [ ] Em Configurações → Saída → Encoder: NVIDIA NVENC H.264 (modo CBR, 6000 kbps)

### 3. Atualizar firmware das câmeras (máquina de bancada separada se possível)

- [ ] Instalar **OBSBOT Center** temporariamente
- [ ] Conectar cada Tiny 2 / Tiny 2 Lite individualmente
- [ ] Atualizar para versão mínima (Tiny 2 ≥ 2.5.0, Tiny 2 Lite ≥ 1.3.0)
- [ ] Validar conforme `data/obsbot-firmware.yaml`
- [ ] **DESINSTALAR OBSBOT Center** da máquina de transmissão

### 4. Instalar OBSBOT OBS Plugin

- [ ] Baixar plugin em https://www.obsbot.com/download (Tiny 2 → OBS Plugin)
- [ ] Instalar com opção "All users"
- [ ] Reiniciar OBS Studio
- [ ] Confirmar painel lateral OBSBOT visível em OBS

### 5. Instalar plugin obs-advanced-timer

- [ ] Baixar plugin compatível com OBS 30+
- [ ] Instalar
- [ ] Reiniciar OBS
- [ ] Confirmar tipo de fonte "Advanced Timer" disponível

### 6. Habilitar obs-websocket

- [ ] OBS → Ferramentas → WebSocket Server Settings
- [ ] Habilitar servidor (porta default 4455)
- [ ] Definir senha forte
- [ ] Anotar credenciais em vault da equipe (NÃO commitar)

### 7. Habilitar Virtual Camera

- [ ] OBS → Iniciar Câmera Virtual (botão na coluna de controles)
- [ ] Confirmar que aparece como webcam:
  - Windows: Gerenciador de Dispositivos → Câmeras → "OBS Virtual Camera"
  - macOS: System Information → Camera → "OBS Virtual Camera"

### 8. Validar canvas + Studio Mode

- [ ] OBS → Configurações → Vídeo: 1920×1080 base, 1920×1080 output, 30 fps
- [ ] Habilitar Studio Mode (preview/program separados)

## Acceptance Criteria

- ✅ OBS Studio abre sem erros
- ✅ Plugin OBSBOT visível no painel lateral
- ✅ obs-advanced-timer aparece em "Adicionar Fonte"
- ✅ obs-websocket habilitado, credenciais anotadas
- ✅ Virtual Camera aparece como webcam do sistema
- ✅ OBSBOT Center NÃO está instalado
- ✅ Studio Mode habilitado
- ✅ Canvas configurado em 1920×1080 @ 30fps

## Handoff

Após acceptance criteria atendidos, prosseguir para `provision-cameras.md`.
