export interface QuesitoPD {
  texto: string;
  resposta: string;
}

export interface RepairItemPD {
  descricao: string;
  custo: string;
}

export interface PericiaData {
  // Processo
  numeroProcesso: string;
  vara: string;
  tipoVara: string;
  comarca: string;
  estadoComarca: string;
  tipoAcao: string;
  dataDespacho: string;
  // Partes
  nomeAutor: string;
  cpfAutor: string;
  advogadoAutor: string;
  oabAutorUf: string;
  oabAutorNum: string;
  nomeReu: string;
  tipoDocReu: string;
  documentoReu: string;
  advogadoReu: string;
  oabReuUf: string;
  oabReuNum: string;
  // Assistentes técnicos (opcionais)
  nomeAtAutor: string;
  creaAtAutor: string;
  nomeAtReu: string;
  creaAtReu: string;
  // Perito
  nomePerito: string;
  cpfPerito: string;
  creaUf: string;
  creaNum: string;
  modalidadeCrea: string;
  especializacao: string;
  certificacaoApple: string;
  posGrad: string;
  emailPerito: string;
  enderecoPerito: string;
  // Dispositivo
  modeloIphone: string;
  numeroModelo: string;
  imei1: string;
  imei2: string;
  numeroSerie: string;
  capacidade: string;
  corDispositivo: string;
  certificacaoAnatel: string;
  statusGarantia: string;
  dataGarantia: string;
  // Histórico
  dataCompra: string;
  valorCompra: string;
  localCompra: string;
  dataDefeito: string;
  sintomasRelatados: string;
  descricaoIntervencoes: string;
  versaoReu: string;
  // Exame
  dataExame: string;
  localExame: string;
  horaInicio: string;
  horaFim: string;
  // Visual
  estadoTela: string;
  estadoCarcaca: string;
  estadoUsbC: string;
  lci1Estado: string;
  lci2Estado: string;
  analiseLci: string;
  aberturaPrevia: boolean;
  descricaoAberturaPrevia: string;
  // Software
  reconhecimentoNormal: string;
  reconhecimentoDfu: string;
  versaoIos: string;
  descricaoSoftware: string;
  // Elétrico
  cargaApple20wTensao: string;
  cargaApple20wCorrente: string;
  cargaApple20wPotencia: string;
  cargaApple20wResultado: string;
  cargaApple30wTensao: string;
  cargaApple30wCorrente: string;
  cargaApple30wPotencia: string;
  cargaApple30wResultado: string;
  cargaMagsafeResultado: string;
  termografia: string;
  resistenciaVbus: string;
  resistenciaCc1: string;
  resistenciaCc2: string;
  // Intervenções
  intervencaoAnterior: boolean;
  descricaoIntervencoesExternas: string;
  historicoGsx: string;
  // Discussão
  categoriaDefeito: string;
  hipotesePrincipal: string;
  probabilidade1: string;
  hipoteseAlternativa: string;
  probabilidade2: string;
  reparavel: boolean;
  reparos: RepairItemPD[];
  // Quesitos
  quesitosAutor: QuesitoPD[];
  quesitosReu: QuesitoPD[];
  quesitosJuizo: QuesitoPD[];
  // Conclusões
  conclusao1: string;
  conclusao2: string;
  conclusao3: string;
  conclusao4: string;
  conclusao5: string;
  // Honorários
  honorariosValor: string;
  honorariosData: string;
  honorariosResponsavel: string;
  honorariosRecebido: boolean;
  // Encerramento
  cidade: string;
  dataLaudo: string;
  numeroLaudo: string;
  anoLaudo: string;
}

function lciInterpretacao(estado: string): string {
  return estado === "ATIVADO"
    ? "Indica contato anterior com líquido"
    : "Sem indício de contato com líquido";
}

