# Task 02 — Hardware Diagnosis (Diagnóstico de Hardware)

## Agent: Hardware Specialist

## Objetivo

Realizar diagnóstico técnico completo do dispositivo Samsung Galaxy, identificando as causas das falhas reportadas através de metodologia baseada nas normas **ABNT NBR ISO/IEC 17025:2017** e **ABNT NBR IEC 62368-1:2023**. Inclui obrigatoriamente a leitura e registro do status Knox e-FUSE.

## Protocolo de Diagnóstico

### Fase 2.1 — Inspeção Visual Externa (Nível 1 — Não Invasivo)

**Equipamento:** Microscópio estereoscópico 10-100x, câmera fotográfica 12MP+

**Procedimento:**
```
2.1.1 Fotografar as 6 faces do dispositivo (frente, traseira, superior, inferior, laterais)
2.1.2 Fotografar em detalhe (macro):
      - Porta USB-C (limpeza, pinos, deformações, corrosão)
      - Bandeja do chip SIM (danos, deformação)
      - Botões físicos (Power, Volume, Bixby)
      - Câmeras traseiras (vidro, módulo)
      - Tela (rachaduras, manchas, pixels mortos)
      - Carcaça (amassados, arranhões profundos, evidências de queda)
2.1.3 Inspecionar com microscópio a porta USB-C:
      - Estado dos pinos de contato (24 pinos no padrão USB-C)
      - Presença de corrosão (oxidação)
      - Presença de detritos ou umidade
      - Deformação mecânica do conector
2.1.4 Verificar Indicador de Dano por Líquido (LDI):
      - LDI interno (acessível via bandeja SIM ou abertura)
      - Registrar: Ativado (vermelho/rosa) ou Não Ativado (branco/prata)
2.1.5 Verificar integridade da vedação perimetral (IP68)
      - Sinais de abertura prévia ou comprometimento da vedação
```

**Documentação:** Tabela fotográfica numerada (Foto 01 a Foto N)

### Fase 2.2 — Diagnóstico por Software e Knox (Nível 2 — Não Invasivo)

**Equipamento:** PC com ADB instalado, cabo USB-C certificado

**Procedimento:**
```
2.2.1 Leitura do Knox Warranty Void Flag (OBRIGATÓRIO):
      Método 1 — ADB:
        adb devices
        adb shell getprop ro.boot.warranty_bit
        → Resultado: "0" (íntegro / 0x0) ou "1" (acionado / 0x1)

      Método 2 — Samsung Service Mode:
        Discar *#0*#* no teclado
        Menu Knox → Knox Warranty Void
        → Resultado: 0x0 ou 0x1

      Método 3 — Samsung Members (app oficial):
        Abrir Samsung Members → Get Help → Remote Support → Device Status
        → Status da garantia e Knox

      Documentar: método utilizado + resultado + screenshot/foto

2.2.2 Verificar versão de firmware:
        adb shell getprop ro.build.version.release (Android)
        adb shell getprop ro.build.version.oneui (One UI)

2.2.3 Tentar conexão ADB em modo normal:
      - adb devices → Reconhecido / Não Reconhecido
      - Registrar status

2.2.4 Tentar conexão em modo Download (ODIN):
      - Procedimento: Desligar, pressionar Vol- + conectar USB
      - Registrar reconhecimento

2.2.5 Samsung Service Mode (*#0*#*) se acessível:
      - Battery → verificar saúde, tensão, temperatura
      - USB → verificar status da porta
      - Registrar resultados relevantes

2.2.6 Via ADB — informações de bateria:
      adb shell dumpsys battery
      → Registrar: level, status, health, voltage, temperature
```

### Fase 2.3 — Diagnóstico Elétrico com AFC/PPS (Nível 3 — Semi-Invasivo)

**Equipamento:** USB Tester com suporte AFC/PPS (ex: FNIRSI C1 ou Charger Doctor AFC), multímetro Fluke 87V, câmera termográfica FLIR

