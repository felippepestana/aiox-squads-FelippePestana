// In-memory mock data for demo mode

export interface DemoProperty {
  id: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  type: string;
  area: number;
  matricula: string;
  inscricao: string;
  status: string;
  profileId: string;
  documents: DemoDocument[];
  analyses: DemoAnalysis[];
  createdAt: string;
  updatedAt: string;
}

export interface DemoDocument {
  id: string;
  type: string;
  filename: string;
  mimeType: string;
  size: number;
  storageKey: string;
  fileId: string | null;
  propertyId: string;
  createdAt: string;
}

export interface DemoAnalysis {
  id: string;
  useCase: string;
  status: string;
  agentLogs: any[];
  result: any;
  propertyId: string;
  exports: any[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Mock agent outputs — realistic Portuguese markdown for each agent
// ---------------------------------------------------------------------------

const MOCK_AGENT_OUTPUTS: Record<string, string> = {
  "leitor-documental": `## Dados Extraidos

| Campo | Valor | Confianca |
|---|---|---|
| Matricula | M-12.345 | [EXTRAIDO] |
| Cartorio | 1o Oficio de Registro de Imoveis de Manaus | [EXTRAIDO] |
| Area Terreno | 450 m2 | [EXTRAIDO] |
| Area Construida | 380 m2 | [INFERIDO] |
| Proprietario | Empresa XYZ Ltda | [EXTRAIDO] |
| CNPJ | 12.345.678/0001-99 | [EXTRAIDO] |
| Data Registro | 15/03/2019 | [EXTRAIDO] |
| Endereco | Rua Ramos Ferreira, 1000 - Centro, Manaus/AM | [EXTRAIDO] |
| Tipo | Comercial | [EXTRAIDO] |

### Observacoes
- Documento em bom estado de conservacao
- Todos os campos obrigatorios foram localizados
- Averbacao de construcao registrada em R-3
- Nenhuma penhora ou onus identificado na matricula`,

  "pesquisador-registral": `## Pesquisa Registral — Matricula M-12.345

**Cartorio:** 1o Oficio de Registro de Imoveis de Manaus
**Livro:** 2-AV | **Folha:** 234

### Cadeia Dominial
| # | Proprietario | Titulo | Data |
|---|---|---|---|
| 1 | Governo do Estado do AM | Concessao | 12/08/1965 |
| 2 | Comercial ABC S/A | Compra e Venda | 03/11/1987 |
| 3 | Empresa XYZ Ltda | Compra e Venda | 15/03/2019 |

### Onus e Gravames
- **Nenhum** onus, penhora, hipoteca ou arresto registrado.
- Imovel **livre e desembaracado**.

### IPTU
- Inscricao: 01.023.045.067.0001
- Situacao: **Regular** — pagamentos em dia ate 2025
- Valor venal: R$ 1.200.000,00

### Certidoes Negativas
- CND Federal: OK (valida ate 30/06/2026)
- CND Estadual: OK (valida ate 15/09/2026)
- CND Municipal: OK (valida ate 20/12/2025)`,

  "analista-legislativo": `## Legislacao Aplicavel

| Norma | Artigos Relevantes | Impacto |
|---|---|---|
| Codigo Civil (Lei 10.406/2002) | Arts. 1.245-1.247 (registro) | Transferencia valida |
| Lei de Registros Publicos (6.015/73) | Arts. 167, 176 | Matricula conforme |
| Plano Diretor de Manaus (Lei 2.266/2017) | Arts. 45-52 (uso do solo) | Zona comercial permitida |
| Codigo de Obras de Manaus (Lei 1.192/2007) | Arts. 12-18 | Construcao regular |
| Lei de Parcelamento do Solo (6.766/79) | Arts. 2, 4 | Lote regular |
| Estatuto da Cidade (10.257/2001) | Arts. 28-31 (outorga onerosa) | Potencial construtivo disponivel |

### Analise de Conformidade
- O imovel atende a todas as exigencias legais para operacao comercial
- Nao ha restricoes legais para alienacao
- Potencial para ampliacao dentro dos limites do Plano Diretor
- Recomenda-se verificar eventuais atualizacoes do Plano Diretor municipal`,

  "analista-urbanistico": `## Analise Urbanistica — Centro, Manaus/AM

### Zoneamento
- **Zona:** ZC - Zona Comercial Central
- **Setor:** Centro Historico de Manaus

### Indices Urbanisticos
| Parametro | Permitido | Existente | Status |
|---|---|---|---|
| Coeficiente de Aproveitamento (CA) | 4.0 | 0.84 | Conforme |
| Taxa de Ocupacao (TO) | 80% | 72% | Conforme |
| Gabarito Maximo | 12 pavimentos | 2 pavimentos | Conforme |
| Recuo Frontal | 0m (zona central) | 0m | Conforme |
| Vagas Estacionamento | 1/50m2 | N/A | Verificar |

### Usos Permitidos
- Comercio varejista e atacadista
- Servicos profissionais
- Uso misto (comercial + residencial nos pavimentos superiores)

### Potencial Construtivo
- Area de terreno: 450 m2
- Potencial maximo: 1.800 m2 (CA 4.0)
- Area construida atual: 380 m2
- **Saldo construtivo: 1.420 m2**

### Observacoes
- Imovel localizado em area de interesse historico — verificar IPHAN
- Infraestrutura urbana completa (agua, esgoto, energia, pavimentacao)`,

  "analista-visual": `## Verificacao Visual e Geoespacial

### Geolocalizacao
- **Coordenadas:** -3.1316, -60.0233
- **Verificacao:** Endereco confirmado via geocodificacao
- **Precisao:** Alta (< 5m de desvio)

### Descricao do Imovel
- Edificacao comercial de 2 pavimentos
- Fachada em alvenaria com revestimento ceramico
- Cobertura em laje impermeabilizada
- Acesso principal pela Rua Ramos Ferreira

### Estado de Conservacao
| Elemento | Estado | Nota |
|---|---|---|
| Estrutura | Bom | 8/10 |
| Fachada | Regular | 6/10 |
| Cobertura | Bom | 7/10 |
| Esquadrias | Regular | 6/10 |
| Instalacoes | Bom | 7/10 |

### Entorno
- Via pavimentada com calcada
- Comercio diversificado no entorno
- Transporte publico acessivel (linhas de onibus na via)
- Distancia ao Porto de Manaus: ~800m
- Distancia ao Teatro Amazonas: ~400m`,

  "avaliador-imovel": `## Laudo de Avaliacao

### Metodo: Comparativo Direto de Dados de Mercado

### Amostra de Comparaveis
| # | Endereco | Area | Valor | R$/m2 |
|---|---|---|---|---|
| 1 | Rua Saldanha Marinho, 620 - Centro | 420 m2 | R$ 1.680.000 | R$ 4.000 |
| 2 | Av. Eduardo Ribeiro, 850 - Centro | 500 m2 | R$ 2.250.000 | R$ 4.500 |
| 3 | Rua Barroso, 355 - Centro | 380 m2 | R$ 1.520.000 | R$ 4.000 |

### Fatores de Homogeneizacao
- Fator localizacao: 1.02 (via principal comercial)
- Fator area: 0.98 (area intermediaria)
- Fator conservacao: 0.97 (estado regular a bom)
- Fator padrao: 1.00 (padrao medio comercial)

### Resultado
| Item | Valor |
|---|---|
| Valor unitario medio | R$ 4.111/m2 |
| Area do imovel | 450 m2 |
| **Valor de mercado** | **R$ 1.850.000,00** |
| Intervalo de confianca (80%) | R$ 1.720.000 a R$ 1.980.000 |

### Fundamentacao
- Grau de fundamentacao: III (NBR 14653-2)
- Data-base: Abril 2026
- Validade: 6 meses`,

  "analista-ambiental": `## Analise Ambiental

### Areas de Preservacao
- **APP (Area de Preservacao Permanente):** Nao incide sobre o imovel
- **Igarape mais proximo:** Igarape de Manaus — distancia aproximada de 350m
- **Reserva Legal:** Nao aplicavel (area urbana consolidada)

### Riscos Ambientais
| Risco | Nivel | Observacao |
|---|---|---|
| Inundacao | Baixo | Cota acima do nivel historico de cheia |
| Contaminacao do solo | Nao identificado | Uso historico comercial |
| Erosao | Nao identificado | Terreno plano e urbanizado |
| Ruido | Moderado | Via de trafego intenso |

### Licenciamento
- Atividade comercial generica: **Dispensa de licenciamento ambiental**
- Caso mude para atividade potencialmente poluidora: necessario LAO (IPAAM)

### Conformidade
- Imovel em area urbana consolidada
- Nao ha sobreposicao com Unidades de Conservacao
- Nao ha arvores protegidas catalogadas no lote
- **Parecer: FAVORAVEL** — sem impedimentos ambientais`,

  "analista-condominial": `## Analise Condominial

### Resultado: **NAO APLICAVEL**

O imovel localizado na Rua Ramos Ferreira, 1000 — Centro, Manaus/AM
**nao esta inserido em regime condominial**.

### Detalhamento
- Trata-se de edificacao autonoma em lote individual
- Matricula propria (M-12.345) sem fracao ideal
- Nao ha convencao de condominio registrada
- Nao ha CNPJ condominial vinculado

### Recomendacao
Caso o proprietario pretenda instituir condominio edilicio
(ex: divisao em salas comerciais), sera necessario:
1. Projeto arquitetonico de subdivisao
2. Averbacao de construcao atualizada
3. Instituicao e registro da convencao
4. Obtencao de CNPJ para o condominio`,

  "relator-imobiliario": `## Relatorio Sintetico — Rua Ramos Ferreira, 1000

### Resumo Executivo
Imovel comercial de 450 m2 no Centro de Manaus, com matricula regular,
livre de onus, em conformidade urbanistica e ambiental.
**Valor de mercado estimado: R$ 1.850.000,00.**

### Pontos Fortes
- Matricula limpa, sem onus ou gravames
- Localizacao privilegiada no centro comercial
- Saldo construtivo significativo (1.420 m2 adicionais)
- Conformidade legal e urbanistica plena
- Sem impedimentos ambientais

### Pontos de Atencao
- Fachada com conservacao regular (nota 6/10)
- Verificar necessidade de vagas de estacionamento
- Possivel area de interesse historico (IPHAN)
- Via de trafego intenso (ruido moderado)

### Conclusao
O imovel apresenta boa regularidade documental e urbanistica,
com potencial significativo de valorizacao dado o saldo construtivo
disponivel. Recomenda-se a regularizacao das vagas de estacionamento
e eventual revitalizacao da fachada.

**Classificacao de risco: BAIXO**
**Parecer final: FAVORAVEL para transacao imobiliaria**`,
};

// ---------------------------------------------------------------------------
// Pre-populated data
// ---------------------------------------------------------------------------

const now = new Date().toISOString();

const SEED_PROPERTY: DemoProperty = {
  id: "demo-prop-001",
  address: "Rua Ramos Ferreira",
  number: "1000",
  neighborhood: "Centro",
  city: "Manaus",
  state: "AM",
  cep: "69010-120",
  type: "comercial",
  area: 450,
  matricula: "M-12.345",
  inscricao: "01.023.045.067.0001",
  status: "ready",
  profileId: "demo-user-001",
  documents: [],
  analyses: [],
  createdAt: now,
  updatedAt: now,
};

const SEED_ANALYSIS: DemoAnalysis = {
  id: "demo-analysis-001",
  useCase: "UC-PD-ALL",
  status: "done",
  agentLogs: Object.entries(MOCK_AGENT_OUTPUTS).map(([agentId, output]) => ({
    agentId,
    agentName: agentId,
    tier: "standard",
    status: "done",
    startedAt: now,
    finishedAt: now,
    output,
    model: "demo-mode",
  })),
  result: { ...MOCK_AGENT_OUTPUTS },
  propertyId: "demo-prop-001",
  exports: [],
  createdAt: now,
  updatedAt: now,
};

// Wire the analysis into the property
SEED_PROPERTY.analyses.push(SEED_ANALYSIS);

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------

let properties: DemoProperty[] = [SEED_PROPERTY];
let analyses: DemoAnalysis[] = [SEED_ANALYSIS];
let documents: DemoDocument[] = [];
let exports_: { id: string; mode: string; format: string; fileUrl: string | null; analysisId: string; createdAt: string }[] = [];
let idCounter = 1;

function nextId(prefix: string): string {
  idCounter++;
  return `${prefix}-${String(idCounter).padStart(3, "0")}`;
}

export const demoStore = {
  // Properties
  getProperties(): DemoProperty[] {
    return properties.map((p) => ({
      ...p,
      _count: { documents: p.documents.length, analyses: p.analyses.length },
    })) as any;
  },

  getProperty(id: string): DemoProperty | undefined {
    return properties.find((p) => p.id === id);
  },

  createProperty(data: {
    address: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    type: string;
    area?: number;
    matricula?: string;
    inscricao?: string;
  }): DemoProperty {
    const prop: DemoProperty = {
      id: nextId("demo-prop"),
      address: data.address,
      number: data.number,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      cep: data.cep,
      type: data.type,
      area: data.area ?? 0,
      matricula: data.matricula ?? "",
      inscricao: data.inscricao ?? "",
      status: "draft",
      profileId: "demo-user-001",
      documents: [],
      analyses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    properties.push(prop);
    return prop;
  },

  // Analyses
  getAnalysis(id: string): DemoAnalysis | undefined {
    return analyses.find((a) => a.id === id);
  },

  createAnalysis(propertyId: string, useCase: string): DemoAnalysis {
    const analysis: DemoAnalysis = {
      id: nextId("demo-analysis"),
      useCase,
      status: "pending",
      agentLogs: [],
      result: { ...MOCK_AGENT_OUTPUTS },
      propertyId,
      exports: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    analyses.push(analysis);
    const prop = properties.find((p) => p.id === propertyId);
    if (prop) prop.analyses.push(analysis);
    return analysis;
  },

  updateAnalysisStatus(id: string, status: string): DemoAnalysis | undefined {
    const analysis = analyses.find((a) => a.id === id);
    if (analysis) {
      analysis.status = status;
      analysis.updatedAt = new Date().toISOString();
    }
    return analysis;
  },

  // Documents
  addDocument(propertyId: string, doc: Omit<DemoDocument, "id" | "createdAt">): DemoDocument {
    const document: DemoDocument = {
      id: nextId("demo-doc"),
      ...doc,
      createdAt: new Date().toISOString(),
    };
    documents.push(document);
    const prop = properties.find((p) => p.id === propertyId);
    if (prop) prop.documents.push(document);
    return document;
  },

  // Exports
  getExports(analysisId?: string): any[] {
    if (analysisId) {
      return exports_.filter((e) => e.analysisId === analysisId);
    }
    return exports_;
  },

  createExport(analysisId: string, mode: string, format: string): any {
    const exp = {
      id: nextId("demo-export"),
      mode,
      format,
      fileUrl: null,
      analysisId,
      createdAt: new Date().toISOString(),
    };
    exports_.push(exp);
    const analysis = analyses.find((a) => a.id === analysisId);
    if (analysis) analysis.exports.push(exp);
    return exp;
  },

  // Utility: get mock agent outputs (for SSE streaming)
  getMockAgentOutputs(): Record<string, string> {
    return { ...MOCK_AGENT_OUTPUTS };
  },
};
