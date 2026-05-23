# Definições Jurídicas — Perícia Judicial em Dispositivos Android/Samsung

## 1. Definições do CPC/2015

### Perícia (Art. 464)
> "A prova pericial consiste em exame, vistoria ou avaliação."

- **Exame:** Análise técnica de objetos, documentos ou situações
- **Vistoria:** Inspeção in loco de bens imóveis ou móveis
- **Avaliação:** Determinação do valor econômico de bens

**Aplicação:** A análise de dispositivo Android/Samsung é classificada como **exame**.

### Perito (Art. 156)
Profissional de nível universitário, inscrito no órgão de classe competente (CREA), nomeado pelo juiz para auxiliar na instrução probatória quando a prova do fato depender de conhecimento técnico ou científico.

**Distinção perito vs. assistente técnico:**
- **Perito:** Auxiliar da Justiça, nomeado pelo juiz, imparcial
- **Assistente técnico:** Indicado pelas partes, atua em favor de quem o indicou

### Laudo Pericial (Art. 473)
Documento técnico produzido pelo perito contendo:
1. Exposição do objeto da perícia
2. Análise técnica ou científica realizada
3. Indicação do método utilizado
4. Resposta conclusiva a todos os quesitos apresentados pelo juiz, pelas partes e pelos assistentes técnicos

### Quesitos (Art. 465, §1º, III)
Perguntas técnicas formuladas pelo juiz e pelas partes ao perito, que devem ser respondidas no laudo. As partes têm prazo mínimo de 15 dias após a nomeação do perito para indicar assistentes e formular quesitos.

---

## 2. Definições do CDC (Lei 8.078/1990)

### Produto (Art. 3º, §1º)
> "Produto é qualquer bem, móvel ou imóvel, material ou imaterial."

**Aplicação:** O Samsung Galaxy é produto de consumo durável.

### Produto Durável (Art. 26, II)
Produto que não se esgota rapidamente pelo seu uso normal.

**Aplicação:** Smartphones/celulares Samsung são produtos **duráveis**, sujeitos ao prazo decadencial de **90 dias** para vícios aparentes.

### Defeito do Produto (Art. 12, §1º)
> "O produto é defeituoso quando não oferece a segurança que dele legitimamente se espera, levando-se em consideração as circunstâncias relevantes."

### Vício do Produto (Art. 18)
> "Os fornecedores de produtos de consumo duráveis ou não duráveis respondem solidariamente pelos vícios de qualidade ou quantidade que os tornem impróprios ou inadequados ao consumo a que se destinam ou lhes diminuam o valor."

**Distinção crítica:**

| Critério | Defeito (Art. 12) | Vício (Art. 18) |
|---|---|---|
| Natureza | Compromete a segurança | Compromete a adequação ao uso |
| Causa da ação | Reparação de dano | Substituição/reparo/devolução |
| Responsabilidade | Fabricante/importador | Cadeia solidária |
| Prazo | 5 anos (prescricional) | 90 dias (decadência) |

### Vício Oculto (Art. 26, §3º)
Vício que não era aparente ao momento da aquisição, mas se manifesta posteriormente.

**Aplicação Android/Samsung:** Falha em Charging IC, PMIC ou FPC não visível externamente = vício oculto. O prazo decadencial começa a contar do momento em que o vício se torna evidente.

### Fornecedor (Art. 3º)
**Aplicação em casos Samsung:**
- **Fabricante:** Samsung Electronics Co., Ltd. (Coreia do Sul)
- **Importador:** Samsung Brasil Comércio de Produtos Eletrônicos Ltda. (responsável solidária no Brasil)
- **Vendedor:** Loja que comercializou o produto (Samsung Store, varejistas)
- **Assistência Técnica:** Samsung Service Center (SSC) ou assistência não autorizada

### Excludentes de Responsabilidade do Fabricante (Art. 12, §3º)
O fabricante só não será responsabilizado quando provar:
- I — que não colocou o produto no mercado
- **II — que, embora haja colocado o produto no mercado, o defeito inexiste**
- **III — a culpa exclusiva do consumidor ou de terceiro**

