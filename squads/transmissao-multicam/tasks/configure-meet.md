# Task: Configurar Google Workspace Enterprise Plus para Transmissão

```yaml
task_name: "Configurar conta Workspace + Meet para hospedar transmissão"
status: pending
responsible_executor: human
execution_type: Hybrid
estimated_time: "1-2h"
quality_gate: QG-LIVE-READY
dependencies:
  - configure-standby.md

input:
  - "Acesso de admin no Workspace"
  - "Licença Enterprise Plus disponível"
  - "data/meet-settings.yaml"

output:
  - "Conta dedicada transmissao@<domain> criada com licença Enterprise Plus + Gemini"
  - "Studio Look/Lighting/Sound DESLIGADOS na conta"
  - "Câmera default = OBS Virtual Camera"
  - "Gravação na nuvem habilitada para auto-start"
  - "Live streaming in-domain habilitado (se aplicável)"
  - "Smoke do Meet OK"
```

## Action Items

### 1. Criar conta dedicada

- [ ] Admin Console → Usuários → Adicionar Usuário
- [ ] Nome: "Transmissão"
- [ ] Email: `transmissao@<domain>`
- [ ] Atribuir licença: **Workspace Enterprise Plus** + **Gemini for Workspace** (Acesso Ampliado à IA)

### 2. Configurar OU policy do Meet (opcional, recomendado)

- [ ] Criar OU `Broadcast` (se ainda não existir)
- [ ] Mover conta de transmissão para OU
- [ ] Aplicar policy:
  - Cloud recording: ON (auto-start when host joins)
  - Live streaming in-domain: ON
  - Attendance tracking: ON
  - Breakout rooms: ON
  - Cohost management: ON
  - Captions + Translated captions: ON
  - Take notes for me (Gemini): ON
  - Noise cancellation: ON

### 3. Override pessoal na conta de transmissão

Logar como `transmissao@<domain>` e abrir https://meet.google.com → engrenagem:

- [ ] Câmera: **OBS Virtual Camera**
- [ ] Microfone: interface multicanal mixada
- [ ] **Studio Look: OFF**
- [ ] **Studio Lighting: OFF**
- [ ] **Studio Sound: OFF**
- [ ] **Background blur: OFF**
- [ ] Captions: ON (pt-BR)

### 4. Habilitar live streaming (se houver audiência além dos 300 ativos)

- [ ] Admin Console → Apps → Google Workspace → Google Meet → Streaming
- [ ] Habilitar para a OU `Broadcast`
- [ ] Confirmar limite de 100k espectadores in-domain

### 5. Configurar retenção (Vault)

- [ ] Política conforme compliance
- [ ] Recomendação: 365 dias para gravações

### 6. Smoke do Meet

- [ ] OBS rodando com cena CAM1 ativa + Virtual Camera ON
- [ ] Logar como `transmissao@<domain>` no Meet
- [ ] Criar reunião nova
- [ ] Validar:
  - [ ] Vídeo do OBS aparece na pré-visualização
  - [ ] Sem reprocessamento (Studio* desligados)
  - [ ] Indicador de gravação aparece ao entrar (gravação iniciou)
- [ ] Sair da sala
- [ ] Validar gravação salva em Drive compartilhado

### 7. Documentar acesso

- [ ] Anotar credenciais em vault da equipe (NÃO commitar)
- [ ] Distribuir link da reunião e do streaming aos stakeholders

## Acceptance Criteria

- ✅ Conta `transmissao@<domain>` ativa com Enterprise Plus + Gemini
- ✅ Studio Look/Lighting/Sound OFF
- ✅ Background blur OFF
- ✅ Câmera default = OBS Virtual Camera
- ✅ Gravação automática ON
- ✅ Live streaming habilitado (se aplicável)
- ✅ Smoke do Meet com gravação salva no Drive

## Quality Gate: QG-LIVE-READY (parcial)

Critérios em `config.yaml` → `quality_gates.QG-LIVE-READY`. Esta task fecha os primeiros 4 critérios; os 2 últimos (load test + smoke E2E) ficam para `run-load-test.md`.

## Handoff

Próximo: `run-load-test.md`.
