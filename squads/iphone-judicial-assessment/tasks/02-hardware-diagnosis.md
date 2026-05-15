# Task 02 — Hardware Diagnosis (Diagnóstico de Hardware)

## Agent: Hardware Specialist

## Objetivo

Realizar diagnóstico técnico completo do dispositivo iPhone, identificando as causas das falhas reportadas através de metodologia baseada nas normas **ABNT NBR ISO/IEC 17025:2017** e **IEC 62368-1:2018**.

## Protocolo de Diagnóstico

### Fase 2.1 — Inspeção Visual Externa (Nível 1 — Não Invasivo)

**Equipamento:** Microscópio estereoscópico 10-100x, câmera fotográfica 12MP+

**Procedimento:**
```
2.1.1 Fotografar as 6 faces do dispositivo (frente, traseira, superior, inferior, laterais)
2.1.2 Fotografar em detalhe (macro):
      - Porta USB-C (limpeza, pinos, deformações, corrosão)
      - Bandeja do chip SIM (danos, deformação)
      - Botões físicos (Silêncio, Volume, Power)
      - Câmeras traseiras (vidro, módulo)
      - Tela (rachaduras, manchas, pixels mortos)
      - Carcaça (amassados, arranhões profundos, evidências de queda)
2.1.3 Inspecionar com microscópio a porta USB-C:
      - Estado dos pinos de contato (24 pinos no padrão USB-C)
      - Presença de corrosão (oxidação — coloração esverdeada/alaranjada)
      - Presença de detritos ou umidade
      - Deformação mecânica do conector
2.1.4 Verificar Indicadores de Contato com Líquido (LCI):
      - LCI da bandeja SIM (interno)
      - LCI do conector inferior (se acessível visualmente)
      - Registrar: Ativado (vermelho/rosa) ou Não Ativado (branco/prata)
```

**Documentação:** Tabela fotográfica numerada (Foto 01 a Foto N)

### Fase 2.2 — Diagnóstico por Software (Nível 2 — Não Invasivo)

**Equipamento:** MacBook com Apple Configurator 2, cabo USB-C certificado MFi

**Procedimento:**
```
2.2.1 Tentar conexão em modo normal:
      - Conectar via cabo USB-C ao MacBook
      - Verificar reconhecimento pelo sistema (lsusb / Configurator)
      - Registrar: Reconhecido / Não Reconhecido / Reconhecido com erro

2.2.2 Tentar conexão em modo Recovery:
      - Procedimento: Pressionar Volume+ → Volume- → manter Power
      - Verificar reconhecimento em modo Recovery
      - Registrar estado

2.2.3 Tentar conexão em modo DFU:
      - Procedimento Apple DFU específico para iPhone 16 Pro Max
      - Verificar reconhecimento
      - Registrar estado

2.2.4 Se reconhecido:
      - Capturar dados do dispositivo (Model ID, ECID, IMEI via GSX se habilitado)
      - Verificar logs de diagnóstico se acessíveis
      - Documentar versão do firmware/iOS instalado

2.2.5 Teste de carregamento via software:
      - Conectar carregador USB-C original Apple (20W ou 30W)
      - Monitorar via USB Tester: tensão de entrada, corrente, potência
      - Registrar por 5 minutos: carga ocorre / não ocorre / carga anormal
```

### Fase 2.3 — Diagnóstico Elétrico (Nível 3 — Semi-Invasivo)

**Equipamento:** USB Power Delivery Tester (FNIRSI C1 ou similar), multímetro Fluke 87V, câmera termográfica FLIR

