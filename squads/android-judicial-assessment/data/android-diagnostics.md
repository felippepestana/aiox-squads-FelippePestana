# Android/Samsung Diagnostics — Dados Técnicos de Referência

## 1. Samsung Galaxy S24 Ultra — Especificações Técnicas Periciais

### 1.1 Identificação do Produto

| Campo | Valor |
|---|---|
| Nome Comercial | Galaxy S24 Ultra |
| Número de Modelo (Brasil) | SM-S928B/DS (Dual SIM — nano-SIM + eSIM) |
| SKU Brasil | SM-S928BZKPZTO (Titanium Black 256GB) / SM-S928BZGPZTO (Titanium Gray 256GB) |
| SoC | Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm TSMC) |
| RAM | 12 GB LPDDR5X |
| Lançamento | Janeiro de 2024 |
| Certificação IP | IP68 (IEC 60529) — até 2m por 30 minutos |
| Certificação ANATEL | Verificar em sistemas.anatel.gov.br/sch/ (lote específico) |

### 1.2 Sistema de Carregamento Samsung Galaxy S24 Ultra

| Parâmetro | Valor |
|---|---|
| Conector | USB-C 3.2 Gen 2 (10 Gbps) |
| Protocolo de carga principal | USB Power Delivery 3.0 / PPS |
| Padrão Samsung | SFC+ (Super Fast Charge Plus) |
| Potência máxima via cabo | 45W (SFC+) |
| Tensão / Corrente SFC+ | 11V / 4,09A (PPS) |
| Tensão / Corrente SFC | 9V / 2,77A = 25W |
| Tensão / Corrente AFC | 9V / 1,67A = 15W |
| Tensão / Corrente padrão | 5V / 2A = 10W (USB padrão) |
| Carga sem fio (Qi2) | 15W (Samsung Wireless PowerShare) |
| Carga sem fio (Qi 1.4) | 15W |
| Carga reversa sem fio | 4,5W (PowerShare — carrega outros dispositivos Qi) |
| Bateria | Li-Ion 5.000 mAh / 3,85V nominal |

### 1.3 Protocolos de Carregamento Rápido Samsung — Diferenciação

| Padrão | Nome | Tensão | Corrente | Potência | Carregador Mínimo |
|---|---|---|---|---|---|
| SFC+ | Super Fast Charge Plus | 11V (PPS) | 4,09A | 45W | EP-T4510 (45W) |
| SFC | Super Fast Charge | 9V | 2,77A | 25W | EP-TA800 (25W) |
| AFC | Adaptive Fast Charge | 9V | 1,67A | 15W | EP-TA300 (15W) |
| USB PD 3.0 | USB Power Delivery | 9V–20V | variável | até 100W | Carregador PD 3.0 terceiros |
| USB padrão | USB 5V básico | 5V | 2A | 10W | Qualquer carregador USB |

**Nota Técnica:** A negociação AFC/SFC/SFC+ ocorre via sinalização nos pinos **CC1 e CC2** do conector USB-C. Falha nesses pinos resulta em carga apenas em modo USB 5V básico, mesmo com carregador Samsung 45W.

### 1.4 Samsung Knox Security Architecture

#### 1.4.1 Knox Warranty Void Flag (e-FUSE)

| Estado | Valor | Condição |
|---|---|---|
| Intacto | 0x0 | Bootloader nunca desbloqueado; firmware Samsung oficial |
| Acionado | 0x1 | Bootloader foi desbloqueado (operação irreversível) |

**Verificação via ADB:**
```bash
adb shell getprop ro.boot.warranty_bit
# Output: 0 = Knox intacto (0x0)
# Output: 1 = Knox acionado (0x1)
```

