import { useState, useEffect, useRef } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import "./pericia-styles.css";

const DRAFT_KEY = "pericia-form-draft";

const QUESITOS_PADRAO_AUTOR: QuesitoPD[] = [
  { texto: "O dispositivo periciado é original de fábrica, na configuração comercializada pelo fabricante?", resposta: "" },
  { texto: "O número de série e IMEI conferem com os documentos de compra juntados?", resposta: "" },
  { texto: "Qual o estado geral de conservação do dispositivo?", resposta: "" },
  { texto: "O dispositivo apresenta defeito(s)? Em caso afirmativo, qual(is) é(são)?", resposta: "" },
  { texto: "O defeito impede o uso normal do produto para a finalidade a que se destina?", resposta: "" },
  { texto: "Qual é a causa técnica do(s) defeito(s) identificado(s)?", resposta: "" },
  { texto: "O defeito é de origem interna (vício do produto) ou externa (uso inadequado, acidente, intervenção)?", resposta: "" },
  { texto: "O defeito é compatível com vício de fabricação (defeito intrínseco ao produto)?", resposta: "" },
  { texto: "O defeito poderia ter sido causado ou agravado por intervenção técnica inadequada?", resposta: "" },
  { texto: "Há evidências de que a assistência técnica realizou serviço de forma incorreta ou com ferramentas inadequadas?", resposta: "" },
  { texto: "A assistência técnica que atendeu o produto é autorizada pelo fabricante (Apple Authorized Service Provider)?", resposta: "" },
  { texto: "O dispositivo tem conserto? Em caso afirmativo, qual o custo estimado de reparo?", resposta: "" },
  { texto: "Qual o valor de mercado atual do dispositivo em pleno estado de funcionamento?", resposta: "" },
  { texto: "Qual o valor residual do dispositivo no estado atual (para retirada de peças)?", resposta: "" },
  { texto: "O custo de reparo é economicamente viável em comparação ao valor de mercado?", resposta: "" },
  { texto: "Há registro de serviços anteriores por assistência autorizada Apple (ASP)?", resposta: "" },
  { texto: "O período de ocorrência do defeito está dentro do prazo de garantia legal (90 dias — CDC) ou contratual?", resposta: "" },
];

const QUESITOS_PADRAO_REU: QuesitoPD[] = [
  { texto: "O dispositivo apresenta evidências de uso inadequado pelo consumidor (queda, imersão em líquido além das especificações, uso de acessórios não certificados)?", resposta: "" },
  { texto: "Os danos identificados são compatíveis com desgaste natural pelo uso?", resposta: "" },
  { texto: "Os Indicadores de Contato com Líquido (LCI) estão ativados? Em caso afirmativo, isso implica perda de garantia?", resposta: "" },
  { texto: "O serviço descrito na Ordem de Serviço foi realizado de forma tecnicamente correta?", resposta: "" },
  { texto: "Os procedimentos adotados estão em conformidade com as especificações do fabricante?", resposta: "" },
  { texto: "O serviço foi realizado por técnico com certificação adequada?", resposta: "" },
  { texto: "Os componentes utilizados no reparo são originais ou certificados pelo fabricante?", resposta: "" },
  { texto: "A falha atual do dispositivo poderia ter ocorrido independentemente do serviço prestado?", resposta: "" },
  { texto: "Há causa alternativa para o defeito que não seja a intervenção técnica realizada?", resposta: "" },
  { texto: "O defeito é classificado como 'não coberto pela garantia' pelos critérios do fabricante? Por quê?", resposta: "" },
  { texto: "O modelo iPhone periciado possui certificação ANATEL válida para comercialização no Brasil?", resposta: "" },
];

const QUESITOS_PADRAO_JUIZO: QuesitoPD[] = [
  { texto: "O defeito poderia ter sido prevenido com inspeção adequada no momento da venda?", resposta: "" },
  { texto: "O consumidor foi informado adequadamente sobre as condições e limitações da garantia?", resposta: "" },
  { texto: "Qual das hipóteses técnicas (vício de fabricação vs. dano por intervenção) tem maior suporte nas evidências encontradas?", resposta: "" },
  { texto: "O laudo do assistente técnico do autor/réu é tecnicamente correto? Em que pontos diverge das conclusões do perito?", resposta: "" },
];

interface QuesitoPD {
  texto: string;
  resposta: string;
}

interface RepairItemPD {
  descricao: string;
  custo: string;
}