function categoriaTexto(cat: string): string {
  const map: Record<string, string> = {
    A: "Categoria A — Vício de Fabricação (CDC, Art. 12)",
    B: "Categoria B — Vício por Inadequação ao Uso Normal (CDC, Art. 18)",
    C: "Categoria C — Dano por Fato do Produto (CDC, Art. 12)",
    D: "Categoria D — Dano por Uso Inadequado / Caso Fortuito",
    E: "Categoria E — Dano por Intervenção de Terceiro (CDC, Art. 12, §3º, II)",
  };
  return map[cat] ?? cat;
}

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALGARISMOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export function generateLaudo(d: PericiaData): string {
  const atAutorLine = d.nomeAtAutor
    ? `**1.3** O Assistente Técnico indicado pelo Autor é: ${d.nomeAtAutor}, CREA nº ${d.creaAtAutor || "—"}.`
    : "**1.3** O Autor não indicou Assistente Técnico.";
  const atReuLine = d.nomeAtReu
    ? `**1.4** O Assistente Técnico indicado pelo Réu é: ${d.nomeAtReu}, CREA nº ${d.creaAtReu || "—"}.`
    : "**1.4** O Réu não indicou Assistente Técnico.";

  const garantiaStatus =
    d.statusGarantia === "VIGENTE"
      ? `VIGENTE até ${d.dataGarantia}`
      : `EXPIRADA em ${d.dataGarantia}`;

  const lci1Label = d.lci1Estado === "ATIVADO" ? "ATIVADO" : "NÃO ATIVADO";
  const lci2Label = d.lci2Estado === "ATIVADO" ? "ATIVADO" : "NÃO ATIVADO";

  const qAutorBloco = d.quesitosAutor.length
    ? d.quesitosAutor
        .map((q, i) => `**QUESITO ${i + 1}:** "${q.texto}"\n\n**RESPOSTA:** ${q.resposta}`)
        .join("\n\n---\n\n")
    : "*Não foram formulados quesitos pelo Autor.*";

  const qReuBloco = d.quesitosReu.length
    ? d.quesitosReu
        .map((q, i) => `**QUESITO ${LETRAS[i] ?? String(i + 1)}:** "${q.texto}"\n\n**RESPOSTA:** ${q.resposta}`)
        .join("\n\n---\n\n")
    : "*Não foram formulados quesitos pelo Réu.*";

  const qJuizoBloco = d.quesitosJuizo.length
    ? d.quesitosJuizo
        .map((q, i) => `**QUESITO ${ALGARISMOS[i] ?? String(i + 1)}:** "${q.texto}"\n\n**RESPOSTA:** ${q.resposta}`)
        .join("\n\n---\n\n")
    : "*Não foram formulados quesitos pelo Juízo.*";

  const conclusoes = [d.conclusao1, d.conclusao2, d.conclusao3, d.conclusao4, d.conclusao5]
    .filter(Boolean)
    .map((c, i) => `${i + 1}. ${c}`)
    .join("\n");

  const hipAlt = d.hipoteseAlternativa
    ? `\n\n**7.3 Hipótese 2 (probabilidade: ${d.probabilidade2}):**\n\n${d.hipoteseAlternativa}`
    : "";

  let reparosBloco = "";
  if (d.reparavel && d.reparos.length) {
    const linhas = d.reparos.map((r) => `| ${r.descricao} | R$ ${r.custo} |`).join("\n");
    reparosBloco = `\n\n| Reparo Necessário | Custo Estimado (mercado AASP) |\n|---|---|\n${linhas}`;
  }

  const aberturaText = d.aberturaPrevia
    ? `Foram identificadas evidências de abertura prévia: ${d.descricaoAberturaPrevia}`
    : "Não foram identificadas evidências de abertura prévia ou intervenção técnica não autorizada.";

  return `---

# LAUDO TÉCNICO PERICIAL Nº ${d.numeroLaudo}/${d.anoLaudo}

**PROCESSO Nº:** ${d.numeroProcesso}
**VARA:** ${d.vara}ª Vara ${d.tipoVara}
**COMARCA:** ${d.comarca}/${d.estadoComarca}
**OBJETO:** Perícia técnica em dispositivo ${d.modeloIphone}

---

## 1. IDENTIFICAÇÃO DO PROCESSO E DAS PARTES

**1.1** O presente Laudo Técnico Pericial é elaborado no âmbito do Processo nº ${d.numeroProcesso}, que tramita perante a ${d.vara}ª Vara ${d.tipoVara} da Comarca de ${d.comarca}, Estado de ${d.estadoComarca}, em ação de ${d.tipoAcao}.

**1.2** São partes no processo:

- **AUTOR:** ${d.nomeAutor}, CPF nº ${d.cpfAutor}, representado pelo(a) Dr(a). ${d.advogadoAutor}, OAB/${d.oabAutorUf} nº ${d.oabAutorNum}.
- **RÉU:** ${d.nomeReu}, ${d.tipoDocReu} nº ${d.documentoReu}, representado pelo(a) Dr(a). ${d.advogadoReu}, OAB/${d.oabReuUf} nº ${d.oabReuNum}.

${atAutorLine}
${atReuLine}

---

## 2. IDENTIFICAÇÃO DO PERITO

**2.1** O perito subscritor foi nomeado pelo MM. Juiz de Direito por despacho proferido em ${d.dataDespacho}, nos termos do **art. 156 do Código de Processo Civil (Lei 13.105/2015)**.

**2.2** Dados do Perito:

| Campo | Dados |
|---|---|
| Nome | ${d.nomePerito} |
| CPF | ${d.cpfPerito} |
| Registro Profissional | CREA-${d.creaUf} nº ${d.creaNum} — ${d.modalidadeCrea} |
| Especialização | ${d.especializacao} |
| Certificação Apple | ${d.certificacaoApple || "Não informada"} |
| Pós-Graduação | ${d.posGrad || "Não informada"} |
| Endereço Profissional | ${d.enderecoPerito} |
| E-mail | ${d.emailPerito} |

**2.3** O perito subscritor declara não possuir qualquer relação de interesse com as partes, encontrando-se em plenas condições de imparcialidade técnica para a realização deste exame, conforme exigido pelo **art. 466 do CPC/2015**.

---

## 3. OBJETO DA PERÍCIA

**3.1** Constitui objeto da presente perícia técnica a análise do dispositivo de telefonia móvel descrito a seguir, a fim de determinar as causas das falhas apresentadas, responsabilidades técnicas e eventuais vícios do produto ou serviço prestado.

**3.2** Identificação do dispositivo periciado:

| Campo | Dado |
|---|---|
| Marca | Apple Inc. |
| Modelo Comercial | ${d.modeloIphone} |
| Número de Modelo | ${d.numeroModelo} |
| IMEI 1 | ${d.imei1} |
| IMEI 2 | ${d.imei2 || "Não aplicável"} |
| Número de Série | ${d.numeroSerie} |
| Capacidade de Armazenamento | ${d.capacidade} |
| Cor | ${d.corDispositivo} |
| Certificação ANATEL | ${d.certificacaoAnatel} |
| Status de Garantia Apple | ${garantiaStatus} |

---

## 4. HISTÓRICO

**4.1** Conforme documentos juntados ao processo e alegações das partes, extrai-se o seguinte histórico:

**4.2** O dispositivo foi adquirido em ${d.dataCompra}, pelo valor de R$ ${d.valorCompra}, junto ao estabelecimento ${d.localCompra}, conforme nota fiscal juntada ao processo.

**4.3** O defeito foi percebido pelo usuário em ${d.dataDefeito}. Sintomas relatados: ${d.sintomasRelatados}

**4.4** ${d.descricaoIntervencoes || "Não foram identificados registros de intervenções técnicas anteriores à perícia."}

**4.5** ${d.versaoReu || "O Réu não apresentou versão dos fatos em contestação."}

---

## 5. DOCUMENTOS ANALISADOS

**5.1** Para a realização deste laudo, o perito analisou os documentos juntados aos autos do processo, incluindo nota fiscal de compra, ordens de serviço (quando disponíveis) e contestação do Réu.

---

## 6. EXAME PERICIAL

**6.1** O exame pericial foi realizado em ${d.dataExame}, nas dependências de ${d.localExame}, das ${d.horaInicio} às ${d.horaFim}, com a presença dos assistentes técnicos de ambas as partes, devidamente notificados com antecedência mínima de 5 (cinco) dias úteis, em conformidade com o **art. 466, §1º, do CPC/2015**.

**6.2** O dispositivo foi recebido mediante Termo de Entrega devidamente assinado, com registro da cadeia de custódia conforme **ABNT NBR ISO/IEC 27037:2013**.

### 6.1 Inspeção Visual Externa

**6.1.1** Procedeu-se à inspeção visual externa do dispositivo com o auxílio de microscópio estereoscópico e câmera fotográfica, com registro fotográfico sistemático, conforme Compêndio Fotográfico (Anexo C).

**6.1.2** ${d.estadoTela}

**6.1.3** A inspeção da porta USB-C revelou: ${d.estadoUsbC}

**6.1.4** Os **Indicadores de Contato com Líquido (LCI)** foram inspecionados:

| LCI | Localização | Estado Encontrado | Interpretação |
|---|---|---|---|
| LCI-1 | Bandeja do SIM | ${lci1Label} | ${lciInterpretacao(d.lci1Estado)} |
| LCI-2 | Região inferior interna | ${lci2Label} | ${lciInterpretacao(d.lci2Estado)} |

**6.1.5** ${d.analiseLci || "O estado dos indicadores de contato com líquido foi registrado conforme tabela acima."}

**6.1.6** ${aberturaText}

### 6.2 Diagnóstico por Software

**6.2.1** Equipamentos utilizados: MacBook com Apple Configurator 2, cabo USB-C certificado MFi. ${d.versaoIos ? `iOS/firmware detectado: ${d.versaoIos}.` : ""}

**6.2.2** **Modo Normal:** ${d.reconhecimentoNormal || "Não testado."}

**6.2.3** **Modo Recovery / DFU:** ${d.reconhecimentoDfu || "Não testado."}

**6.2.4** ${d.descricaoSoftware || "O diagnóstico por software foi concluído conforme os resultados acima."}

### 6.3 Diagnóstico Elétrico

**6.3.1** Os testes elétricos foram realizados com equipamentos devidamente calibrados, incluindo USB Power Delivery Tester (FNIRSI C1 ou similar), multímetro Fluke 87V e câmera termográfica FLIR.

**6.3.2** **Teste de Carga via Cabo USB-C:**

| Carregador Utilizado | Cabo | Tensão Medida (V) | Corrente Medida (A) | Potência (W) | Carregamento |
|---|---|---|---|---|---|
| Apple 20W (USB-C) | Apple MFi | ${d.cargaApple20wTensao || "—"} | ${d.cargaApple20wCorrente || "—"} | ${d.cargaApple20wPotencia || "—"} | ${d.cargaApple20wResultado || "—"} |
| Apple 30W (USB-C) | Apple MFi | ${d.cargaApple30wTensao || "—"} | ${d.cargaApple30wCorrente || "—"} | ${d.cargaApple30wPotencia || "—"} | ${d.cargaApple30wResultado || "—"} |

**6.3.3** **Teste de Carga sem Fio (MagSafe):**

| Carregador | Potência Máx. | Resultado |
|---|---|---|
| MagSafe Apple (Qi2) | 25W | ${d.cargaMagsafeResultado || "Não testado"} |

**6.3.4** **Análise Termográfica:** ${d.termografia || "Não realizada."}

**6.3.5** **Medição de Resistência na Porta USB-C:**

| Ponto de Medição | Resistência Medida | Valor Esperado |
|---|---|---|
| VBUS → GND | ${d.resistenciaVbus || "—"} | > 10 kΩ |
| CC1 → GND | ${d.resistenciaCc1 || "—"} | 5 kΩ – 100 kΩ |
| CC2 → GND | ${d.resistenciaCc2 || "—"} | 5 kΩ – 100 kΩ |

### 6.4 Análise de Intervenções Anteriores

**6.4.1** ${d.descricaoIntervencoesExternas || "Não foram identificadas evidências externas de abertura ou intervenção prévia não autorizada."}

**6.4.2** Desmontagem não autorizada pelo Juízo nesta perícia.

**6.4.3** **Consulta ao histórico Apple (GSX):** ${d.historicoGsx || "Sem registros de serviço Apple."}

---

## 7. DISCUSSÃO TÉCNICA

**7.1** A análise integrada dos dados coletados permite ao perito estabelecer a seguinte cadeia causal:

**7.2 Hipótese 1 (probabilidade: ${d.probabilidade1 || "ALTA"}):**

${d.hipotesePrincipal}${hipAlt}

**7.4** O enquadramento do caso, nos termos do **Código de Defesa do Consumidor (Lei 8.078/1990)**, é:

- **${categoriaTexto(d.categoriaDefeito)}**

**7.5** O dispositivo, no estado atual, é **${d.reparavel ? "reparável" : "irreparável"}**.${reparosBloco}

---

## 8. RESPOSTA AOS QUESITOS

### 8.1 Quesitos do Autor

${qAutorBloco}

### 8.2 Quesitos do Réu

${qReuBloco}

### 8.3 Quesitos do Juízo

${qJuizoBloco}

---

## 9. CONCLUSÃO

**9.1** Com base em todo o exame técnico realizado, nas normas técnicas aplicáveis e nos dispositivos legais pertinentes, o perito subscritor conclui que:

${conclusoes || "1. [Conclusões a serem preenchidas]"}

---

## 10. HONORÁRIOS PERICIAIS

**10.1** Os honorários periciais foram arbitrados pelo MM. Juiz em R$ ${d.honorariosValor}, conforme despacho de ${d.honorariosData}, a serem pagos pela parte ${d.honorariosResponsavel}.

**10.2** O perito informa que ${d.honorariosRecebido ? "RECEBEU" : "NÃO RECEBEU"} o depósito dos honorários periciais até a data de entrega deste laudo.

---

## 11. ENCERRAMENTO

**11.1** O presente Laudo Técnico Pericial é entregue ao MM. Juízo nos prazos estabelecidos, para os fins de direito.

**11.2** O perito subscritor coloca-se à disposição do Juízo e das partes para prestar esclarecimentos adicionais, caso necessário (CPC/2015, Art. 477).

${d.cidade}, ${d.dataLaudo}.

---

**[ASSINATURA DIGITAL ICP-BRASIL]**

**${d.nomePerito}**
CREA-${d.creaUf} nº ${d.creaNum} — ${d.modalidadeCrea}
Perito Judicial Nomeado — Processo nº ${d.numeroProcesso}

*Documento assinado digitalmente com certificado ICP-Brasil e-CPF A3 ou A1. Verifique a autenticidade em: validar.iti.gov.br*

---

## ANEXOS

| Nº | Descrição |
|---|---|
| Anexo A | Nota Fiscal de Compra do Dispositivo |
| Anexo B | Ordens de Serviço de Assistência Técnica |
| Anexo C | Compêndio Fotográfico |
| Anexo D | Certificados de calibração dos equipamentos |
| Anexo E | Consulta GSX — Histórico Apple do número de série |
| Anexo F | Currículo e certificações do perito |
| Anexo G | Referências técnicas e normativas utilizadas |

---

**Normas e Legislação de Referência:**
- CPC/2015 (Lei 13.105/2015) — Arts. 156-158, 464-480
- CDC (Lei 8.078/1990) — Arts. 12, 14, 18, 26, 27, 50
- ABNT NBR ISO/IEC 17025:2017 — Requisitos gerais para competência de laboratórios de ensaio e calibração
- ABNT NBR IEC 62368-1:2023 — Equipamentos de tecnologia de áudio/vídeo, tecnologia da informação e comunicação
- ABNT NBR ISO/IEC 27037:2013 — Identificação, coleta, aquisição e preservação de evidência digital
- IEC 60529 — Graus de proteção por invólucros (Código IP)
- Resolução ANATEL nº 680/2017 — Certificação e homologação de produtos para telecomunicações
- Resolução CFT nº 1.010/2005 — Atribuições profissionais do engenheiro eletricista

*Rodapé: Laudo Técnico Pericial nº ${d.numeroLaudo}/${d.anoLaudo} — Processo nº ${d.numeroProcesso} — Perito: ${d.nomePerito}, CREA-${d.creaUf} ${d.creaNum}*
`;
}