**Aplicação Knox:** A Samsung pode invocar o inciso III quando o Knox=0x1 resulta de intervenção de terceiro não autorizado. **Porém, a prova da excludente cabe à Samsung, não ao consumidor.**

---

## 3. Definições Técnico-Jurídicas Específicas Samsung/Android

### Knox Warranty Void Flag — Definição e Natureza Jurídica

**Definição técnica:** Fusível eletrônico permanente (e-FUSE) integrado ao chip de segurança do dispositivo Samsung. Registra o estado do bootloader:
- **0x0** = Bootloader nunca desbloqueado (garantia Samsung intacta)
- **0x1** = Bootloader foi desbloqueado em algum momento (Knox acionado)

**Natureza jurídica:**
1. **Evidência técnica objetiva:** O Knox Flag é verificável via ADB e não pode ser adulterado ou falsificado.
2. **Irreversibilidade:** Não pode ser revertido de 0x1 para 0x0 por nenhum meio de software ou serviço.
3. **Valor probatório:** Comprova que houve desbloqueio de bootloader, mas NÃO comprova:
   - Quem realizou o desbloqueio
   - Quando ocorreu o desbloqueio
   - Se o desbloqueio causou o defeito em análise

**Impacto na garantia:**
- **Garantia contratual Samsung (12 meses):** A Samsung afirma que Knox=0x1 revoga a garantia contratual. Esta prática é contestável juridicamente se o defeito não tem nexo com o desbloqueio.
- **Garantia legal CDC (90 dias):** NÃO pode ser afastada por cláusula contratual, independentemente do Knox.

**Principio do nexo causal obrigatório:**
> A Samsung somente pode se eximir de responsabilidade se demonstrar que o defeito **foi causado** pelo desbloqueio do bootloader — não basta o mero acionamento do Knox.

### Alteração Técnica Não Autorizada — Definição para fins periciais Android/Samsung

Qualquer modificação do dispositivo realizada sem seguir os procedimentos oficiais Samsung, incluindo:
1. **Via firmware:** Flash de ROM customizada, rooting, desbloqueio de bootloader
2. **Via hardware:** Substituição de componentes por peças não originais, reparo sem ferramental adequado (ex: usar chave de fenda em parafuso T4 Torx)
3. **Via software:** Modificação de system apps, Magisk, superusuário

**Implicações:**
- Via firmware: aciona o Knox e-FUSE (0x1) de forma permanente
- Via hardware: não aciona o Knox, mas pode ser identificada por inspeção física
- Ambas podem configurar a excludente do CDC Art. 12, §3º, III se causaram o defeito

### Samsung Service Center (SSC) — Definição

**SSC (Samsung Service Center):** Rede oficial de assistência técnica autorizada pela Samsung para realizar reparos em dispositivos Samsung, utilizando:
- Técnicos certificados como Samsung Authorized Service Technician (SAST)
- Peças originais Samsung (part numbers oficiais)
- Ferramental específico Samsung (chaves T4 Torx, gabaritos de abertura)
- Software oficial Samsung (ODIN com firmware certificado)
- Acesso ao sistema de gestão de garantia Samsung

**Distinção jurídica:** O reparo realizado por SSC autorizado não configura "intervenção de terceiro" para fins do CDC Art. 12, §3º, III, pois o SSC age como preposto do fabricante. O reparo realizado por assistência NÃO autorizada pode configurar a excludente.

### LDI (Liquid Damage Indicator) — Definição

**Definição técnica:** Indicador interno de contato com líquido. Muda de cor (branco/prata → vermelho/rosa) quando exposto a umidade ou líquido.

**Natureza jurídica do LDI ativado:**
- LDI ativado = evidência de que houve contato com líquido em algum momento
- LDI ativado NÃO implica automaticamente:
  - Que o contato foi por uso inadequado
  - Que o contato foi a causa do defeito
  - Perda automática de garantia

