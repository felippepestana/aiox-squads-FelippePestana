# Referências Normativas — Perícia Judicial em Dispositivos Android/Samsung

## 1. Normas Jurídicas Brasileiras

### 1.1 Código de Processo Civil — CPC/2015 (Lei 13.105/2015)

| Artigo(s) | Tema | Relevância Pericial |
|---|---|---|
| Art. 156 | Nomeação do perito | Define obrigatoriedade de perito habilitado |
| Art. 157 | Dever do perito | Compromisso de fidelidade técnica |
| Art. 158 | Responsabilidade civil do perito | Penalidade por informação inverídica |
| Arts. 464-480 | Prova Pericial (Seção VIII) | Regras do processo pericial |
| Art. 465 | Nomeação e prazo | Prazo para entrega do laudo |
| Art. 466 | Deveres do perito | Imparcialidade, comunicação às partes |
| Art. 467 | Limites da atuação | Vedação de opiniões além do encargo |
| Art. 473 | Conteúdo do laudo | Estrutura obrigatória do laudo |
| Art. 476 | Prorrogação de prazo | Procedimento para prorrogação |
| Art. 477 | Esclarecimentos | Direito das partes de pedir esclarecimentos |
| Art. 479 | Valoração da prova | Como o juiz aprecia o laudo |

### 1.2 Código de Defesa do Consumidor — CDC (Lei 8.078/1990)

| Artigo(s) | Tema | Relevância Pericial |
|---|---|---|
| Art. 12 | Responsabilidade pelo fato do produto | Responsabilidade objetiva do fabricante |
| Art. 12, §3º, II | Excludente de responsabilidade | Defeito inexistente |
| Art. 12, §3º, III | Excludente de responsabilidade | Dano causado por terceiro (ex: assistência não autorizada) |
| Art. 14 | Responsabilidade pelo fato do serviço | Assistência técnica responde objetivamente por danos |
| Art. 18 | Vícios de qualidade | Responsabilidade solidária da cadeia |
| Art. 18, §1º | Prazo de saneamento | 30/90 dias para sanar vício |
| Art. 26, II | Decadência | 90 dias (produto durável) para reclamação |
| Art. 27 | Prescrição | 5 anos para ação de reparação |
| Art. 31 | Informação ao consumidor | Obrigação de documentação em português |
| Art. 50 | Garantia contratual | Complementar à garantia legal — aplicável ao Samsung Care+ |

### 1.3 Normas de Exercício Profissional

| Norma | Tema | Relevância |
|---|---|---|
| Lei 5.194/1966 | Regulamentação das profissões de Engenharia | Base legal do CREA |
| Resolução CFT nº 1.010/2005 | Atribuições profissionais | Define competências do Eng. Eletricista/Eletrônico |
| Resolução CFT nº 345/1990 | Tabela de honorários | Honorários periciais |
| Código de Ética CREA | Deveres éticos | Imparcialidade, competência, sigilo |

---

## 2. Normas Técnicas ABNT/NBR

### 2.1 ABNT NBR ISO/IEC 17025:2017
**Título:** Requisitos gerais para a competência de laboratórios de ensaio e calibração
**Aplicação:** Define os requisitos para que o perito demonstre competência técnica e imparcialidade.

**Seções críticas:**
- Seção 4: Requisitos estruturais (imparcialidade, confidencialidade)
- Seção 5: Requisitos de recursos (pessoal qualificado, instalações, equipamentos calibrados)
- Seção 7.2: Seleção, verificação e validação de métodos
- Seção 7.4: Manuseio de itens de ensaio (cadeia de custódia)
- Seção 7.8: Relato de resultados (estrutura do laudo/relatório)
- Seção 7.8.2: Requisitos comuns dos relatórios

**Campos obrigatórios do relatório (7.8.2):**
1. Título
2. Nome e endereço do laboratório
3. Local de realização do ensaio
4. Identificação única do relatório
5. Nome e informações de contato do cliente
6. Identificação do método usado
7. Descrição e identificação do item ensaiado
8. Data(s) de recebimento e ensaio
9. Resultados com unidades
10. Identificação de quem autorizou o relatório
11. Declaração de que os resultados se referem somente ao item ensaiado

