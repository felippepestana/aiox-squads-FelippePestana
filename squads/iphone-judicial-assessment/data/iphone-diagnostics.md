# iPhone Diagnostics — Dados Técnicos de Referência

## 1. iPhone 16 Pro Max — Especificações Técnicas Periciais

### 1.1 Identificação do Produto

| Campo | Valor |
|---|---|
| Nome Comercial | iPhone 16 Pro Max |
| Números de Modelo (Brasil) | A3293 (nano-SIM + eSIM) |
| SKU Brasil | MYYY3BZ/A (256GB) / MYYZ3BZ/A (512GB) / MYZ03BZ/A (1TB) |
| SoC | Apple A18 Pro (3nm TSMC N3E) |
| RAM | 8 GB LPDDR5X |
| Lançamento | Setembro 2024 |
| Descontinuado | — (ativo em 2026) |
| Certificação ANATEL | 02648-25-XXXXX |
| Certificação IP | IP68 (IEC 60529) — até 6m por 30 minutos |

### 1.2 Sistema de Carregamento

| Parâmetro | Valor |
|---|---|
| Conector | USB-C (USB 3.2 Gen 2 — 10 Gbps) |
| Protocolo de carga | USB Power Delivery 3.0 (USB PD) |
| Potência máxima via cabo | 27W (com adaptador 30W ou superior MFi/USB PD) |
| Tensão de carga | 9V / 3A (PD) ou 5V / 3A (padrão) |
| Carga sem fio | MagSafe 25W (Qi2), Qi 1.4 (15W) |
| Carga reversa sem fio | Sim (para Apple Watch / AirPods) |
| Conector interno (cabo FPC) | 24 pinos USB-C + trilhas adicionais de áudio/diagnóstico |

### 1.3 Bateria

| Parâmetro | Valor |
|---|---|
| Capacidade | 4.685 mAh |
| Tensão nominal | 3,88V |
| Tensão de corte (mínima) | 3,0V |
| Tensão máxima de carga | 4,45V |
| Ciclos de vida estimados | ≥ 500 ciclos para ≥ 80% de capacidade |
| Part Number (original) | A3254 |
| Fabricante | Apple / Fornecedor homologado |

### 1.4 Circuitos de Gerenciamento de Energia

| Componente | Função | Falha típica |
|---|---|---|
| PMIC (Apple PMZ) | Gerência de energia de todo o sistema | Não inicialização, superaquecimento, curto em VBUS |
| Tigris IC (Charging IC) | Negociação USB PD, controle de carga da bateria | Não carregamento via cabo, carga lenta |
| Capacitor C1202 (100nF/10V) | Filtro de VBUS / desacoplamento do PMIC | Curto-circuito em VBUS se ausente/danificado |
| Bobina L1001 | Filtro EMI do VBUS | Circuito aberto = sem carga |
| Transistor Q1001 (MOSFET) | Chave de proteção de carga | Curto = sempre conduzindo; Aberto = sem carga |

### 1.5 Indicadores de Contato com Líquido (LCI)

| LCI | Localização | Cor Normal | Cor Ativada |
|---|---|---|---|
| LCI-1 | Bandeja do chip SIM | Branco/Prata | Vermelho/Rosa |
| LCI-2 | Área inferior interna (visível ao abrir) | Branco/Prata | Vermelho/Rosa |

**Nota:** LCI ativado não significa automaticamente perda de garantia. A Apple avalia caso a caso. LCI ativado apenas indica que houve contato com líquido em algum momento, não necessariamente por uso inadequado.

---

## 2. Diagnóstico Diferencial — Falhas de Carregamento

### Cenário A: Não carrega via cabo, carrega via MagSafe

| Hipótese | Probabilidade | Diagnóstico Confirmatório |
|---|---|---|
| Tigris IC com falha parcial | ALTA | Resistência CC1/CC2 anormal; não reconhece carregador USB PD |
| Pinos do conector USB-C oxidados | MODERADA | Microscópio: corrosão visível; limpeza restaura parcialmente |
| Cabo FPC do conector danificado | MODERADA | Continuidade interrompida em trilhas de sinal |
| Detritos obstruindo pinos VBUS | BAIXA | Limpeza com ar comprimido restaura totalmente |
| Software (bug iOS) | BAIXA | Restauração via DFU resolve |

### Cenário B: Não carrega via cabo NEM via MagSafe

| Hipótese | Probabilidade | Diagnóstico Confirmatório |
|---|---|---|
| PMIC com falha total | ALTA | Resistência VBUS-GND < 1Ω; sem corrente em nenhuma fonte |
| Curto-circuito na placa-lógica | ALTA | Resistência VBUS-GND próxima de zero |
| Bateria completamente descarregada/danificada | MODERADA | Medir tensão da bateria diretamente (< 2,5V = célula morta) |
| Dano por líquido ao PMIC | MODERADA | LCI ativados + corrosão na placa-lógica |
| Dano por intervenção (componente ausente/danificado) | ALTA | Inspeção visual interna sob microscópio |