**Ônus da prova:** O fabricante que nega a garantia com base no LDI ativado deve provar que o defeito foi causado pelo contato com líquido (CDC Art. 12, §3º — ônus do fabricante).

### Garantia Legal vs. Garantia Contratual Samsung

| Tipo | Prazo | Base Legal | Início |
|---|---|---|---|
| Garantia Legal (CDC) | 90 dias (produto durável) | Art. 26, II | Data de entrega |
| Garantia Contratual Samsung | 12 meses | Art. 50 CDC + Contrato | Data de ativação |
| Samsung Care+ (opcional) | Até 2 anos | Contrato + Art. 50 | Data de compra |

**Princípio crítico:** A garantia **legal** de 90 dias (CDC, Art. 26, II) é direito irrenunciável do consumidor. Cláusulas contratuais que a excluam ou limitam são nulas (CDC, Art. 51, I). O Knox=0x1 ou o LDI ativado não afastam a garantia legal se o defeito é de fabricação.

### Solidariedade na Cadeia de Consumo (Art. 18)
Fabricante, importador, distribuidor e comerciante são **solidariamente responsáveis** por vícios de qualidade. O consumidor pode acionar qualquer um deles diretamente.

**Aplicação:** O consumidor pode acionar a Samsung Brasil diretamente, sem precisar acionar primeiro a loja onde comprou.

### Responsabilidade Objetiva (Art. 12)
Responsabilidade **independente de culpa** do fabricante pelos danos causados por defeitos do produto.

**Aplicação:** Para defeitos de fabricação Samsung, não é necessário provar que a Samsung "errou" — basta provar que o defeito existe e que causou dano.

---

## 4. Glossário de Termos Técnico-Jurídicos Android/Samsung

| Termo | Definição |
|---|---|
| **Cadeia de custódia** | Documentação cronológica da posse, transferência e análise de evidência (ABNT NBR ISO/IEC 27037:2013) |
| **Nexo causal** | Relação de causa e efeito entre o fato e o dano — elemento essencial para responsabilização civil |
| **In dubio pro consumatore** | Na dúvida, interpreta-se a favor do consumidor (CDC, Art. 47) |
| **Inversão do ônus da prova** | CDC, Art. 6º, VIII: o juiz pode inverter o ônus da prova em favor do consumidor |
| **Vício aparente** | Defeito verificável por inspeção normal no momento da compra |
| **Vício redibitório** | Defeito oculto que torna a coisa imprópria ao uso (CC, Arts. 441-446) |
| **LDI (Liquid Damage Indicator)** | Indicador interno de contato com líquido da Samsung; ativação indica exposição a umidade/líquido |
| **Knox Warranty Void Flag** | Fusível eletrônico permanente (e-FUSE) Samsung que registra o desbloqueio de bootloader |
| **Knox e-FUSE** | Implementação hardware do Knox Warranty Void Flag — irreversível |
| **SSC (Samsung Service Center)** | Assistência técnica autorizada pela Samsung — análogo ao AASP no ecossistema Apple |
| **ADB (Android Debug Bridge)** | Ferramenta de diagnóstico Android que permite leitura de propriedades do sistema via USB |
| **ODIN** | Ferramenta proprietária Samsung para flash de firmware (Windows) |
| **Heimdall** | Alternativa open-source ao ODIN para macOS/Linux |
| **AFC (Adaptive Fast Charge)** | Protocolo de carregamento rápido Samsung 15W (9V/1,67A) |
| **SFC (Super Fast Charge)** | Protocolo de carregamento rápido Samsung 25W (9V/2,77A) |
| **SFC+ (Super Fast Charge+)** | Protocolo de carregamento rápido Samsung 45W via PPS (11V/4,09A) |
| **IMEI** | International Mobile Equipment Identity — identificador único global de 15 dígitos |
| **ANATEL** | Agência Nacional de Telecomunicações — certifica dispositivos para venda no Brasil |
| **CEMIR** | Cadastro de Equipamentos de Comunicações Móveis Impedidos — portal de IMEI bloqueado |
| **ICP-Brasil** | Infraestrutura de Chaves Públicas Brasileira — certificação digital com validade jurídica |
| **T4 Torx** | Tipo de parafuso utilizado nos dispositivos Samsung Galaxy (shaft 0,9mm); exige chave específica |

