# Android/Samsung Diagnostics — Dados Técnicos de Referência

## 1. Samsung Galaxy S24 Ultra — Especificações Técnicas Periciais

### 1.1 Identificação do Produto

| Campo | Valor |
|---|---|
| Nome Comercial | Galaxy S24 Ultra |
| Números de Modelo (Brasil) | SM-S928B/DS (nano-SIM + eSIM) |
| SKU Brasil | SM-S928BZKPZTO (256GB Titanium Black) |
| SoC | Qualcomm Snapdragon 8 Gen 3 (4nm TSMC SM8650-AB) |
| RAM | 12 GB LPDDR5X |
| Lançamento | Janeiro 2024 |
| Certificação ANATEL | 02648-25-XXXXX |
| Certificação IP | IP68 (IEC 60529) — até 2m por 30 minutos |
| Certificação MIL-STD | MIL-STD-810H (resistência a impactos) |

### 1.2 Sistema de Carregamento Samsung

| Parâmetro | Valor |
|---|---|
| Conector | USB-C (USB 3.2 Gen 2 — 10 Gbps) |
| Protocolo de carga padrão | USB Power Delivery 3.0 (USB PD) |
| Samsung AFC | Adaptive Fast Charge — 9V/1,67A = 15W |
| Samsung Super Fast Charging 2.0 | PPS — até 5A/10V = 45W (com carregador EP-TA845) |
| Potência máxima via cabo | 45W (com adaptador Samsung 45W ou USB PD PPS) |
| Carga sem fio | Wireless PowerShare 15W (Qi2 / WPC 1.3) |
| Carga reversa sem fio | Sim (PowerShare 4,5W para wearables) |
| Conector interno (cabo FPC) | 24 pinos USB-C + trilhas de diagnóstico |

### 1.3 Bateria

| Parâmetro | Valor |
|---|---|
| Capacidade | 5.000 mAh |
| Tensão nominal | 3,85V |
| Tensão de corte (mínima) | 3,0V |
| Tensão máxima de carga | 4,45V |
| Ciclos de vida estimados | ≥ 500 ciclos para ≥ 80% de capacidade |
| Part Number (original) | EB-BS928ABY |

### 1.4 Circuitos de Gerenciamento de Energia

| Componente | Função | Falha típica |
|---|---|---|
| Qualcomm PM8550 (PMIC) | Gerência de energia do sistema | Não inicialização, superaquecimento, curto em VBUS |
| Qualcomm SMB1398 (Charging IC) | Negociação AFC/PPS, controle de carga | Não carregamento via cabo, AFC não negociado |
| Samsung MFC (Multi-Function Charger) | Controle integrado de carga sem fio e com fio | Falha seletiva em uma das modalidades |
| Capacitor VBUS (100nF/10V) | Filtro de VBUS / desacoplamento do PMIC | Curto-circuito em VBUS se danificado |
| Indutor L_VBUS | Filtro EMI do VBUS | Circuito aberto = sem carga com fio |
| FPC USB-C | Cabo flexível conectando porta USB-C à placa principal | Falha por dobramento, rasgos, mau contato |

### 1.5 Knox e-FUSE — Referência Técnica

| Estado | Código Hex | Comando ADB | Samsung *#0*#* |
|---|---|---|---|
| Bootloader íntegro | 0x0 | `ro.boot.warranty_bit = 0` | Knox Warranty: 0x0 |
| Bootloader desbloqueado | 0x1 | `ro.boot.warranty_bit = 1` | Knox Warranty: 0x1 |

**Leitura via ADB:**
```bash
adb devices                                    # verificar conexão
adb shell getprop ro.boot.warranty_bit         # resultado: 0 ou 1
adb shell getprop ro.build.version.release     # versão Android
adb shell getprop ro.build.version.oneui       # versão One UI
adb shell getprop ro.build.type                # "user" = oficial; outros = customizado
```

