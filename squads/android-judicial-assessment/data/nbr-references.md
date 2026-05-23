# Normas Técnicas — Referências para Perícia em Dispositivos Android/Samsung

## 1. Normas ABNT/NBR Aplicáveis

### ABNT NBR ISO/IEC 17025:2017
**Requisitos gerais para a competência de laboratórios de ensaio e calibração**

- **Escopo:** Define os requisitos de competência, imparcialidade e operação consistente dos laboratórios
- **Seções relevantes:**
  - Seção 4: Requisitos estruturais (imparcialidade, confidencialidade)
  - Seção 5: Requisitos de recursos (pessoal, instalações, equipamentos)
  - Seção 6: Requisitos de processo (análise de contratos, seleção de métodos)
  - Seção 7.8: Relatório de resultados (estrutura obrigatória do laudo)
- **Aplicação pericial:** O laudo técnico pericial deve seguir a estrutura da Seção 7.8; o perito deve demonstrar competência técnica na área

### ABNT NBR ISO/IEC 27037:2013
**Tecnologia da informação — Técnicas de segurança — Diretrizes para identificação, coleta, aquisição e preservação de evidência digital**

- **Princípios:** Relevância, confiabilidade, suficiência
- **Cadeia de custódia da evidência digital:** Como preservar o estado do dispositivo
- **Aplicação pericial:** Preservação do dispositivo como evidência; ADB sem modificar o estado do dispositivo; documentação de cada procedimento

### ABNT NBR 5410:2004
**Instalações elétricas de baixa tensão**

- **Relevância:** Avaliação de carregadores, tomadas e instalações utilizadas pelo consumidor
- **Aplicação pericial:** Se houver alegação de dano causado por surto elétrico ou instalação inadequada

### ABNT NBR IEC 62368-1:2023
**Audio/video, information and communication technology equipment — Safety requirements**

- **Escopo:** Requisitos de segurança para equipamentos de TIC, incluindo smartphones e carregadores
- **Limites relevantes:**
  - Temperatura superficial máxima em pontos acessíveis: 48°C (Class 2)
  - Limites de tensão e corrente em conectores USB
- **Aplicação pericial:** Avaliação de conformidade do produto Samsung e carregadores

---

## 2. Normas IEC Internacionais

### IEC 60529:2013
**Degrees of protection provided by enclosures (IP Code)**

- **Classificações relevantes para Samsung:**
  - IP67: Submersão até 1m por 30 minutos
  - IP68: Submersão até 2m por 30 minutos (Galaxy S24 Ultra)
- **Aplicação pericial:** Análise de LDI ativado vs. grau de proteção do produto; o fabricante deve demonstrar que a submersão ocorreu além dos limites IP declarados

### IEC 60068-2 (série)
**Environmental testing**

- IEC 60068-2-1: Testes de frio
- IEC 60068-2-2: Testes de calor seco
- IEC 60068-2-78: Testes de calor úmido
- **Aplicação pericial:** Avaliação de condições de uso e armazenamento que possam ter causado danos

### USB Power Delivery 3.0 (USB IF)
**USB PD 3.0 Specification + PPS (Programmable Power Supply)**

- **Samsung AFC (Adaptive Fast Charge):** Protocolo proprietário Samsung — 9V/1,67A = 15W
- **Samsung Super Fast Charging 2.0:** PPS — tensão programável, até 45W
- **Compatibilidade:** Carregadores USB PD 3.0 com PPS são compatíveis com Samsung Super Fast Charging 2.0
- **Aplicação pericial:** Diagnóstico de falha na negociação AFC — dispositivo permanece em 5V/2A

### Samsung Knox Security Architecture v3.x
**Especificação proprietária Samsung**

- **Knox Warranty Void Flag (e-FUSE):** Gravado permanentemente no chip Secure Enclave
- **Valores:** 0x0 (normal/íntegro) / 0x1 (triggered/acionado)
- **Irreversibilidade:** Por design de hardware, não pode ser revertido por software
- **Aplicação pericial:** Documentação do estado Knox; análise de nexo causal com o defeito

### MIL-STD-810H
**Environmental Engineering Considerations and Laboratory Tests (USA — DoD)**

- Samsung adota voluntariamente para certificação de resistência mecânica
- **Aplicação pericial:** Avaliação de resistência a impactos em casos de queda

---

## 3. Legislação e Regulamentos Brasileiros

### Lei 13.105/2015 — CPC/2015
**Código de Processo Civil**

- Arts. 156-158: Perito e seus deveres
- Arts. 464-480: Prova pericial

### Lei 8.078/1990 — CDC
**Código de Defesa do Consumidor**

- Art. 12: Responsabilidade do fabricante (objetiva)
- Art. 12, §3º: Excludentes de responsabilidade do fabricante
- Art. 18: Vícios de qualidade em produtos duráveis
- Art. 26, II: Prazo decadencial de 90 dias (produtos duráveis)
- Art. 27: Prazo prescricional de 5 anos (danos pelo produto)
- Art. 50: Garantia contratual complementar à legal

### Resolução ANATEL nº 680/2017
**Regulamento de Avaliação da Conformidade e de Homologação de Produtos para Telecomunicações**

- Obrigatoriedade de homologação para aparelhos comercializados no Brasil
- Consulta em: sistemas.anatel.gov.br/sch
- **Aplicação pericial:** Verificar se o modelo Samsung tem número de homologação ANATEL válido

### Resolução CFT nº 1.010/2005
**Atribuições profissionais do engenheiro, arquiteto e agrônomo**

- Define que diagnóstico e perícia de equipamentos eletrônicos é atribuição de Engenheiro Eletricista ou Engenheiro Eletrônico
- Registro no CREA é obrigatório

---

## 4. Documentação Técnica Samsung

### Samsung Service Manual
- Disponível para técnicos Samsung Authorized Service Center
- Inclui procedimentos de desmontagem, lista de peças, torques de parafusos
- **Aplicação pericial:** Referência para verificar se o reparo anterior seguiu o procedimento correto

### Samsung Members — Diagnóstico Remoto
- Aplicativo oficial Samsung para diagnóstico do dispositivo
- Fornece: status da bateria, temperatura, status Knox, histórico de reparos
- **Aplicação pericial:** Evidência documentada do status Knox e condição do dispositivo

### Samsung Service Center (SSC)
- Rede oficial de assistência técnica Samsung no Brasil
- Localização: samsung.com/br/support/service-center
- Tabela de preços de reparos (referência para avaliação de danos materiais)
