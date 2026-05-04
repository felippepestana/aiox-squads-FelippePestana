# Checklist — Validação de Banda USB

> Executar SEMPRE antes de evento e após qualquer mudança de hardware/topologia.

## Ferramenta

- **Windows**: USBTreeView (https://www.uwe-sieber.de/usbtreeview_e.html)
- **macOS**: System Information → USB ou IORegistryExplorer
- **Linux**: `lsusb -t` + `cat /sys/kernel/debug/usb/devices`

## Procedimento

### 1. Conectar todas as 4 câmeras + áudio + outros periféricos

- [ ] CAM1, CAM2, CAM3, CAM4 nas portas planejadas em `data/usb-topology.yaml`
- [ ] Interface de áudio em controlador raiz separado
- [ ] D6000 conectado (somente periféricos)

### 2. Snapshot inicial

- [ ] Abrir USBTreeView
- [ ] Identificar cada câmera (VID OBSBOT)
- [ ] Confirmar negociação **SuperSpeed (5 Gbps)** — não Hi-Speed (480 Mbps)

### 3. Mapear root hubs

Anotar:

| Câmera | Porta física | Root hub (xHCI Controller) | Speed |
|---|---|---|---|
| CAM1 | _____________ | __________________ | SuperSpeed ✓ / ✗ |
| CAM2 | _____________ | __________________ | SuperSpeed ✓ / ✗ |
| CAM3 | _____________ | __________________ | SuperSpeed ✓ / ✗ |
| CAM4 | _____________ | __________________ | SuperSpeed ✓ / ✗ |

### 4. Validar distribuição

Critério:

- [ ] Pelo menos **2 root hubs** distintos hospedando câmeras **ou** todas em hub powered USB 3.x externo (ver `data/usb-topology.yaml`)
- [ ] Se 4 câmeras compartilharem o mesmo root hub / hub powered: confirmar **alimentação externa**, banda total **< 70%** e smoke de 30 min sem desconexões

### 5. Estimar banda alocada

Para cada câmera ativa em 1080p30 MJPEG:

- Banda aproximada: **120 Mbps**
- 2 câmeras por root hub: ~240 Mbps de 5000 Mbps = **~5%** ✓
- 4 câmeras por root hub: ~480 Mbps de 5000 Mbps = **~10%** ✓

Critério: **< 70% por root hub**.

### 6. Smoke 30min

- [ ] Iniciar OBS com todas as 4 câmeras capturando
- [ ] Cronometrar 30 minutos
- [ ] Observar:
  - [ ] 0 desconexões reportadas pelo OS
  - [ ] OBS Stats: drops < 0.5%
  - [ ] Câmeras mantêm SuperSpeed (não fazem fallback)

### 7. Resultados

```yaml
usb_validation:
  date: "____-__-__"
  operator: "_______________"
  cameras_superspeed: 4/4
  root_hubs_used: 2
  bandwidth_max_pct_per_hub: __
  smoke_30min:
    disconnections: __
    obs_drops_pct: __.__
  pass_fail: PASS|FAIL
```

## Em caso de FAIL

- [ ] Câmera em Hi-Speed: trocar de porta (preferir porta marcada SS ou SS10)
- [ ] Drops > 0.5%: redistribuir para mais root hubs ou usar hub powered separado
- [ ] Desconexões: verificar cabo (passivo > 2m frequentemente falha) e firmware
- [ ] Banda > 70%: reduzir resolução para 720p30 (1280×720) ou reduzir FPS para 24/15 ou usar MJPEG (não YUYV)

## Atenção: D6000

- [ ] **NENHUMA câmera** está conectada ao Dell D6000
- [ ] D6000 hospeda APENAS: teclado, mouse, monitores, ethernet
- [ ] Se houver câmera no D6000, **abortar** e replanejar topologia