### 2.2 ABNT NBR ISO/IEC 27037:2013
**Título:** Tecnologia da informação — Técnicas de segurança — Diretrizes para identificação, coleta, aquisição e preservação de evidência digital
**Aplicação:** Cadeia de custódia do dispositivo Samsung como evidência eletrônica. O Knox Warranty Void Flag é dado digital extraído do dispositivo e deve seguir os princípios desta norma.

**Princípios fundamentais (Seção 5):**
- **Relevância:** Só coletar evidências pertinentes ao caso
- **Confiabilidade:** Procedimentos reprodutíveis e auditáveis (ADB é reprodutível — `getprop` retorna o mesmo valor)
- **Suficiência:** Quantidade adequada de evidências
- **Auditabilidade:** Documentação de todos os passos (comandos ADB documentados)

**Cadeia de custódia (Seção 7):**
- Documentar quem teve posse do dispositivo em cada momento
- Registrar qualquer modificação de estado do dispositivo
- Assegurar que o dispositivo não foi adulterado entre a coleta e o exame

### 2.3 ABNT NBR 5410:2004
**Título:** Instalações elétricas de baixa tensão
**Aplicação:** Avaliação de conformidade dos carregadores e tomadas utilizados.

**Parâmetros relevantes:**
- Tensão nominal: 127V ou 220V (± 10%)
- Frequência: 60 Hz
- Proteção contra choque elétrico em carregadores: Classe II (isolamento duplo)
- Aplicável na avaliação de acessórios de carga Samsung (EP-T4510, EP-TA800, etc.)

### 2.4 ABNT NBR IEC 62368-1:2023
**Título:** Equipamentos de tecnologia de áudio/vídeo, informação e comunicação — Parte 1: Requisitos de segurança
**Aplicação:** Norma de segurança aplicável a smartphones Android Samsung.

**Limites relevantes:**
- Tensão de toque segura: ≤ 42,4V pico (Classe ES2)
- Temperatura de superfície tátil: ≤ 48°C (superfície metálica de longa exposição)
- Corrente de toque: ≤ 0,5 mA (rms)
- Proteção de acessórios de carga (conectores USB-C)
- Aplicável ao sistema de carga Samsung SFC+ (11V, 4,09A = 45W)

### 2.5 IEC 60529:2013
**Título:** Degrees of protection provided by enclosures (IP Code)
**Aplicação:** Verificação do grau de proteção IP68 declarado para dispositivos Samsung Galaxy.

**IP68 (Galaxy S24 Ultra — declaração Samsung):**
- 6 = Proteção total contra poeira (IP6X)
- 8 = Imersão até 2 metros por 30 minutos (IPX8 — Condições Samsung)
- *Nota: Samsung declara IP68 sob condições controladas de laboratório. Resistência diminui com desgaste, uso e abertura para reparo (que rompe a vedação).*

**Relevância pericial:** Se o LDI está ativado em dispositivo com IP68, o perito deve avaliar se o contato com líquido ocorreu dentro ou fora das especificações declaradas.

### 2.6 IEC 60068-2 (série)
**Título:** Environmental testing
**Aplicação:** Ensaios ambientais de temperatura, umidade e vibração.

| Sub-norma | Ensaio | Aplicação |
|---|---|---|
| IEC 60068-2-1 | Frio (Cold) | Funcionamento em baixas temperaturas |
| IEC 60068-2-2 | Calor seco (Dry heat) | Funcionamento em altas temperaturas |
| IEC 60068-2-78 | Calor úmido (Damp heat) | Resistência à umidade — relevante para IP68 |
| IEC 60068-2-27 | Choque mecânico | Resistência a impactos |
| IEC 60068-2-6 | Vibração | Resistência a vibrações |

---

## 3. Padrões Técnicos USB e Carregamento

### 3.1 USB Power Delivery 3.0 (USB PD 3.0)
- **Norma:** IEC 62680-1-2 / USB PD Specification Rev. 3.0
- Tensões negociadas: 5V, 9V, 15V, 20V
- Protocolo de negociação: via pinos CC1/CC2 do conector USB-C
- **Relevância:** Base do protocolo Samsung SFC (25W a 9V) e SFC+ (45W via PPS)