**Procedimento:**
```
2.3.1 Teste de Carga via Cabo USB-C:
      - Carregador Apple original 20W (USB-C, MFi certificado)
      - Carregador Apple original 30W (USB-C, MFi certificado)
      - Carregador terceiros certificado USB PD 3.0
      - Cabo Apple original
      - Registrar para cada combinação:
        * Tensão (V): esperado 5V, 9V ou 15V (USB PD)
        * Corrente (A): esperado até 2A (20W) ou 2A (30W)
        * Potência (W): esperado até 20W/30W
        * Resultado: Carrega / Não Carrega / Carrega lentamente

2.3.2 Teste de Carga sem Fio (MagSafe):
      - Usar carregador MagSafe original Apple (25W Qi2)
      - Posicionar corretamente (alinhamento magnético)
      - Monitorar aquecimento e ícone de carga na tela
      - Registrar: Carrega / Não Carrega

2.3.3 Análise Termográfica:
      - Capturar imagem termográfica da traseira durante carga sem fio
      - Capturar imagem termográfica da região inferior durante tentativa de carga com cabo
      - Identificar pontos de temperatura anormal
      - Temperatura operacional normal: 0°C a 35°C (conforme Apple)
      - Temperatura de alerta: acima de 45°C (possível falha no PMIC)

2.3.4 Medição de Resistência da Porta USB-C:
      - Multímetro em modo diodo/resistência
      - Medir resistência entre VBUS e GND: verificar curto (< 1 Ohm = problema)
      - Medir resistência do CC1/CC2 (negociação USB PD)
```

### Fase 2.4 — Análise de Intervenções Anteriores

**Procedimento:**
```
2.4.1 Inspeção externa de vedação/selagem:
      - Verificar integridade do adesivo/gaxeta perimetral (resistência à água)
      - Sinais de abertura prévia: marcas de ferramentas, adesivo rompido/recolocado
      - Parafusos Pentalobe inferiores: marcas de chave de fenda inadequada (danos)

2.4.2 Se autorizada desmontagem pelo juízo:
      - Remoção documentada frame a frame (foto antes/depois de cada passo)
      - Verificar:
        * Parafusos corretos ou substituídos por tipo inadequado
        * Conectores FPC com danos (rasgos, dobras, oxidação)
        * Componentes SMD deslocados, danificados ou substituídos
        * Resíduos de fluxo de solda indicando rework na placa-lógica
        * Danos por calor (queimados, bolhas no PCB)
        * Bateria original Apple ou substituída (verificar adesivo e etiqueta)

2.4.3 Consulta ao histórico Apple (GSX):
      - Número de série na base Apple: verificar serviços realizados por ASP
      - Registrar: "Reparo autorizado realizado" / "Sem registros de serviço Apple"
```

## Tabela de Registro de Resultados

| Teste | Método | Resultado Obtido | Resultado Esperado | Conformidade |
|---|---|---|---|---|
| Carga USB-C (Apple 20W) | USB Tester | — | 9V / 2,22A / 20W | — |
| Carga USB-C (Apple 30W) | USB Tester | — | 9V / 3,33A / 30W | — |
| Carga MagSafe (25W) | Observação | — | Ícone carregando | — |
| Reconhecimento USB (Normal) | Configurator | — | Dispositivo detectado | — |
| Reconhecimento USB (DFU) | Configurator | — | DFU mode detected | — |
| Temperatura carga cabo | FLIR | — | < 35°C | — |
| Resistência VBUS-GND | Multímetro | — | > 10 kΩ | — |
| LCI (indicador de líquido) | Visual | — | Branco/Prata | — |

## Outputs

```yaml
- relatorio_diagnostico_hardware.md    # Resultado completo com fotos e medições
- tabela_medicoes_eletricas.xlsx        # Planilha de medições numéricas
- fotos_pericia/                        # Pasta com fotos numeradas e datadas
- hipoteses_falha_rankeadas.md          # Hipóteses em ordem de probabilidade
```

## Critério de Conclusão

Task concluída quando:
- Todos os testes da Fase 2.1 a 2.4 executados e documentados
- Fotos registradas e numeradas
- Tabela de medições completa
- Hipótese(s) de falha identificada(s) com embasamento técnico

## Prazo Típico

1-3 dias úteis (dependendo da complexidade e necessidade de desmontagem)
