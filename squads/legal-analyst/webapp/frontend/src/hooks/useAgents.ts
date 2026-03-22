import { useCallback, useEffect, useState } from "react";
import * as api from "../services/api";
import type { AgentInfo } from "../types";

export function useAgents() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<AgentInfo[]>([]);

  const loadAgents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listAgents();
      setAgents(data);
    } catch {
      // Fallback with static agent list
      setAgents(DEFAULT_AGENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const data = await api.searchAgents(query);
      setSearchResults(data);
    } catch {
      const filtered = agents.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filtered);
    }
  }, [agents]);

  const createAgent = useCallback(async (data: {
    name: string;
    role: string;
    expertise: string;
    tier?: string;
    style?: string;
    commands?: string[];
  }) => {
    const result = await api.createAgent(data);
    await loadAgents();
    return result;
  }, [loadAgents]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  return { agents, loading, searchResults, search, createAgent, loadAgents };
}

const DEFAULT_AGENTS: AgentInfo[] = [
  { agent_id: "legal-chief", name: "Legal Chief", title: "Orquestrador do Pipeline", icon: "", tier: "orchestrator", squad: "legal-analyst", description: "Orquestra todo o pipeline de analise juridica, roteando demandas para os agentes especializados.", commands: [], expertise_domains: ["orquestracao", "pipeline", "roteamento"], status: "available", is_custom: false },
  { agent_id: "barbosa-classifier", name: "Barbosa Classifier", title: "Classificacao TPU/SGT", icon: "", tier: "tier_0", squad: "legal-analyst", description: "Classifica processos conforme tabelas unificadas do CNJ (TPU/SGT).", commands: [], expertise_domains: ["classificacao", "TPU", "SGT"], status: "available", is_custom: false },
  { agent_id: "fux-procedural", name: "Fux Procedural", title: "Admissibilidade e Requisitos", icon: "", tier: "tier_0", squad: "legal-analyst", description: "Verifica admissibilidade e requisitos processuais conforme CPC.", commands: [], expertise_domains: ["admissibilidade", "CPC", "requisitos"], status: "available", is_custom: false },
  { agent_id: "cnj-compliance", name: "CNJ Compliance", title: "Conformidade CNJ", icon: "", tier: "tier_0", squad: "legal-analyst", description: "Verifica conformidade com resolucoes do CNJ.", commands: [], expertise_domains: ["CNJ", "resolucoes", "compliance"], status: "available", is_custom: false },
  { agent_id: "mendes-researcher", name: "Mendes Researcher", title: "Pesquisa Constitucional", icon: "", tier: "tier_1", squad: "legal-analyst", description: "Pesquisa jurisprudencia constitucional e infraconstitucional.", commands: [], expertise_domains: ["pesquisa", "constitucional", "jurisprudencia"], status: "available", is_custom: false },
  { agent_id: "toffoli-aggregator", name: "Toffoli Aggregator", title: "Consolidacao de Precedentes", icon: "", tier: "tier_1", squad: "legal-analyst", description: "Consolida e agrega precedentes jurisprudenciais.", commands: [], expertise_domains: ["consolidacao", "precedentes", "agregacao"], status: "available", is_custom: false },
  { agent_id: "moraes-analyst", name: "Moraes Analyst", title: "Direitos Fundamentais", icon: "", tier: "tier_1", squad: "legal-analyst", description: "Analisa questoes de direitos fundamentais e garantias.", commands: [], expertise_domains: ["direitos fundamentais", "garantias", "constitucional"], status: "available", is_custom: false },
  { agent_id: "carmem-relator", name: "Carmem Relator", title: "Perfil do Relator", icon: "", tier: "tier_2", squad: "legal-analyst", description: "Analisa perfil decisorio do Relator no tema.", commands: [], expertise_domains: ["relator", "perfil", "decisorio"], status: "available", is_custom: false },
  { agent_id: "fachin-precedent", name: "Fachin Precedent", title: "Analise de Precedentes", icon: "", tier: "tier_2", squad: "legal-analyst", description: "Analise aprofundada de precedentes com distinguishing.", commands: [], expertise_domains: ["precedentes", "distinguishing", "ratio decidendi"], status: "available", is_custom: false },
  { agent_id: "nunes-quantitative", name: "Nunes Quantitative", title: "Jurimetria", icon: "", tier: "tier_2", squad: "legal-analyst", description: "Analise jurimetrica e quantitativa de dados processuais.", commands: [], expertise_domains: ["jurimetria", "estatistica", "quantitativa"], status: "available", is_custom: false },
  { agent_id: "barroso-strategist", name: "Barroso Strategist", title: "Estrategia Argumentativa", icon: "", tier: "tier_2", squad: "legal-analyst", description: "Elabora estrategia argumentativa e fundamentacao conforme CPC Art. 489.", commands: [], expertise_domains: ["estrategia", "fundamentacao", "Art. 489"], status: "available", is_custom: false },
  { agent_id: "theodoro-validator", name: "Theodoro Validator", title: "Validacao Processual", icon: "", tier: "tier_3", squad: "legal-analyst", description: "Validacao processual e conformidade tecnica.", commands: [], expertise_domains: ["validacao", "processual", "conformidade"], status: "available", is_custom: false },
  { agent_id: "marinoni-quality", name: "Marinoni Quality", title: "Qualidade de Precedentes", icon: "", tier: "tier_3", squad: "legal-analyst", description: "Controle de qualidade dos precedentes citados.", commands: [], expertise_domains: ["qualidade", "precedentes", "controle"], status: "available", is_custom: false },
  { agent_id: "datajud-formatter", name: "DATAJUD Formatter", title: "Formatacao DATAJUD", icon: "", tier: "tier_3", squad: "legal-analyst", description: "Formata saida conforme schema DATAJUD do CNJ.", commands: [], expertise_domains: ["DATAJUD", "formatacao", "schema"], status: "available", is_custom: false },
  { agent_id: "weber-indexer", name: "Weber Indexer", title: "Indexacao Tematica", icon: "", tier: "tier_3", squad: "legal-analyst", description: "Indexacao tematica e classificacao de conteudo.", commands: [], expertise_domains: ["indexacao", "tematica", "classificacao"], status: "available", is_custom: false },
];