**Leitura via Samsung Service Mode (*#0*#*):**
- Discar `*#0*#*` no teclado → menu de diagnóstico
- Navegar até Knox → Knox Warranty Void

---

## 2. Indicador de Dano por Líquido (LDI) — Samsung

| LDI | Localização | Cor Normal | Cor Ativada |
|---|---|---|---|
| LDI-1 | Interior acessível via bandeja SIM | Branco/Prata | Vermelho/Rosa |
| LDI-2 | Interior — placa principal (após abertura) | Branco/Prata | Vermelho/Rosa |

**Nota:** LDI ativado indica contato com líquido, mas não significa automaticamente perda de garantia. Deve ser analisado em conjunto com o tipo de defeito e o grau de proteção IP do modelo.

---

## 3. Diagnóstico Diferencial — Falhas de Carregamento Samsung

### Cenário A: Não carrega via cabo, carrega via Wireless

| Hipótese | Probabilidade | Diagnóstico Confirmatório |
|---|---|---|
| SMB1398 / Charging IC com falha | ALTA | AFC não negociado; tensão estática em 4,9-5V com corrente ~zero |
| FPC do conector USB-C danificado | MODERADA | Continuidade interrompida em trilhas; marcas de dobramento |
| Pinos do conector USB-C oxidados/detritos | MODERADA | Microscópio: corrosão visível; limpeza pode restaurar |
| CC1/CC2 interrompidos (não negocia PD) | MODERADA | Resistência CC1/CC2 fora da faixa esperada |
| Software / bug One UI | BAIXA | Factory reset ou flash de firmware resolve |

### Cenário B: Não carrega via cabo NEM via Wireless

| Hipótese | Probabilidade | Diagnóstico Confirmatório |
|---|---|---|
| PMIC (PM8550) com falha total | ALTA | Resistência VBUS-GND < 1Ω; sem corrente em nenhuma fonte |
| Curto-circuito na placa principal | ALTA | Temperatura elevada na câmera térmica; resistência VBUS~zero |
| Bateria totalmente descarregada/morta | MODERADA | Medir tensão direta da bateria (< 2,5V = célula morta) |
| Dano por líquido ao PMIC | MODERADA | LDI ativado + corrosão na placa principal |
| Dano por intervenção (componente ausente/danificado) | ALTA | Inspeção visual interna sob microscópio |

### Cenário C: AFC não negociado (carrega apenas em 5V/2A = 10W)

| Hipótese | Probabilidade | Diagnóstico Confirmatório |
|---|---|---|
| Cabo USB-C não suportado (não AFC) | ALTA | Testar com cabo Samsung EP-DX510 original |
| Carregador não AFC | ALTA | Testar com carregador Samsung EP-TA800 original |
| SMB1398 com falha parcial (aceita 5V, não negocia AFC) | MODERADA | Com cabo e carregador originais, AFC ainda falha |
| CC1/CC2 com alta resistência | BAIXA | Medição de CC1/CC2 fora da faixa |

---

## 4. Procedimento de Verificação do IMEI — Samsung

### 4.1 Verificação IMEI Samsung

```
IMEI via *#06#: exibe IMEI 1 e IMEI 2 (dual SIM)
IMEI via bandeja SIM: impresso no compartimento
IMEI via Configurações > Sobre o telefone
```

**Algoritmo de validação:** Luhn (mod 10) — aplicável a todos os IMEIs

**Verificação de regularização no Brasil:**
- Portal CEMIR/ABR Telecom: consultaaparelhoimpedido.com.br
- Consulta de homologação ANATEL: sistemas.anatel.gov.br/sch

### 4.2 Decodificação do Número de Série Samsung

Formato Samsung: `RFXXXXXXXX` (10 caracteres)
- `RF`: prefixo Samsung (Coreia/Samsung)
- `X` seguintes: codificam data de fabricação e lote
- Verificação via Samsung Members → Sobre o telefone → Status do dispositivo

---

## 5. Ferramentas e Equipamentos para Diagnóstico Pericial Android/Samsung

### 5.1 Ferramentas de Hardware

| Ferramenta | Uso | Norma de Referência |
|---|---|---|
| Chave Phillips PH000 | Parafusos variados Galaxy | — |
| Ferramenta de abertura por vácuo/ventosa | Remoção da tela (colada com adesivo) | — |
| Espátula náilon/plástico ESD | Abertura sem danos | IEC 61340-5-1 |
| Pulseira antiestática ESD | Proteção de componentes | IEC 61340-5-1 |
| ESD Mat | Proteção da área de trabalho | IEC 61340-5-1 |
| Pistola de calor controlada (80-120°C) | Amolecimento do adesivo para abertura | — |

### 5.2 Instrumentos de Medição

| Instrumento | Especificação Mínima | Uso |
|---|---|---|
| Multímetro digital | 4,5 dígitos, CAT III, IEC 61557 | Tensão, corrente, resistência |
| USB PD/AFC Tester (suporte PPS) | Suporte USB PD 3.0 + PPS + AFC | Monitoramento de carga Samsung |
| Osciloscópio | ≥ 100 MHz, 2 canais | Análise de sinais digitais |
| Câmera termográfica | NETD ≤ 50mK, resolução ≥ 160x120 | Detecção de pontos quentes |
| LCR Meter | Precisão 0,1%, frequência 100Hz-1MHz | Medição de componentes SMD |
| Microscópio estereoscópico | 10x a 200x, iluminação LED | Inspeção de PCB e componentes |

### 5.3 Software de Diagnóstico

| Software | Plataforma | Uso |
|---|---|---|
| Android Debug Bridge (ADB) | Windows/macOS/Linux | Knox, firmware, bateria, logs |
| Samsung Service Mode (*#0*#*) | No dispositivo | Diagnóstico integrado Samsung |
| Samsung Members (app) | Android | Diagnóstico remoto, status Knox, garantia |
| ODIN (Samsung) | Windows | Flash de firmware (somente leitura para perícia) |
| Heimdall | Linux/macOS | Alternativa open-source ao ODIN |

---

## 6. Tabela de Valores de Mercado — Samsung Galaxy (Referência)

*Valores de referência para São Paulo/SP — maio de 2026 (pesquisa em varejistas e plataformas de revenda)*

| Modelo | Capacidade | Novo (R$) | Usado bom estado (R$) | Usado c/ defeito (R$) |
|---|---|---|---|---|
| Galaxy S24 Ultra | 256 GB | 7.499 | 4.800 – 5.800 | 500 – 1.200 |
| Galaxy S24 Ultra | 512 GB | 8.499 | 5.500 – 6.500 | 600 – 1.400 |
| Galaxy S24 Ultra | 1 TB | 9.499 | 6.200 – 7.200 | 700 – 1.500 |
| Galaxy S24+ | 256 GB | 5.499 | 3.500 – 4.200 | 400 – 900 |
| Galaxy S24 | 128 GB | 4.199 | 2.500 – 3.200 | 300 – 700 |
| Galaxy A55 | 256 GB | 2.699 | 1.800 – 2.200 | 200 – 450 |
| Galaxy A35 | 128 GB | 1.899 | 1.200 – 1.500 | 150 – 300 |

*Nota: Valores meramente indicativos para fins periciais. O perito deve pesquisar os valores atuais na data do laudo, citando as fontes (Mercado Livre, Magazine Luiza, Samsung Store, OLX).*