**Procedimento:**
```
2.3.1 Teste de Carga via Cabo USB-C (Samsung AFC):
      - Carregador Samsung original 25W (EP-TA800 ou EP-TA800N)
      - Carregador Samsung original 45W (EP-TA845)
      - Carregador genérico USB PD 3.0 (PPS)
      - Cabo Samsung original EP-DX510
      - Registrar para cada combinação:
        * Tensão (V): esperado 5V (padrão) → 9V/1,77A (AFC) → PPS
        * Corrente (A): 5V/2A padrão; 9V/1,67A (AFC 15W); até 25W com PPS
        * Potência (W): registrar potência real medida
        * Negociação AFC: ocorreu / não ocorreu (permaneceu em 5V)
        * Resultado: Carrega / Não Carrega / Carrega lentamente

2.3.2 Teste de Carga sem Fio:
      - Usar carregador Samsung original 15W (EP-P2400)
      - Posicionar corretamente no centro
      - Monitorar ícone de carga e aquecimento
      - Registrar: Carrega / Não Carrega

2.3.3 Análise Termográfica:
      - Capturar imagem termográfica da traseira durante carga sem fio
      - Capturar imagem termográfica da região inferior durante tentativa de carga com cabo
      - Temperatura operacional normal Samsung: 0°C a 42°C
      - Temperatura de alerta: acima de 50°C (possível falha no PMIC)

2.3.4 Medição de Resistência da Porta USB-C:
      - Multímetro em modo diodo/resistência
      - Medir VBUS → GND: verificar curto (< 1 Ω = problema grave)
      - Medir CC1 → GND e CC2 → GND
```

### Fase 2.4 — Análise de Intervenções Anteriores

**Procedimento:**
```
2.4.1 Inspeção externa de vedação/selagem:
      - Verificar integridade do adesivo/gaxeta perimetral (IP68)
      - Sinais de abertura prévia: marcas de ferramentas, adesivo rompido/recolocado
      - Parafusos na base (se aplicável): marcas de chave inadequada

2.4.2 Se autorizada desmontagem pelo juízo:
      - Remoção documentada frame a frame (foto antes/depois de cada passo)
      - Verificar:
        * Parafusos corretos ou substituídos por tipo inadequado
        * Conectores FPC com danos (rasgos, dobras, oxidação)
        * Componentes SMD deslocados, danificados ou substituídos
        * Resíduos de fluxo de solda indicando rework na placa principal
        * Danos por calor (queimados, bolhas no PCB)
        * Bateria original Samsung ou substituída
        * LDI interno: estado e localização

2.4.3 Consulta ao histórico Samsung:
      - Número de série em samsung.com/br/support → histórico de serviços
      - Samsung Members → Repair History
      - Registrar: "Reparo autorizado Samsung realizado" / "Sem registros de serviço Samsung"
```

## Tabela de Registro de Resultados

| Teste | Método | Resultado Obtido | Resultado Esperado | Conformidade |
|---|---|---|---|---|
| Knox Warranty Void Flag | ADB / *#0*#* | — | 0x0 (íntegro) | — |
| Carga USB-C — Samsung 25W | USB Tester AFC | — | 9V/1,67A/15W ou 5V/3A/15W | — |
| Carga USB-C — Samsung 45W | USB Tester AFC | — | PPS até 45W | — |
| Negociação AFC | USB Tester | — | Transição 5V→9V em ≤10s | — |
| Carga sem fio — 15W | Observação | — | Ícone carregando | — |
| Reconhecimento USB (Normal) | ADB | — | device listed | — |
| Reconhecimento USB (Download) | ODIN mode | — | Download mode | — |
| Temperatura carga cabo | FLIR | — | < 42°C | — |
| Resistência VBUS-GND | Multímetro | — | > 10 kΩ | — |
| LDI / LCI | Visual | — | Branco/Prata | — |
| Saúde da bateria | ADB dumpsys | — | GOOD / OVER_VOLTAGE | — |

## Outputs

```yaml
- relatorio_diagnostico_hardware.md    # Resultado completo com fotos e medições
- knox_status_report.md                # Status Knox e-FUSE + método de leitura + análise
- tabela_medicoes_eletricas.xlsx        # Planilha de medições numéricas (incluindo AFC)
- fotos_pericia/                        # Pasta com fotos numeradas e datadas
- hipoteses_falha_rankeadas.md          # Hipóteses em ordem de probabilidade
```

## Critério de Conclusão

Task concluída quando:
- Status Knox e-FUSE lido e registrado por método documentado
- Todos os testes das Fases 2.1 a 2.4 executados e documentados
- Fotos registradas e numeradas
- Tabela de medições completa (incluindo negociação AFC/PPS)
- Hipótese(s) de falha identificada(s) com embasamento técnico

## Prazo Típico

1-3 dias úteis (dependendo da complexidade e necessidade de desmontagem)
