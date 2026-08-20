/**
 * Document Generation Templates
 * Intelligent templates for common legal documents
 */

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'peticao' | 'recurso' | 'contrato' | 'parecer' | 'notificacao';
  variables: TemplateVariable[];
  structure: TemplateSection[];
  legalBasis?: string;
}

export interface TemplateVariable {
  id: string;
  label: string;
  type: 'text' | 'date' | 'currency' | 'cpf' | 'cnpj' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select type
  validation?: string; // regex pattern
}

export interface TemplateSection {
  id: string;
  title: string;
  content: string; // Template with {{variable}} placeholders
  order: number;
  optional?: boolean;
}

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'peticao_inicial_cobranca',
    name: 'Petição Inicial - Ação de Cobrança',
    description: 'Modelo de petição inicial para ação de cobrança',
    category: 'peticao',
    legalBasis: 'CPC art. 319',
    variables: [
      { id: 'juizo', label: 'Juízo Competente', type: 'text', required: true, placeholder: 'Ex: Juízo da 2ª Vara Cível da Comarca de Porto Velho/RO' },
      { id: 'autor_nome', label: 'Nome do Autor', type: 'text', required: true },
      { id: 'autor_cpf', label: 'CPF do Autor', type: 'cpf', required: true },
      { id: 'autor_endereco', label: 'Endereço do Autor', type: 'textarea', required: true },
      { id: 'reu_nome', label: 'Nome do Réu', type: 'text', required: true },
      { id: 'reu_cpf_cnpj', label: 'CPF/CNPJ do Réu', type: 'text', required: true },
      { id: 'reu_endereco', label: 'Endereço do Réu', type: 'textarea', required: true },
      { id: 'valor_divida', label: 'Valor da Dívida', type: 'currency', required: true },
      { id: 'origem_divida', label: 'Origem da Dívida', type: 'textarea', required: true },
      { id: 'data_vencimento', label: 'Data do Vencimento', type: 'date', required: true },
      { id: 'valor_causa', label: 'Valor da Causa', type: 'currency', required: true },
      { id: 'conciliacao', label: 'Audiência de Conciliação', type: 'select', required: true, options: ['Deseja', 'Não deseja'] },
    ],
    structure: [
      {
        id: 'enderecamento',
        title: 'Endereçamento',
        content: 'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DO {{juizo}}',
        order: 1,
      },
      {
        id: 'qualificacao',
        title: 'Qualificação das Partes',
        content: '{{autor_nome}}, inscrito(a) no CPF sob o nº {{autor_cpf}}, residente e domiciliado(a) em {{autor_endereco}}, vem, respeitosamente, à presença de Vossa Excelência, por seu(sua) advogado(a) que esta subscreve (procuração anexa), propor a presente\n\nAÇÃO DE COBRANÇA\n\nem face de {{reu_nome}}, inscrito(a) no CPF/CNPJ sob o nº {{reu_cpf_cnpj}}, com endereço em {{reu_endereco}}, pelos fatos e fundamentos a seguir expostos.',
        order: 2,
      },
      {
        id: 'fatos',
        title: 'Dos Fatos',
        content: 'O(A) Autor(a) é credor(a) do(a) Réu(Ré) no valor de {{valor_divida}}, decorrente de {{origem_divida}}, com vencimento em {{data_vencimento}}.\n\nApesar de devidamente notificado(a), o(a) Réu(Ré) permanece inadimplente, não efetuando o pagamento da quantia devida, restando ao Autor(a) a propositura da presente ação.',
        order: 3,
      },
      {
        id: 'direito',
        title: 'Do Direito',
        content: 'O direito à cobrança da dívida encontra respaldo nos artigos 389, 394 e 395 do Código Civil, que estabelecem a obrigação do devedor de responder por perdas e danos em caso de inadimplemento.\n\nAlém disso, o artigo 397 do Código Civil dispõe que o inadimplemento da obrigação, positiva e líquida, no seu termo, constitui de pleno direito em mora o devedor.',
        order: 4,
      },
      {
        id: 'pedidos',
        title: 'Dos Pedidos',
        content: 'Ante o exposto, requer:\n\na) a citação do(a) Réu(Ré) para, querendo, contestar a presente ação;\nb) a procedência total dos pedidos, condenando o(a) Réu(Ré) ao pagamento de {{valor_divida}}, acrescido de correção monetária e juros de mora legais desde o vencimento;\nc) a condenação do(a) Réu(Ré) ao pagamento de custas processuais e honorários advocatícios;\nd) a produção de todas as provas em direito admitidas.\n\nO(A) Autor(a) {{conciliacao}} a realização de audiência de conciliação/mediação (art. 334, CPC).\n\nDá-se à causa o valor de {{valor_causa}}.\n\nTermos em que,\nPede deferimento.',
        order: 5,
      },
    ],
  },
  {
    id: 'contestacao_generica',
    name: 'Contestação - Modelo Genérico',
    description: 'Modelo de contestação para adaptar a qualquer tipo de ação',
    category: 'peticao',
    legalBasis: 'CPC art. 336-342',
    variables: [
      { id: 'juizo', label: 'Juízo', type: 'text', required: true },
      { id: 'processo', label: 'Nº do Processo', type: 'text', required: true },
      { id: 'reu_nome', label: 'Nome do Réu (Contestante)', type: 'text', required: true },
      { id: 'autor_nome', label: 'Nome do Autor', type: 'text', required: true },
      { id: 'preliminares', label: 'Preliminares (se houver)', type: 'textarea', required: false },
      { id: 'merito', label: 'Argumentos de Mérito', type: 'textarea', required: true },
    ],
    structure: [
      {
        id: 'enderecamento',
        title: 'Endereçamento',
        content: 'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(ÍZA) DE DIREITO DO {{juizo}}\n\nProcesso nº {{processo}}',
        order: 1,
      },
      {
        id: 'qualificacao',
        title: 'Qualificação',
        content: '{{reu_nome}}, já qualificado(a) nos autos da ação que lhe move {{autor_nome}}, vem, respeitosamente, perante Vossa Excelência, por seu(sua) advogado(a), apresentar\n\nCONTESTAÇÃO\n\npelos fatos e fundamentos a seguir aduzidos.',
        order: 2,
      },
      {
        id: 'preliminares',
        title: 'Das Preliminares',
        content: '{{preliminares}}',
        order: 3,
        optional: true,
      },
      {
        id: 'merito',
        title: 'Do Mérito',
        content: '{{merito}}',
        order: 4,
      },
      {
        id: 'pedidos',
        title: 'Dos Pedidos',
        content: 'Ante o exposto, requer:\n\na) o acolhimento das preliminares arguidas, com a extinção do feito sem resolução de mérito;\nb) subsidiariamente, a total improcedência dos pedidos autorais;\nc) a condenação do(a) Autor(a) ao pagamento de custas e honorários advocatícios;\nd) a produção de todas as provas em direito admitidas.\n\nTermos em que,\nPede deferimento.',
        order: 5,
      },
    ],
  },
  {
    id: 'notificacao_extrajudicial',
    name: 'Notificação Extrajudicial',
    description: 'Modelo de notificação extrajudicial para constituição em mora',
    category: 'notificacao',
    variables: [
      { id: 'notificante_nome', label: 'Nome do Notificante', type: 'text', required: true },
      { id: 'notificado_nome', label: 'Nome do Notificado', type: 'text', required: true },
      { id: 'notificado_endereco', label: 'Endereço do Notificado', type: 'textarea', required: true },
      { id: 'objeto', label: 'Objeto da Notificação', type: 'textarea', required: true },
      { id: 'prazo_dias', label: 'Prazo para Cumprimento (dias)', type: 'text', required: true },
      { id: 'providencia', label: 'Providência Exigida', type: 'textarea', required: true },
    ],
    structure: [
      {
        id: 'cabecalho',
        title: 'Cabeçalho',
        content: 'NOTIFICAÇÃO EXTRAJUDICIAL\n\nÀ\n{{notificado_nome}}\n{{notificado_endereco}}',
        order: 1,
      },
      {
        id: 'corpo',
        title: 'Corpo',
        content: '{{notificante_nome}}, por meio de seu(sua) advogado(a) infra-assinado(a), vem NOTIFICAR Vossa Senhoria acerca do seguinte:\n\n{{objeto}}\n\nDiante do exposto, NOTIFICA-SE Vossa Senhoria para que, no prazo de {{prazo_dias}} dias, adote a seguinte providência:\n\n{{providencia}}\n\nO não atendimento da presente notificação no prazo estipulado importará na adoção das medidas judiciais cabíveis, sem nova intimação.',
        order: 2,
      },
      {
        id: 'encerramento',
        title: 'Encerramento',
        content: 'A presente notificação é feita para que surta seus efeitos legais, servindo como constituição em mora nos termos do art. 397, parágrafo único, do Código Civil.',
        order: 3,
      },
    ],
  },
];

export function getDocumentTemplate(id: string): DocumentTemplate | undefined {
  return DOCUMENT_TEMPLATES.find(t => t.id === id);
}

export function getDocumentTemplates(): DocumentTemplate[] {
  return DOCUMENT_TEMPLATES;
}

export function getTemplatesByCategory(category: DocumentTemplate['category']): DocumentTemplate[] {
  return DOCUMENT_TEMPLATES.filter(t => t.category === category);
}