### Cenário C: Dispositivo não inicializa (tela totalmente inativa)

| Hipótese | Probabilidade | Diagnóstico Confirmatório |
|---|---|---|
| Curto-circuito em VBUS (impede inicialização) | MUITO ALTA | Resistência VBUS-GND < 1Ω |
| Falha no SoC (Apple A18 Pro) | BAIXA | Exclusão de todas as outras causas |
| Falha no NAND Flash | BAIXA | DFU reconhece dispositivo mas não restaura |
| Conector FPC tela desconectado | MODERADA | Verificado na abertura |
| Bateria desconectada/morta | MODERADA | Verificado na abertura + medição direta |

---

## 3. Procedimento de Verificação do IMEI e Número de Série

### 3.1 Verificação via Apple

URL oficial (não inserir aqui — verificar manualmente):
- Acessar `checkcoverage.apple.com` com o número de série
- Retorna: modelo, garantia, status de reparo, elegibilidade para serviço

### 3.2 Decodificação do Número de Série Apple (12 caracteres)

Formato: `CCYWWPPPPPP`
- CC: Código do fabricante/local
- Y: Ano de fabricação (1 char)
- WW: Semana de fabricação (2 chars)
- PPPPPP: Número único do produto

Exemplo: `XYZ1234ABCD`
- Fabricado em 2024, semana 34 (aproximadamente agosto/setembro 2024)
- Compatível com lote de lançamento do iPhone 16 Pro Max

### 3.3 Verificação de IMEI

- IMEI = International Mobile Equipment Identity (15 dígitos)
- Algoritmo de validação: Luhn (mod 10)
- Verificação de bloqueio/furto: checkmend.com, imei.info (serviços externos)
- **No Brasil:** consulta de IMEI bloqueado via portal oficial https://www.consultaaparelhoimpedido.com.br/ (CEMIR/ABR Telecom)

---

## 4. Ferramentas e Equipamentos para Diagnóstico Pericial

### 4.1 Ferramentas de Hardware

| Ferramenta | Uso | Norma de Referência |
|---|---|---|
| Chave Pentalobe P2 (0,8mm) | Remoção parafusos externos iPhone | Apple ASF |
| Chave Tri-point Y000 (0,6mm) | Parafusos internos bateria/placa | Apple ASF |
| Chave Phillips PH000 | Parafusos internos variados | Apple ASF |
| Espátula náilon/plástico ESD | Abertura sem danos | IEC 61340-5-1 |
| Ventosa com alça | Remoção da tela | Apple ASF |
| Pulseira antiestática ESD | Proteção de componentes | IEC 61340-5-1 |
| ESD Mat (tapete antiestático) | Proteção da área de trabalho | IEC 61340-5-1 |

### 4.2 Instrumentos de Medição

| Instrumento | Especificação Mínima | Uso |
|---|---|---|
| Multímetro digital | 4,5 dígitos, CAT III, IEC 61557 | Tensão, corrente, resistência |
| USB PD Tester | Suporte USB PD 3.0, 100W | Monitoramento de carga |
| Osciloscópio | ≥ 100 MHz, 2 canais | Análise de sinais digitais |
| Câmera termográfica | NETD ≤ 50mK, resolução ≥ 160x120 | Detecção de pontos quentes |
| LCR Meter | Precisão 0,1%, frequência 100Hz-1MHz | Medição de componentes SMD |
| Microscópio estereoscópico | 10x a 200x, iluminação LED | Inspeção de PCB e componentes |

### 4.3 Software de Diagnóstico

| Software | Plataforma | Uso |
|---|---|---|
| Apple Configurator 2 | macOS | Modo DFU/Recovery, backup, diagnóstico |
| Apple Devices | Windows | Diagnóstico básico e restauração |
| iMazing | macOS/Windows | Diagnóstico de bateria, backup |
| Apple Diagnostics (ASD) | macOS/interno | Diagnóstico de hardware Apple (AASP) |

---

## 5. Tabela de Valores de Mercado — iPhone (Referência)

*Valores de referência para São Paulo/SP — maio de 2026 (pesquisa em varejistas e plataformas de revenda)*

| Modelo | Capacidade | Novo (R$) | Usado bom estado (R$) | Usado c/ defeito (R$) |
|---|---|---|---|---|
| iPhone 16 Pro Max | 256 GB | 12.999 | 8.000 – 9.500 | 800 – 1.500 |
| iPhone 16 Pro Max | 512 GB | 14.499 | 9.000 – 10.500 | 900 – 1.800 |
| iPhone 16 Pro Max | 1 TB | 16.499 | 10.500 – 12.000 | 1.000 – 2.000 |
| iPhone 16 Pro | 256 GB | 11.499 | 7.000 – 8.500 | 700 – 1.200 |
| iPhone 16 | 128 GB | 7.999 | 5.500 – 6.500 | 500 – 900 |

*Nota: Valores meramente indicativos para fins periciais. O perito deve pesquisar os valores atuais na data do laudo, citando as fontes (OLX, Mercado Livre, Magazine Luiza, Apple Store).*