### 3.2 USB PD PPS (Programmable Power Supply)
- **Norma:** USB PD Specification Rev. 3.0, Appendix A
- Tensão programável: 3,3V a 21V em incrementos de 20mV
- Corrente programável: até 5A em incrementos de 50mA
- **Relevância:** Samsung SFC+ 45W utiliza PPS (11V / 4,09A)

### 3.3 Samsung AFC (Adaptive Fast Charge)
- Protocolo proprietário Samsung
- Tensão: 9V / Corrente: 1,67A = 15W
- Sinalização: via pinos D+/D− do conector USB-C (diferente do USB PD que usa CC1/CC2)
- **Nota pericial:** AFC usa caminho de sinalização diferente de SFC/SFC+ — falha em CC1/CC2 não impede AFC, mas falha em D+/D− impede AFC

### 3.4 Qi2 (Wireless Power Consortium / Qi2)
- **Norma:** Qi2 Wireless Power Specification v1.0
- Potência máxima: 15W (Qi2)
- Frequência: 127,7 kHz
- Alinhamento magnético: camada física do padrão Qi2 (Magnetic Power Profile)
- **Relevância:** Galaxy S24 Ultra suporta Qi2 15W; funciona independentemente do conector USB-C

---

## 4. Regulamentações Brasileiras Específicas

### 4.1 ANATEL — Agência Nacional de Telecomunicações
- **Resolução nº 680/2017:** Regulamento sobre equipamentos de radiocomunicação de radiação restrita
- **Certificação ANATEL obrigatória** para comercialização no Brasil (Art. 2º)
- Número de homologação: impresso na embalagem e em Configurações > Sobre o telefone
- Verificação: sistemas.anatel.gov.br/sch/
- **Aplicação:** Todos os modelos Samsung Galaxy comercializados no Brasil possuem homologação ANATEL obrigatória

### 4.2 INMETRO
- **Portaria nº 170/2012:** Regulamento técnico para adaptadores de CA para equipamentos de TI
- Aplicável aos carregadores Samsung (EP-T4510, EP-TA800, EP-TA300) fornecidos com os dispositivos
- Certificação INMETRO identificada pelo selo no corpo do carregador

### 4.3 CEMIR/ABR Telecom
- Sistema de controle de IMEI para dispositivos roubados/furtados no Brasil
- Verificação: consultaaparelhoimpedido.com.br
- Um IMEI impedido não pode registrar-se em redes brasileiras

---

## 5. Normas para Exercício da Perícia

### 5.1 Habilitação do Perito
Conforme **CPC/2015, Art. 156, §1º** e **Resolução CFT nº 1.010/2005**:

| Requisito | Norma | Exigência |
|---|---|---|
| Formação | CPC Art. 156 §1º | Nível universitário |
| Registro | Lei 5.194/1966 | CREA ativo |
| Especialidade | Res. CFT 1.010/2005 | Eng. Eletricista/Eletrônico ou Tecnólogo |
| Habilitação judicial | CPC Art. 156 §2º | Experiência comprovada |
| Cadastro TJ | Res. TJ estadual | Cadastro no tribunal de atuação |

### 5.2 Certificações Técnicas Recomendadas para Perícia Android/Samsung

| Certificação | Emissor | Descrição |
|---|---|---|
| Samsung SAST | Samsung | Samsung Authorized Service Technician |
| ADB Proficiency | Android Open Source Project | Proficiência documentada em Android Debug Bridge |
| Pós-Graduação Perícia Judicial | Diversas instituições | Formação específica em perícia forense |

*Nota: As certificações técnicas são recomendadas para demonstrar expertise específica, mas não substituem o registro profissional no CREA, que é o requisito legal para emissão de laudo técnico pericial.*

### 5.3 Referências Samsung Específicas para Peritagem

| Recurso | URL | Uso |
|---|---|---|
| Samsung Service Center localizador | samsung.com/br/support/service-center | Verificar se assistência é SSC autorizado |
| Samsung Warranty Check | samsung.com/br/support/warranty | Verificar garantia por número de série |
| Samsung Members App | Play Store | Diagnóstico remoto de hardware |
| Smart Switch | samsung.com/global/smartswitch | Backup e identificação do dispositivo |
| ANATEL SCH | sistemas.anatel.gov.br/sch/ | Verificar certificação ANATEL do modelo |
| CEMIR IMEI | consultaaparelhoimpedido.com.br | Verificar bloqueio por furto/roubo |