---

## 5. Modelo de Termo de Compromisso do Perito

> *Conforme CPC/2015, Art. 466*

"Ao aceitar o encargo, o perito subscritor declara:

(a) que possui conhecimento técnico especializado na área objeto da perícia, incluindo diagnóstico de dispositivos Android Samsung, plataforma Knox Security, ferramentas ADB e protocolos de carregamento Samsung;

(b) que cumprirá o encargo com imparcialidade, objetividade e fidelidade aos fatos verificados;

(c) que não possui qualquer relação de interesse, amizade íntima ou inimizade com as partes ou seus procuradores, que possa comprometer sua imparcialidade;

(d) que apresentará o laudo dentro do prazo fixado pelo MM. Juízo;

(e) que está ciente de que, por dolo ou culpa, prestar informações inverídicas implica responsabilidade pelos prejuízos causados e inabilitação para novas perícias por 2 a 5 anos (CPC, Art. 158);

(f) que manterá sigilo sobre todos os dados e informações acessados no curso da perícia que não devam constar do laudo;

(g) que o Knox Warranty Void Flag, se verificado, será analisado com rigor técnico e sem presunções — o acionamento do Knox e-FUSE será documentado como fato técnico, sem implicar automaticamente qualquer conclusão jurídica não fundamentada no nexo causal."

---

## 6. Enquadramento de Casos Típicos Android/Samsung

### Caso 1: Falha de carregamento, Knox=0x0, LDI não ativado
- **Enquadramento:** Categoria A (vício de fabricação) ou Categoria B (vício por inadequação)
- **Responsabilidade:** Samsung Brasil (fabricante/importador)
- **Fundamento:** CDC, Art. 12 ou Art. 18

### Caso 2: Falha de carregamento, Knox=0x0, LDI ativado
- **Enquadramento:** Requer análise do nexo causal — pode ser Categoria D (uso inadequado por submersão) ou Categoria A (vício de fabricação que não tem relação com o LDI ativado)
- **Responsabilidade:** Depende do nexo — Samsung se falha independe do líquido; excluída se líquido causou a falha
- **Fundamento:** CDC, Art. 12, §3º, III

### Caso 3: Falha de carregamento, Knox=0x1 por reparo não autorizado
- **Enquadramento:** Categoria E — dano por intervenção de terceiro não autorizado
- **Responsabilidade:** Assistência técnica não autorizada (CDC, Art. 14)
- **Fundamento:** CDC, Art. 12, §3º, III + Art. 14; excludente de responsabilidade da Samsung para o dano causado pelo terceiro

### Caso 4: Falha de carregamento, Knox=0x1, sem relação técnica com o Knox
- **Enquadramento:** Categoria A (vício de fabricação) para o defeito mecânico/elétrico + Knox como fato técnico sem nexo com o defeito
- **Responsabilidade:** Samsung pela falha mecânica/elétrica (não tem nexo com Knox); Knox é fato técnico documentado mas não excludente da responsabilidade
- **Fundamento:** CDC, Art. 12 — nexo causal obrigatório para a excludente do §3º

### Caso 5: Knox=0x1 sem defeito de hardware, mas com perda de funcionalidades Knox
- **Enquadramento:** Categoria E se Knox foi acionado por assistência não autorizada; Categoria D se foi acionado pelo consumidor conscientemente
- **Dano:** Perda de acesso a funcionalidades Samsung Knox (Samsung Pay, Knox Vault, Samsung Secure Folder)
- **Responsabilidade:** Quem acionou o Knox; se assistência técnica — CDC, Art. 14