**Verificação via menu secreto Samsung (*#0*#*):**
- Discar *#0*#* para abrir o menu de diagnóstico
- Verificar na seção de informações do dispositivo

**Verificação via Download/ODIN Mode:**
- Galaxy S24 Ultra: Pressionar Vol Down + Vol Up + Power simultaneamente
- Mensagem "CUSTOM BINARY BLOCKED BY OEM LOCK" = Knox=0x1 (garantia da Samsung violada)
- Mensagem "ODIN MODE" sem aviso custom binary = Knox=0x0 ou bootloader bloqueado por OEM

**Causas de acionamento do Knox (0x1):**
1. Desbloqueio de bootloader via `fastboot oem unlock` ou Opções do Desenvolvedor
2. Instalação de ROM customizada (LineageOS, Evolution X, etc.)
3. Rooting via Magisk ou SuperSU
4. Flash de firmware não oficial via ODIN/Heimdall
5. Reparo por assistência não autorizada que realizou flash de firmware não oficial

**Característica irreversível:** O Knox e-FUSE é permanente. Nem o Samsung Service Center nem o próprio fabricante podem reverter 0x1 para 0x0. A única solução é substituição da placa-lógica (motherboard).

#### 1.4.2 Samsung Knox Security Levels

| Nível | Descrição | Impacto no Knox Flag |
|---|---|---|
| DEFEX | Kernel-level exploit protection | Não aciona Knox Flag |
| RKP (Real-time Kernel Protection) | Monitora o kernel em tempo real | Não aciona Knox Flag |
| TrustZone | Ambiente de execução segura (TEE) | Não aciona Knox Flag |
| Knox e-FUSE | Hardware-level boot verification | Acionado por desbloqueio de bootloader |

### 1.5 Liquid Damage Indicators (LDI) — Samsung Galaxy S24 Ultra

| LDI | Localização | Acessibilidade | Cor Normal | Cor Ativada |
|---|---|---|---|---|
| LDI-1 | Área interna da bandeja SIM (lateral esquerda) | Visível com bandeja removida | Branco/Prata | Vermelho/Rosa/Laranja |
| LDI-2 | Área adjacente ao conector USB-C (interior inferior) | Visível com desmontagem parcial | Branco/Prata | Vermelho/Rosa/Laranja |

**Posição dos LDI em outros modelos Samsung:**

| Modelo | LDI-1 | LDI-2 |
|---|---|---|
| Galaxy S24 Ultra (SM-S928B) | Bandeja SIM | Área USB-C (interno) |
| Galaxy S24+ (SM-S926B) | Bandeja SIM | Área USB-C (interno) |
| Galaxy S24 (SM-S921B) | Bandeja SIM | Área USB-C (interno) |
| Galaxy A54 (SM-A546B) | Bandeja SIM | Área USB-C (interno) |
| Galaxy Z Fold5 (SM-F946B) | Dobradiça | Área USB-C (interno) |

**Nota Pericial:** LDI ativado NÃO implica automaticamente perda de garantia. O fabricante deve demonstrar que o dano foi causado pelo contato com líquido. LDI ativado é indício de exposição a líquido, não prova de uso inadequado.

### 1.6 Parafusos e Ferramental Samsung

| Componente | Parafuso | Tamanho | Observação |
|---|---|---|---|
| Parafusos externos (base inferior) | T4 Torx | 0,9mm shaft | 2 parafusos; exigem chave T4 Torx específica |
| Parafusos internos (placa principal) | T3 Torx | 0,6mm shaft | Múltiplos parafusos |
| Parafusos internos (módulo câmera) | Phillips PH000 | — | Em alguns modelos |

**Evidência de abertura por terceiro:** Marcas de chave incompatível (ex: chave de fenda plana ou Phillips usados em parafuso Torx) deixam ranhuras alargadas e bordas irregulares visíveis ao microscópio. Esta evidência é objetiva e documentável fotograficamente.

---

## 2. Diagnóstico Diferencial — Falhas de Carregamento Samsung Galaxy

### Cenário A: Não carrega via cabo USB-C, carrega via wireless

| Hipótese | Probabilidade | Diagnóstico Confirmatório |
|---|---|---|
| Dano ao pino CC1 ou CC2 do conector USB-C | ALTA | Resistência instável em CC1 ou CC2; carga apenas em 5V |
| Módulo conector USB-C não original ou danificado | ALTA | Inspeção visual: módulo incompatível; part number incorreto |
| Cabo FPC com trilhas CC1/CC2 danificadas | ALTA | Continuidade interrompida nas trilhas CC específicas |
| Samsung Charging IC (MFC/SMB) com falha parcial | MODERADA | AFC não negociado; teste com múltiplos carregadores; resistência CC anormal |
| Detritos obstruindo pinos CC1/CC2 | BAIXA | Limpeza com ar comprimido restaura negociação AFC |
| Software (bug One UI) | MUITO BAIXA | Wipe de cache ou restauração de fábrica resolve |

### Cenário B: Não carrega via cabo NEM via wireless

| Hipótese | Probabilidade | Diagnóstico Confirmatório |
|---|---|---|
| PMIC com falha total | ALTA | Resistência VBUS-GND < 1Ω; sem corrente em nenhuma fonte |
| Curto-circuito na placa principal | ALTA | Resistência VBUS-GND próxima de zero; aquecimento anormal |
| Bateria completamente descarregada/danificada | MODERADA | Medir tensão da bateria diretamente: < 3,0V = crítica |
| Dano por líquido ao PMIC/MFC | MODERADA | LDI ativados + corrosão visível na placa |
| Dano por intervenção (componente ausente/danificado) | VARIÁVEL | Inspeção interna sob microscópio — componentes deslocados |

### Cenário C: Carrega apenas em 5V (sem AFC/SFC/SFC+)

| Hipótese | Probabilidade | Diagnóstico Confirmatório |
|---|---|---|
| CC1 ou CC2 com resistência anormal | ALTA | Multímetro: CC1 ou CC2 fora de 5kΩ-100kΩ; instabilidade |
| Carregador não suporta AFC/SFC | MUITO ALTA (verificar carregador) | Testar com carregador Samsung original 45W |
| Cabo sem vias de sinalização (cabo de carga somente) | ALTA | Testar com cabo Samsung original certificado |
| Samsung Charging IC com falha parcial | MODERADA | AFC não negociado mesmo com carregador Samsung original |

### Cenário D: Knox=0x1 + Defeito de hardware sem nexo com firmware

| Hipótese | Probabilidade | Diagnóstico Confirmatório |
|---|---|---|
| Desbloqueio anterior pelo consumidor + defeito independente | MODERADA | Verificar histórico de uso, relato das partes |
| Reparo via firmware não oficial por assistência não autorizada | MODERADA | Knox=0x1 + outros indícios de reparo (parafusos, FPC) |
| Knox acionado SEM relação com defeito atual | COMUM | Defeito é mecânico/elétrico, independente do Knox |

---

## 3. Ferramentas de Diagnóstico Android/Samsung

### 3.1 Android Debug Bridge (ADB)

**Instalação:** Android SDK Platform Tools (developer.android.com/studio/releases/platform-tools)

**Comandos pericialmente relevantes:**

```bash
# Verificar Knox Warranty Void Flag
adb shell getprop ro.boot.warranty_bit

# Número de série
adb shell getprop ro.serialno

# Modelo do dispositivo
adb shell getprop ro.product.model

# Versão Android
adb shell getprop ro.build.version.release

# Versão do firmware (One UI build)
adb shell getprop ro.build.display.id

# Status completo da bateria
adb shell dumpsys battery

# Temperatura da bateria (em décimos de grau Celsius)
adb shell dumpsys battery | grep temperature

# Saúde da bateria (1=unknown, 2=good, 3=overheat, 4=dead, 5=over-voltage)
adb shell dumpsys battery | grep health

# Listar dispositivos conectados
adb devices

# Log do sistema (diagnóstico de erros de hardware)
adb logcat -b system -s BatteryStatsImpl:* UsageStatsService:*

# Verificar se USB Charging está sendo detectado
adb shell dumpsys battery | grep plugged
```

**Resultado `dumpsys battery` (interpretação):**
```
Current Battery Service state:
  AC powered: false        → não carregando via adaptador CA
  USB powered: true/false  → carregando via USB / não carregando
  Wireless powered: true   → carregando via wireless
  charge counter: XXXXX    → capacidade atual em mAh
  status: 2                → 2=charging, 3=discharging, 4=not charging, 5=full
  health: 2                → 2=good, 3=overheat, 4=dead
  present: true
  level: XX                → nível de carga (0-100%)
  scale: 100
  voltage: XXXX            → tensão da bateria em mV
  temperature: XXX         → temperatura em décimos de °C (ex: 280 = 28,0°C)
```

### 3.2 ODIN (Samsung Flash Tool)

**Plataforma:** Windows exclusivamente
**Versão recomendada:** ODIN 3.14.4 ou superior
**Uso pericial:** Verificação de modo Download + identificação de firmware instalado
**Acesso Download Mode Galaxy S24 Ultra:** Vol Down + Vol Up + Power (segure por 3 segundos)

**Identificação de Knox no Download Mode:**
- "CUSTOM BINARY BLOCKED BY OEM LOCK" → Knox=0x1
- Tela ODIN normal sem aviso de custom binary → Knox=0x0 (nativo)

**ATENÇÃO:** O uso do ODIN para flash de firmware pode ALTERAR o Knox Flag se utilizado com firmware não oficial. Em contexto pericial, o ODIN deve ser usado apenas para leitura/verificação, NUNCA para escrita.

### 3.3 Heimdall (Alternativa ao ODIN — macOS/Linux)

**Plataforma:** macOS, Linux, Windows
**Projeto:** github.com/Benjamin-Dobell/Heimdall
**Uso pericial:** Identificação de partições e modo Download em sistemas não-Windows

```bash
# Listar dispositivos em modo Download
heimdall detect

# Listar partições (sem flash — apenas leitura)
heimdall print-pit --no-reboot
```

### 3.4 Samsung Smart Switch

**Plataforma:** Windows e macOS
**Download:** samsung.com/global/smartswitch
**Uso pericial:**
- Identificação do dispositivo (modelo, IMEI, número de série)
- Verificação de atualizações de firmware disponíveis
- Backup de dados para preservação de evidências
- Histórico de conexões ao Smart Switch

### 3.5 Samsung Members (App nativo)

**Disponibilidade:** Aplicativo pré-instalado em todos os dispositivos Samsung
**Uso pericial:**
- Diagnóstico remoto de hardware (Samsung Members > Suporte > Diagnóstico do telefone)
- Verificação de status de garantia
- Acesso a relatórios de diagnóstico
- Contato com Samsung Service Center

### 3.6 Samsung Find My Mobile / IMEI

**IMEI:** Verificar via *#06# ou ADB (`getprop ro.serialno` ou `getprop telephony.imei`)
**CEMIR/ANATEL:** Verificação de IMEI bloqueado por furto/roubo: consultaaparelhoimpedido.com.br
**Samsung Find My Mobile:** findmymobile.samsung.com (requer conta Samsung ativa)

---

## 4. Componentes de Hardware — Samsung Galaxy S24 Ultra

### 4.1 Circuitos de Gerenciamento de Energia

| Componente | Fabricante | Função | Falha típica |
|---|---|---|---|
| PMIC (PM8550) | Qualcomm | Gerência de energia do sistema | Não inicialização, superaquecimento |
| Sub-PMIC Samsung | Samsung | Gerência auxiliar de energia | Falha seletiva por subsistema |
| Charging IC (SMB1398) | Qualcomm | Negociação AFC/SFC/PPS, controle de carga | Não carregamento via cabo, sem fast charge |
| Wireless Charging RX | IDT/Integrated Device Tech | Recepção de energia wireless (Qi2) | Sem carregamento wireless |
| Battery Protection IC | Texas Instruments / Maxim | Proteção contra sobrecarga/curto | Falha de segurança na carga |

### 4.2 Módulo Conector USB-C

| Part Number Original (S24 Ultra) | Descrição |
|---|---|
| GH98-49961A (ou variante regional) | Módulo conector USB-C Samsung Galaxy S24 Ultra |

**Nota:** O part number exato varia por SKU regional e revisão de hardware. Em contexto pericial, o part number instalado deve ser comparado com o part number official Samsung para o modelo específico.

---

## 5. Tabela de Valores de Mercado — Samsung Galaxy S24 Ultra (Referência)

*Valores de referência para São Paulo/SP — maio de 2026 (pesquisa em varejistas e plataformas de revenda)*

| Modelo | Capacidade | Novo (R$) | Usado bom estado (R$) | Usado c/ defeito (R$) |
|---|---|---|---|---|
| Galaxy S24 Ultra | 256 GB | 7.999 | 5.500 – 6.500 | 500 – 1.200 |
| Galaxy S24 Ultra | 512 GB | 8.999 | 6.000 – 7.000 | 600 – 1.400 |
| Galaxy S24 Ultra | 1 TB | 9.999 | 7.000 – 8.000 | 700 – 1.600 |
| Galaxy S24+ | 256 GB | 5.999 | 4.000 – 4.800 | 400 – 900 |
| Galaxy S24 | 128 GB | 3.999 | 2.800 – 3.400 | 300 – 700 |
| Galaxy S23 Ultra | 256 GB | 5.499 | 3.500 – 4.200 | 350 – 800 |

*Nota: Valores meramente indicativos para fins periciais. O perito deve pesquisar os valores atuais na data do laudo, citando as fontes (Samsung Store, OLX, Mercado Livre, Magazine Luiza).*

---

## 6. Procedimento de Verificação de IMEI Samsung

### 6.1 Verificação via discagem
```
*#06# → Exibe os IMEIs na tela do dispositivo
```

### 6.2 Verificação via ADB
```bash
adb shell getprop ril.serialnumber   # IMEI 1
adb shell getprop ril.imei           # IMEI alternativo (alguns modelos)
```

### 6.3 Verificação no portal CEMIR/ANATEL
- URL: consultaaparelhoimpedido.com.br (ABR Telecom / CEMIR)
- Verificar se IMEI está ativo, bloqueado (furto/roubo) ou impedido

### 6.4 Algoritmo de validação do IMEI (Luhn)
- IMEI: 15 dígitos
- Os primeiros 8 dígitos formam o TAC (Type Allocation Code) = identifica fabricante e modelo
- Dígito verificador (15º): calculado pelo algoritmo Luhn (mod 10)
- TAC Samsung: começa com 35xxxx (exemplo: 352XXX para modelos Galaxy S)