interface FormData {
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
  // Assistentes técnicos
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

const YEAR = String(new Date().getFullYear());
const TODAY = new Date().toISOString().slice(0, 10);

const initialForm: FormData = {
  numeroProcesso: "",
  vara: "",
  tipoVara: "CÍVEL",
  comarca: "",
  estadoComarca: "",
  tipoAcao: "",
  dataDespacho: "",
  nomeAutor: "",
  cpfAutor: "",
  advogadoAutor: "",
  oabAutorUf: "",
  oabAutorNum: "",
  nomeReu: "",
  tipoDocReu: "CNPJ",
  documentoReu: "",
  advogadoReu: "",
  oabReuUf: "",
  oabReuNum: "",
  nomeAtAutor: "",
  creaAtAutor: "",
  nomeAtReu: "",
  creaAtReu: "",
  nomePerito: "",
  cpfPerito: "",
  creaUf: "",
  creaNum: "",
  modalidadeCrea: "Engenharia Eletrônica",
  especializacao: "",
  certificacaoApple: "",
  posGrad: "",
  emailPerito: "",
  enderecoPerito: "",
  modeloIphone: "iPhone 16 Pro Max",
  numeroModelo: "",
  imei1: "",
  imei2: "",
  numeroSerie: "",
  capacidade: "256 GB",
  corDispositivo: "",
  certificacaoAnatel: "",
  statusGarantia: "VIGENTE",
  dataGarantia: "",
  dataCompra: "",
  valorCompra: "",
  localCompra: "",
  dataDefeito: "",
  sintomasRelatados: "",
  descricaoIntervencoes: "",
  versaoReu: "",
  dataExame: TODAY,
  localExame: "",
  horaInicio: "",
  horaFim: "",
  estadoTela: "",
  estadoCarcaca: "",
  estadoUsbC: "",
  lci1Estado: "NAO_ATIVADO",
  lci2Estado: "NAO_ATIVADO",
  analiseLci: "",
  aberturaPrevia: false,
  descricaoAberturaPrevia: "",
  reconhecimentoNormal: "NÃO RECONHECIDO",
  reconhecimentoDfu: "",
  versaoIos: "",
  descricaoSoftware: "",
  cargaApple20wTensao: "",
  cargaApple20wCorrente: "",
  cargaApple20wPotencia: "",
  cargaApple20wResultado: "NÃO CARREGA",
  cargaApple30wTensao: "",
  cargaApple30wCorrente: "",
  cargaApple30wPotencia: "",
  cargaApple30wResultado: "NÃO CARREGA",
  cargaMagsafeResultado: "CARREGA",
  termografia: "",
  resistenciaVbus: "",
  resistenciaCc1: "",
  resistenciaCc2: "",
  intervencaoAnterior: false,
  descricaoIntervencoesExternas: "",
  historicoGsx: "",
  categoriaDefeito: "A",
  hipotesePrincipal: "",
  probabilidade1: "ALTA",
  hipoteseAlternativa: "",
  probabilidade2: "BAIXA",
  reparavel: true,
  reparos: [],
  quesitosAutor: [],
  quesitosReu: [],
  quesitosJuizo: [],
  conclusao1: "",
  conclusao2: "",
  conclusao3: "",
  conclusao4: "",
  conclusao5: "",
  honorariosValor: "",
  honorariosData: "",
  honorariosResponsavel: "AUTOR",
  honorariosRecebido: false,
  cidade: "",
  dataLaudo: TODAY,
  numeroLaudo: "001",
  anoLaudo: YEAR,
};

const STEP_LABELS = ["Processo", "Dispositivo", "Diagnóstico", "Quesitos", "Laudo"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="pericia-steps">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const isActive = num === current;
        const isDone = num < current;
        return (
          <div key={num} className="pericia-step-item">
            <div className={`pericia-step-dot${isActive ? " active" : isDone ? " done" : ""}`}>
              {isDone ? "✓" : num}
            </div>
            <span className={`pericia-step-label${isActive ? " active" : ""}`}>{label}</span>
            {i < STEP_LABELS.length - 1 && (
              <div className={`pericia-step-connector${isDone ? " done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

type FieldUpdater = (
  field: keyof FormData
) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;

function F({
  label,
  field,
  form,
  update,
  type = "text",
  placeholder,
  span,
  rows,
  options,
}: {
  label: string;
  field: keyof FormData;
  form: FormData;
  update: FieldUpdater;
  type?: string;
  placeholder?: string;
  span?: 2 | 3;
  rows?: number;
  options?: { value: string; label: string }[];
}) {
  const value = form[field];
  const strVal = typeof value === "boolean" ? "" : String(value ?? "");
  const cls = `pericia-field${span === 2 ? " span-2" : span === 3 ? " span-3" : ""}`;

  if (options) {
    return (
      <div className={cls}>
        <label>{label}</label>
        <select value={strVal} onChange={update(field)}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (rows) {
    return (
      <div className={cls}>
        <label>{label}</label>
        <textarea value={strVal} onChange={update(field)} rows={rows} placeholder={placeholder} />
      </div>
    );
  }

  return (
    <div className={cls}>
      <label>{label}</label>
      <input type={type} value={strVal} onChange={update(field)} placeholder={placeholder} />
    </div>
  );
}

function CheckF({
  label,
  field,
  form,
  setForm,
}: {
  label: string;
  field: keyof FormData;
  form: FormData;
  setForm: Dispatch<SetStateAction<FormData>>;
}) {
  return (
    <div className="pericia-field">
      <label>{label}</label>
      <div className="pericia-checkbox-row">
        <input
          type="checkbox"
          checked={Boolean(form[field])}
          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.checked }))}
        />
        <span>{label}</span>
      </div>
    </div>
  );
}

function Step1({ form, update, setForm }: { form: FormData; update: FieldUpdater; setForm: Dispatch<SetStateAction<FormData>> }) {
  const tipoVaraOptions = [
    { value: "CÍVEL", label: "Cível" },
    { value: "CONSUMIDOR", label: "Consumidor" },
    { value: "CRIMINAL", label: "Criminal" },
  ];
  const tipoDocOptions = [
    { value: "CPF", label: "CPF" },
    { value: "CNPJ", label: "CNPJ" },
  ];

  return (
    <>
      <div className="pericia-section">
        <p className="pericia-section-title">Processo</p>
        <div className="pericia-grid">
          <F label="Número do processo" field="numeroProcesso" form={form} update={update} placeholder="0001234-56.2025.8.26.0100" span={2} />
          <F label="Vara (número)" field="vara" form={form} update={update} placeholder="1" />
          <F label="Tipo da vara" field="tipoVara" form={form} update={update} options={tipoVaraOptions} />
          <F label="Comarca" field="comarca" form={form} update={update} placeholder="São Paulo" />
          <F label="UF" field="estadoComarca" form={form} update={update} placeholder="SP" />
          <F label="Tipo de ação" field="tipoAcao" form={form} update={update} placeholder="Indenizatória c/c Obrigação de Fazer" span={2} />
          <F label="Data do despacho de nomeação" field="dataDespacho" form={form} update={update} type="date" />
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">Autor (Consumidor)</p>
        <div className="pericia-grid">
          <F label="Nome completo" field="nomeAutor" form={form} update={update} placeholder="Maria da Silva" span={2} />
          <F label="CPF" field="cpfAutor" form={form} update={update} placeholder="000.000.000-00" />
          <F label="Advogado(a)" field="advogadoAutor" form={form} update={update} placeholder="Dr. João Souza" />
          <F label="OAB/UF" field="oabAutorUf" form={form} update={update} placeholder="SP" />
          <F label="OAB nº" field="oabAutorNum" form={form} update={update} placeholder="123456" />
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">Réu (Assistência Técnica / Fabricante)</p>
        <div className="pericia-grid">
          <F label="Nome / Razão social" field="nomeReu" form={form} update={update} placeholder="Assistência Técnica XYZ Ltda." span={2} />
          <F label="Tipo de documento" field="tipoDocReu" form={form} update={update} options={tipoDocOptions} />
          <F label="Nº do documento" field="documentoReu" form={form} update={update} placeholder="00.000.000/0001-00" />
          <F label="Advogado(a)" field="advogadoReu" form={form} update={update} placeholder="Dr. Carlos Lima" />
          <F label="OAB/UF" field="oabReuUf" form={form} update={update} placeholder="SP" />
          <F label="OAB nº" field="oabReuNum" form={form} update={update} placeholder="654321" />
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">Perito Judicial</p>
        <div className="pericia-grid">
          <F label="Nome completo" field="nomePerito" form={form} update={update} span={2} />
          <F label="CPF" field="cpfPerito" form={form} update={update} placeholder="000.000.000-00" />
          <F label="CREA — UF" field="creaUf" form={form} update={update} placeholder="SP" />
          <F label="CREA — Número" field="creaNum" form={form} update={update} placeholder="1234567890" />
          <F label="Modalidade profissional" field="modalidadeCrea" form={form} update={update} placeholder="Engenheiro Eletricista" />
          <F label="Especialização" field="especializacao" form={form} update={update} placeholder="Eletrônica e Telecomunicações" span={2} />
          <F label="Certificação Apple (ACMT/ACiT)" field="certificacaoApple" form={form} update={update} placeholder="ACMT — Apple Certified Macintosh Technician" span={2} />
          <F label="Pós-graduação" field="posGrad" form={form} update={update} placeholder="Curso — Instituição — Ano" span={2} />
          <F label="E-mail profissional" field="emailPerito" form={form} update={update} type="email" />
          <F label="Endereço profissional" field="enderecoPerito" form={form} update={update} span={2} />
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">Assistentes Técnicos (opcional)</p>
        <div className="pericia-grid">
          <F label="Nome — AT do Autor" field="nomeAtAutor" form={form} update={update} placeholder="Deixar em branco se não houver" />
          <F label="CREA — AT do Autor" field="creaAtAutor" form={form} update={update} placeholder="1234567890" />
          <F label="Nome — AT do Réu" field="nomeAtReu" form={form} update={update} placeholder="Deixar em branco se não houver" />
          <F label="CREA — AT do Réu" field="creaAtReu" form={form} update={update} placeholder="1234567890" />
        </div>
      </div>
    </>
  );
}

function Step2({ form, update, setForm }: { form: FormData; update: FieldUpdater; setForm: Dispatch<SetStateAction<FormData>> }) {
  const capacidadeOptions = [
    { value: "128 GB", label: "128 GB" },
    { value: "256 GB", label: "256 GB" },
    { value: "512 GB", label: "512 GB" },
    { value: "1 TB", label: "1 TB" },
  ];
  const garantiaOptions = [
    { value: "VIGENTE", label: "Vigente" },
    { value: "EXPIRADA", label: "Expirada" },
  ];

  return (
    <>
      <div className="pericia-section">
        <p className="pericia-section-title">Identificação do Dispositivo</p>
        <div className="pericia-grid">
          <F label="Modelo comercial" field="modeloIphone" form={form} update={update} placeholder="iPhone 16 Pro Max" />
          <F label="Número do modelo (A-XXXX)" field="numeroModelo" form={form} update={update} placeholder="A3293" />
          <F label="IMEI 1 (15 dígitos)" field="imei1" form={form} update={update} placeholder="000000000000000" />
          <F label="IMEI 2 (se aplicável)" field="imei2" form={form} update={update} placeholder="000000000000000" />
          <F label="Número de série (12 car.)" field="numeroSerie" form={form} update={update} placeholder="XXXXXXXXXXXXXX" />
          <F label="Capacidade" field="capacidade" form={form} update={update} options={capacidadeOptions} />
          <F label="Cor" field="corDispositivo" form={form} update={update} placeholder="Titânio Natural" />
          <F label="Certificação ANATEL" field="certificacaoAnatel" form={form} update={update} placeholder="01234-25-12345" />
          <F label="Status da garantia Apple" field="statusGarantia" form={form} update={update} options={garantiaOptions} />
          <F label="Data de garantia (vigência/expiração)" field="dataGarantia" form={form} update={update} type="date" />
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">Histórico de Aquisição e Defeito</p>
        <div className="pericia-grid">
          <F label="Data de compra" field="dataCompra" form={form} update={update} type="date" />
          <F label="Valor pago (R$)" field="valorCompra" form={form} update={update} placeholder="8.999,00" />
          <F label="Local de compra" field="localCompra" form={form} update={update} placeholder="Apple Store — Shopping Ibirapuera" span={2} />
          <F label="Data de início do defeito" field="dataDefeito" form={form} update={update} type="date" />
          <F label="Sintomas relatados pelo usuário" field="sintomasRelatados" form={form} update={update} rows={3} placeholder="Descreva os sintomas conforme relatado pelo consumidor" span={2} />
          <F label="Intervenções anteriores (OSs, datas, locais)" field="descricaoIntervencoes" form={form} update={update} rows={3} placeholder="Descreva as intervenções realizadas antes da perícia" span={2} />
          <F label="Versão dos fatos do Réu (contestação)" field="versaoReu" form={form} update={update} rows={3} placeholder="Resumo da defesa apresentada em contestação" span={2} />
        </div>
      </div>
    </>
  );
}

function Step3({ form, update, setForm }: { form: FormData; update: FieldUpdater; setForm: Dispatch<SetStateAction<FormData>> }) {
  const lciOptions = [
    { value: "NAO_ATIVADO", label: "Não ativado (branco/prata)" },
    { value: "ATIVADO", label: "Ativado (vermelho/rosa)" },
  ];
  const recNormalOptions = [
    { value: "RECONHECIDO", label: "Reconhecido" },
    { value: "NÃO RECONHECIDO", label: "Não reconhecido" },
    { value: "RECONHECIDO COM ERRO", label: "Reconhecido com erro" },
  ];
  const cargaResultOptions = [
    { value: "CARREGA", label: "Carrega" },
    { value: "NÃO CARREGA", label: "Não carrega" },
    { value: "CARREGA LENTAMENTE", label: "Carrega lentamente" },
    { value: "NÃO TESTADO", label: "Não testado" },
  ];
  const magsafeOptions = [
    { value: "CARREGA", label: "Carrega" },
    { value: "NÃO CARREGA", label: "Não carrega" },
    { value: "NÃO TESTADO", label: "Não testado" },
  ];

  return (
    <>
      <div className="pericia-section">
        <p className="pericia-section-title">Dados do Exame</p>
        <div className="pericia-grid">
          <F label="Data do exame" field="dataExame" form={form} update={update} type="date" />
          <F label="Local do exame" field="localExame" form={form} update={update} placeholder="Laboratório do perito — endereço" />
          <F label="Hora de início" field="horaInicio" form={form} update={update} placeholder="09:00" />
          <F label="Hora de término" field="horaFim" form={form} update={update} placeholder="13:00" />
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">6.1 — Inspeção Visual Externa</p>
        <div className="pericia-grid">
          <F label="Estado da tela e face frontal/traseira" field="estadoTela" form={form} update={update} rows={2} placeholder="Tela sem trincas ou manchas. Face traseira íntegra…" span={2} />
          <F label="Estado geral da carcaça" field="estadoCarcaca" form={form} update={update} rows={2} placeholder="Carcaça de titânio sem amassados ou arranhões profundos…" span={2} />
          <F label="Inspeção da porta USB-C" field="estadoUsbC" form={form} update={update} rows={2} placeholder="Pinos sem corrosão, detritos ou deformação mecânica…" span={2} />
          <F label="LCI-1 (bandeja SIM)" field="lci1Estado" form={form} update={update} options={lciOptions} />
          <F label="LCI-2 (região inferior)" field="lci2Estado" form={form} update={update} options={lciOptions} />
          <F label="Análise dos LCIs" field="analiseLci" form={form} update={update} rows={2} placeholder="Interpretação do estado dos indicadores…" span={2} />
          <div className="pericia-field">
            <label>Abertura prévia</label>
            <div className="pericia-checkbox-row">
              <input
                type="checkbox"
                checked={form.aberturaPrevia}
                onChange={(e) => setForm((p) => ({ ...p, aberturaPrevia: e.target.checked }))}
              />
              <span>Evidências de abertura prévia identificadas</span>
            </div>
          </div>
          {form.aberturaPrevia && (
            <F label="Descrição da abertura prévia" field="descricaoAberturaPrevia" form={form} update={update} rows={2} placeholder="Marcas nos parafusos Pentalobe P2 (0,8mm), adesivo perimetral comprometido…" span={2} />
          )}
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">6.2 — Diagnóstico por Software</p>
        <div className="pericia-grid">
          <F label="Modo Normal" field="reconhecimentoNormal" form={form} update={update} options={recNormalOptions} />
          <F label="Modo Recovery / DFU" field="reconhecimentoDfu" form={form} update={update} placeholder="Dispositivo detectado em modo DFU / Não detectado" />
          <F label="Versão iOS / firmware" field="versaoIos" form={form} update={update} placeholder="iOS 18.3.2" />
          <F label="Análise do diagnóstico por software" field="descricaoSoftware" form={form} update={update} rows={2} placeholder="O resultado indica falha no circuito de carga…" span={2} />
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">6.3 — Diagnóstico Elétrico</p>
        <div className="pericia-grid">
          <div className="pericia-field span-2">
            <label>Carga USB-C — Apple 20W</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.5fr", gap: "0.5rem" }}>
              <input type="text" value={form.cargaApple20wTensao} onChange={update("cargaApple20wTensao")} placeholder="V (tensão)" style={{ padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", font: "inherit", fontSize: "0.83rem" }} />
              <input type="text" value={form.cargaApple20wCorrente} onChange={update("cargaApple20wCorrente")} placeholder="A (corrente)" style={{ padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", font: "inherit", fontSize: "0.83rem" }} />
              <input type="text" value={form.cargaApple20wPotencia} onChange={update("cargaApple20wPotencia")} placeholder="W (potência)" style={{ padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", font: "inherit", fontSize: "0.83rem" }} />
              <select value={form.cargaApple20wResultado} onChange={update("cargaApple20wResultado")} style={{ padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", font: "inherit", fontSize: "0.83rem" }}>
                {cargaResultOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="pericia-field span-2">
            <label>Carga USB-C — Apple 30W</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.5fr", gap: "0.5rem" }}>
              <input type="text" value={form.cargaApple30wTensao} onChange={update("cargaApple30wTensao")} placeholder="V (tensão)" style={{ padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", font: "inherit", fontSize: "0.83rem" }} />
              <input type="text" value={form.cargaApple30wCorrente} onChange={update("cargaApple30wCorrente")} placeholder="A (corrente)" style={{ padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", font: "inherit", fontSize: "0.83rem" }} />
              <input type="text" value={form.cargaApple30wPotencia} onChange={update("cargaApple30wPotencia")} placeholder="W (potência)" style={{ padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", font: "inherit", fontSize: "0.83rem" }} />
              <select value={form.cargaApple30wResultado} onChange={update("cargaApple30wResultado")} style={{ padding: "0.45rem 0.6rem", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", font: "inherit", fontSize: "0.83rem" }}>
                {cargaResultOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <F label="Carga MagSafe (Qi2 25W)" field="cargaMagsafeResultado" form={form} update={update} options={magsafeOptions} />
          <F label="Análise termográfica" field="termografia" form={form} update={update} placeholder="Temperatura máxima registrada: 42°C na região do PMIC" />
          <F label="Resistência VBUS → GND" field="resistenciaVbus" form={form} update={update} placeholder="0,8 Ω" />
          <F label="Resistência CC1 → GND" field="resistenciaCc1" form={form} update={update} placeholder="22 kΩ" />
          <F label="Resistência CC2 → GND" field="resistenciaCc2" form={form} update={update} placeholder="22 kΩ" />
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">6.4 — Intervenções Anteriores</p>
        <div className="pericia-grid">
          <div className="pericia-field">
            <label>Intervenção anterior</label>
            <div className="pericia-checkbox-row">
              <input
                type="checkbox"
                checked={form.intervencaoAnterior}
                onChange={(e) => setForm((p) => ({ ...p, intervencaoAnterior: e.target.checked }))}
              />
              <span>Há evidências de intervenção técnica anterior</span>
            </div>
          </div>
          <F label="Descrição das evidências externas" field="descricaoIntervencoesExternas" form={form} update={update} rows={3} placeholder="Marcas de ferramentas inadequadas, adesivo rompido, parafusos danificados…" span={2} />
          <F label="Histórico Apple (GSX)" field="historicoGsx" form={form} update={update} rows={2} placeholder="Reparo autorizado realizado em 01/01/2025 por AASP / Sem registros de serviço Apple" span={2} />
        </div>
      </div>
    </>
  );
}

function QuesitosSection({
  title,
  label,
  quesitos,
  padrao,
  formData,
  onChange,
}: {
  title: string;
  label: string;
  quesitos: QuesitoPD[];
  padrao: QuesitoPD[];
  formData: FormData;
  onChange: (q: QuesitoPD[]) => void;
}) {
  const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const ALGARISMOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  const [aiLoading, setAiLoading] = useState<Set<number>>(new Set());
  const [aiErrors, setAiErrors] = useState<Record<number, string>>({});

  const addQ = () => onChange([...quesitos, { texto: "", resposta: "" }]);
  const removeQ = (i: number) => onChange(quesitos.filter((_, idx) => idx !== i));
  const updateQ = (i: number, field: keyof QuesitoPD, val: string) => {
    const next = [...quesitos];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };

  const loadPadrao = () => {
    if (quesitos.length > 0 && !confirm("Substituir quesitos atuais pelos padrão?")) return;
    onChange(padrao.map((q) => ({ ...q })));
  };

  const assistWithAI = async (i: number) => {
    const q = quesitos[i];
    if (!q.texto.trim()) return;
    setAiLoading((prev) => new Set(prev).add(i));
    setAiErrors((prev) => { const n = { ...prev }; delete n[i]; return n; });
    try {
      const r = await fetch("/api/pericia/assist-quesito", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, quesito: q.texto }),
      });
      if (!r.ok) throw new Error(await r.text());
      const data = (await r.json()) as { resposta: string };
      updateQ(i, "resposta", data.resposta);
    } catch (e) {
      setAiErrors((prev) => ({ ...prev, [i]: String(e) }));
    } finally {
      setAiLoading((prev) => { const n = new Set(prev); n.delete(i); return n; });
    }
  };

  const getNum = (i: number): string => {
    if (label === "autor") return String(i + 1);
    if (label === "reu") return LETRAS[i] ?? String(i + 1);
    return ALGARISMOS[i] ?? String(i + 1);
  };

  return (
    <div className="pericia-section">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)" }}>
        <p className="pericia-section-title" style={{ margin: 0, border: "none", padding: 0 }}>{title}</p>
        {padrao.length > 0 && (
          <button type="button" className="pericia-add-btn" onClick={loadPadrao} style={{ fontSize: "0.72rem" }}>
            Carregar padrão ({padrao.length})
          </button>
        )}
      </div>
      {quesitos.length === 0 && (
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
          Nenhum quesito adicionado. Clique em "Adicionar quesito" ou "Carregar padrão".
        </p>
      )}
      <div className="pericia-quesitos-list">
        {quesitos.map((q, i) => (
          <div key={i} className="pericia-quesito-item">
            <div className="pericia-quesito-num">{getNum(i)}.</div>
            <div className="pericia-quesito-fields">
              <span className="pericia-q-label">Texto do quesito</span>
              <textarea
                value={q.texto}
                onChange={(e) => updateQ(i, "texto", e.target.value)}
                rows={2}
                placeholder="Transcreva o quesito literalmente conforme formulado pela parte"
              />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.1rem" }}>
                <span className="pericia-q-label">Resposta do perito</span>
                <button
                  type="button"
                  className="pericia-ai-btn"
                  disabled={aiLoading.has(i) || !q.texto.trim()}
                  onClick={() => void assistWithAI(i)}
                  title="Gerar resposta com IA baseada nos dados diagnósticos"
                >
                  {aiLoading.has(i) ? "Gerando…" : "Gerar com IA"}
                </button>
              </div>
              {aiErrors[i] && (
                <p style={{ fontSize: "0.72rem", color: "var(--danger)", margin: "0.2rem 0 0" }}>{aiErrors[i]}</p>
              )}
              <textarea
                value={q.resposta}
                onChange={(e) => updateQ(i, "resposta", e.target.value)}
                rows={aiLoading.has(i) ? 2 : 4}
                placeholder={aiLoading.has(i) ? "Aguardando resposta da IA…" : "Resposta direta. Fundamentação técnica. Referência à norma ou evidência. Conclusão."}
                disabled={aiLoading.has(i)}
                style={aiLoading.has(i) ? { opacity: 0.5 } : undefined}
              />
            </div>
            <button className="pericia-quesito-remove" type="button" onClick={() => removeQ(i)} title="Remover quesito">
              ×
            </button>
          </div>
        ))}
      </div>
      <button className="pericia-add-btn" type="button" onClick={addQ}>
        + Adicionar quesito
      </button>
    </div>
  );
}

function Step4({ form, setForm }: { form: FormData; setForm: Dispatch<SetStateAction<FormData>> }) {
  return (
    <>
      <QuesitosSection
        title="Quesitos do Autor (numerados: 1, 2, 3…)"
        label="autor"
        quesitos={form.quesitosAutor}
        padrao={QUESITOS_PADRAO_AUTOR}
        formData={form}
        onChange={(q) => setForm((p) => ({ ...p, quesitosAutor: q }))}
      />
      <QuesitosSection
        title="Quesitos do Réu (letras: A, B, C…)"
        label="reu"
        quesitos={form.quesitosReu}
        padrao={QUESITOS_PADRAO_REU}
        formData={form}
        onChange={(q) => setForm((p) => ({ ...p, quesitosReu: q }))}
      />
      <QuesitosSection
        title="Quesitos do Juízo (algarismos romanos: I, II, III…)"
        label="juizo"
        quesitos={form.quesitosJuizo}
        padrao={QUESITOS_PADRAO_JUIZO}
        formData={form}
        onChange={(q) => setForm((p) => ({ ...p, quesitosJuizo: q }))}
      />
    </>
  );
}

function Step5({
  form,
  update,
  setForm,
  laudo,
  generating,
  error,
  onGenerate,
  onDownload,
}: {
  form: FormData;
  update: FieldUpdater;
  setForm: Dispatch<SetStateAction<FormData>>;
  laudo: string | null;
  generating: boolean;
  error: string | null;
  onGenerate: () => void;
  onDownload: () => void;
}) {
  const categoriaOptions = [
    { value: "A", label: "A — Vício de Fabricação (CDC, Art. 12)" },
    { value: "B", label: "B — Vício por Inadequação ao Uso (CDC, Art. 18)" },
    { value: "C", label: "C — Dano por Fato do Produto (CDC, Art. 12)" },
    { value: "D", label: "D — Dano por Uso Inadequado / Caso Fortuito" },
    { value: "E", label: "E — Dano por Intervenção de Terceiro" },
  ];
  const probOptions = [
    { value: "ALTA", label: "Alta" },
    { value: "MODERADA", label: "Moderada" },
    { value: "BAIXA", label: "Baixa" },
  ];
  const respOptions = [
    { value: "AUTOR", label: "Autor" },
    { value: "RÉU", label: "Réu" },
    { value: "ambas", label: "Ambas as partes" },
  ];

  const addReparo = () =>
    setForm((p) => ({ ...p, reparos: [...p.reparos, { descricao: "", custo: "" }] }));
  const removeReparo = (i: number) =>
    setForm((p) => ({ ...p, reparos: p.reparos.filter((_, idx) => idx !== i) }));
  const updateReparo = (i: number, field: keyof RepairItemPD, val: string) => {
    setForm((p) => {
      const next = [...p.reparos];
      next[i] = { ...next[i], [field]: val };
      return { ...p, reparos: next };
    });
  };

  return (
    <>
      <div className="pericia-section">
        <p className="pericia-section-title">Discussão Técnica</p>
        <div className="pericia-grid">
          <F label="Categoria do defeito (CDC)" field="categoriaDefeito" form={form} update={update} options={categoriaOptions} span={2} />
          <F label="Hipótese principal (cadeia causal)" field="hipotesePrincipal" form={form} update={update} rows={4} placeholder="Falha no circuito de carga (causa) → impossibilidade de negociação USB PD (mecanismo) → não carregamento via cabo (efeito) → impossibilidade de uso do produto (dano)" span={2} />
          <F label="Probabilidade hipótese 1" field="probabilidade1" form={form} update={update} options={probOptions} />
          <F label="Hipótese alternativa (opcional)" field="hipoteseAlternativa" form={form} update={update} rows={3} placeholder="Deixar em branco se não houver hipótese alternativa" span={2} />
          {form.hipoteseAlternativa && (
            <F label="Probabilidade hipótese 2" field="probabilidade2" form={form} update={update} options={probOptions} />
          )}
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">Reparabilidade</p>
        <div className="pericia-grid">
          <div className="pericia-field">
            <label>Estado</label>
            <div className="pericia-checkbox-row">
              <input
                type="checkbox"
                checked={form.reparavel}
                onChange={(e) => setForm((p) => ({ ...p, reparavel: e.target.checked }))}
              />
              <span>Dispositivo reparável</span>
            </div>
          </div>
        </div>
        {form.reparavel && (
          <div style={{ marginTop: "0.75rem" }}>
            <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.5rem" }}>Tabela de reparos estimados</p>
            <div className="pericia-repair-list">
              {form.reparos.map((r, i) => (
                <div key={i} className="pericia-repair-item">
                  <input
                    type="text"
                    value={r.descricao}
                    onChange={(e) => updateReparo(i, "descricao", e.target.value)}
                    placeholder="Descrição do reparo necessário"
                  />
                  <input
                    type="text"
                    value={r.custo}
                    onChange={(e) => updateReparo(i, "custo", e.target.value)}
                    placeholder="Custo estimado (ex: 1.500 a 2.000)"
                  />
                  <button className="pericia-quesito-remove" type="button" onClick={() => removeReparo(i)}>×</button>
                </div>
              ))}
            </div>
            <button className="pericia-add-btn" type="button" onClick={addReparo}>+ Adicionar reparo</button>
          </div>
        )}
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">Conclusões (art. 473, I, CPC/2015)</p>
        <div className="pericia-grid cols-1">
          <F label="Conclusão 1 — Estado atual do dispositivo" field="conclusao1" form={form} update={update} rows={2} placeholder="O dispositivo periciado encontra-se em estado de inoperância total, sem capacidade de carregamento via cabo USB-C…" />
          <F label="Conclusão 2 — Causa determinante da falha" field="conclusao2" form={form} update={update} rows={2} placeholder="A causa determinante da falha é o curto-circuito identificado na porta USB-C, com resistência VBUS-GND de 0,8 Ω…" />
          <F label="Conclusão 3 — Origem do defeito" field="conclusao3" form={form} update={update} rows={2} placeholder="O defeito tem origem em intervenção técnica inadequada realizada anteriormente…" />
          <F label="Conclusão 4 — Reparabilidade" field="conclusao4" form={form} update={update} rows={2} placeholder="O dispositivo é tecnicamente reparável, mediante substituição do módulo de carga USB-C…" />
          <F label="Conclusão 5 — Meios de reparação do dano (se aplicável)" field="conclusao5" form={form} update={update} rows={2} placeholder="O valor do reparo é economicamente viável em comparação ao valor de mercado do dispositivo…" />
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">Honorários Periciais</p>
        <div className="pericia-grid">
          <F label="Valor arbitrado (R$)" field="honorariosValor" form={form} update={update} placeholder="3.000,00" />
          <F label="Data do despacho de arbitramento" field="honorariosData" form={form} update={update} type="date" />
          <F label="Parte responsável pelo pagamento" field="honorariosResponsavel" form={form} update={update} options={respOptions} />
          <div className="pericia-field">
            <label>Depósito</label>
            <div className="pericia-checkbox-row">
              <input
                type="checkbox"
                checked={form.honorariosRecebido}
                onChange={(e) => setForm((p) => ({ ...p, honorariosRecebido: e.target.checked }))}
              />
              <span>Depósito recebido até a data deste laudo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">Encerramento</p>
        <div className="pericia-grid">
          <F label="Número do laudo" field="numeroLaudo" form={form} update={update} placeholder="001" />
          <F label="Ano do laudo" field="anoLaudo" form={form} update={update} placeholder={YEAR} />
          <F label="Cidade" field="cidade" form={form} update={update} placeholder="São Paulo" />
          <F label="Data do laudo" field="dataLaudo" form={form} update={update} type="date" />
        </div>
      </div>

      <div className="pericia-section">
        <p className="pericia-section-title">Gerar Laudo Técnico Pericial</p>
        {error && <div className="error-banner" style={{ marginBottom: "0.75rem" }}>{error}</div>}
        {!laudo ? (
          <div className="pericia-generate-area">
            <p>Preencha todos os campos necessários e clique em "Gerar Laudo" para criar o documento em formato Markdown, pronto para revisão e assinatura digital.</p>
            <button
              type="button"
              className="btn btn-primary"
              disabled={generating}
              onClick={onGenerate}
              style={{ minWidth: "160px" }}
            >
              {generating ? "Gerando…" : "Gerar Laudo"}
            </button>
          </div>
        ) : (
          <div className="pericia-preview-container">
            <div className="pericia-preview-toolbar">
              <span>Laudo Técnico Pericial — nº {form.numeroLaudo}/{form.anoLaudo}</span>
              <button type="button" className="btn btn-ghost" style={{ fontSize: "0.78rem" }} onClick={onGenerate}>
                Regenerar
              </button>
              <button type="button" className="btn btn-primary" style={{ fontSize: "0.78rem" }} onClick={onDownload}>
                Download .md
              </button>
              <button type="button" className="btn btn-ghost" style={{ fontSize: "0.78rem" }} onClick={() => window.print()}>
                Imprimir
              </button>
            </div>
            <pre className="pericia-preview-text">{laudo}</pre>
          </div>
        )}
      </div>
    </>
  );
}

export function PericiaView({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [laudo, setLaudo] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const isFirstMount = useRef(true);

  const [form, setForm] = useState<FormData>(() => {
    try {
      const raw = typeof localStorage !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as FormData;
        return parsed;
      }
    } catch { /* ignore */ }
    return initialForm;
  });

  // Set hasDraft after mount based on whether localStorage had data
  useEffect(() => {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null;
    if (raw) setHasDraft(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save debounced
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    const id = setTimeout(() => {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      }
    }, 600);
    return () => clearTimeout(id);
  }, [form]);

  const clearDraft = () => {
    if (typeof localStorage !== "undefined") localStorage.removeItem(DRAFT_KEY);
    setForm(initialForm);
    setLaudo(null);
    setHasDraft(false);
  };

  const update: FieldUpdater = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
  };

  const goNext = () => setStep((s) => Math.min(s + 1, 5));
  const goPrev = () => setStep((s) => Math.max(s - 1, 1));

  const generate = async () => {
    setGenerating(true);
    setGenError(null);
    try {
      const r = await fetch("/api/pericia/generate-laudo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const msg = await r.text();
        throw new Error(msg || `HTTP ${r.status}`);
      }
      const data = (await r.json()) as { laudo: string };
      setLaudo(data.laudo);
    } catch (e) {
      setGenError(String(e));
    } finally {
      setGenerating(false);
    }
  };

  const download = () => {
    if (!laudo) return;
    const safe = form.numeroProcesso.replace(/[/\\:*?"<>|]/g, "-") || "laudo";
    const blob = new Blob([laudo], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laudo-pericial-${safe}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stepProps = { form, update, setForm };

  return (
    <div className="pericia-container">
      <div className="pericia-header">
        <div className="pericia-title-row">
          <h2>Formulario Pericial — iPhone</h2>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {hasDraft && (
              <span className="meta" style={{ color: "var(--accent-dim)" }}>
                Rascunho salvo ·{" "}
                <button
                  type="button"
                  className="pericia-inline-link"
                  onClick={clearDraft}
                >
                  Limpar
                </button>
              </span>
            )}
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ fontSize: "0.8rem" }}>
              Fechar
            </button>
          </div>
        </div>
        <StepIndicator current={step} />
      </div>

      <div className="pericia-body">
        {step === 1 && <Step1 {...stepProps} />}
        {step === 2 && <Step2 {...stepProps} />}
        {step === 3 && <Step3 {...stepProps} />}
        {step === 4 && <Step4 form={form} setForm={setForm} />}
        {step === 5 && (
          <Step5
            {...stepProps}
            laudo={laudo}
            generating={generating}
            error={genError}
            onGenerate={() => void generate()}
            onDownload={download}
          />
        )}
      </div>

      <div className="pericia-footer">
        <div>
          {step > 1 && (
            <button type="button" className="btn btn-ghost" onClick={goPrev}>
              Anterior
            </button>
          )}
        </div>
        <div className="pericia-footer-right">
          <span className="meta">Passo {step} de 5</span>
          {step < 5 && (
            <button type="button" className="btn btn-primary" onClick={goNext}>
              Proximo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
