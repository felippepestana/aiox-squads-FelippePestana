import { useCallback, useState } from "react";
import {
  Search,
  Plus,
  Bot,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Shield,
  Target,
  Zap,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AgentInfo } from "../types";

interface AgentPanelProps {
  agents: AgentInfo[];
  loading: boolean;
  searchResults: AgentInfo[];
  onSearch: (query: string) => void;
  onCreate: (data: {
    name: string;
    role: string;
    expertise: string;
    tier?: string;
    style?: string;
    commands?: string[];
  }) => Promise<any>;
  onSelectAgent: (agentId: string) => void;
}

const TIER_CONFIG: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  orchestrator: { label: "Orchestrator", color: "text-legal-gold border-legal-gold/30 bg-legal-gold/10", icon: Zap },
  tier_0: { label: "Tier 0 - Triagem", color: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10", icon: Shield },
  tier_1: { label: "Tier 1 - Pesquisa", color: "text-blue-400 border-blue-400/30 bg-blue-400/10", icon: Search },
  tier_2: { label: "Tier 2 - Analise", color: "text-purple-400 border-purple-400/30 bg-purple-400/10", icon: Target },
  tier_3: { label: "Tier 3 - Validacao", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10", icon: Shield },
};

export default function AgentPanel({
  agents,
  loading,
  searchResults,
  onSearch,
  onCreate,
  onSelectAgent,
}: AgentPanelProps) {
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Creation form
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newExpertise, setNewExpertise] = useState("");
  const [newTier, setNewTier] = useState("tier_2");
  const [newStyle, setNewStyle] = useState("tecnico e preciso");
  const [newCommands, setNewCommands] = useState("");

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch(value);
    },
    [onSearch],
  );

  const handleCreate = useCallback(async () => {
    if (!newName.trim() || !newRole.trim()) return;
    setCreating(true);
    try {
      await onCreate({
        name: newName,
        role: newRole,
        expertise: newExpertise,
        tier: newTier,
        style: newStyle,
        commands: newCommands.split(",").map((c) => c.trim()).filter(Boolean),
      });
      setShowCreate(false);
      setNewName("");
      setNewRole("");
      setNewExpertise("");
      setNewCommands("");
    } finally {
      setCreating(false);
    }
  }, [newName, newRole, newExpertise, newTier, newStyle, newCommands, onCreate]);

  const displayAgents = query ? searchResults : agents;

  // Group agents by tier
  const grouped = displayAgents.reduce<Record<string, AgentInfo[]>>((acc, agent) => {
    const tier = agent.tier || "tier_1";
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(agent);
    return acc;
  }, {});

  const tierOrder = ["orchestrator", "tier_0", "tier_1", "tier_2", "tier_3"];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Agentes do Squad</h2>
          <div className="flex gap-2">
            <span className="badge-gold">{agents.length} agentes</span>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Criar via Skill
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar agentes por nome, expertise, dominio..."
            className="input-field pl-10 text-xs py-2"
          />
        </div>
      </div>

      {/* Create agent dialog */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-white/5 overflow-hidden"
          >
            <div className="p-4 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-legal-gold" />
                  <span className="text-sm font-medium text-white">
                    Criar Agente via Skill
                  </span>
                </div>
                <button
                  onClick={() => setShowCreate(false)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">
                    Nome do Agente
                  </label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="ex: Tributario Analyst"
                    className="input-field text-xs py-2"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">
                    Funcao/Role
                  </label>
                  <input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="ex: Analista Tributario"
                    className="input-field text-xs py-2"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">
                  Expertise / Dominio
                </label>
                <textarea
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Descreva a expertise do agente..."
                  className="input-field text-xs py-2 resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">
                    Tier
                  </label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value)}
                    className="input-field text-xs py-2"
                  >
                    <option value="tier_0">Tier 0 - Triagem</option>
                    <option value="tier_1">Tier 1 - Pesquisa</option>
                    <option value="tier_2">Tier 2 - Analise</option>
                    <option value="tier_3">Tier 3 - Validacao</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">
                    Estilo
                  </label>
                  <input
                    value={newStyle}
                    onChange={(e) => setNewStyle(e.target.value)}
                    className="input-field text-xs py-2"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">
                    Comandos (virgula)
                  </label>
                  <input
                    value={newCommands}
                    onChange={(e) => setNewCommands(e.target.value)}
                    placeholder="analisar, validar"
                    className="input-field text-xs py-2"
                  />
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={!newName.trim() || !newRole.trim() || creating}
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {creating ? "Criando agente..." : "Criar Agente"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
          </div>
        ) : (
          tierOrder
            .filter((tier) => grouped[tier]?.length)
            .map((tier) => {
              const config = TIER_CONFIG[tier] || TIER_CONFIG.tier_1;
              const TierIcon = config.icon;

              return (
                <div key={tier}>
                  <div className="flex items-center gap-2 mb-2">
                    <TierIcon className={`w-3.5 h-3.5 ${config.color.split(" ")[0]}`} />
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                      {config.label}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      ({grouped[tier].length})
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {grouped[tier].map((agent) => (
                      <motion.div
                        key={agent.agent_id}
                        layout
                        className={`glass-panel-light rounded-lg overflow-hidden border ${config.color.split(" ")[1]}`}
                      >
                        <button
                          onClick={() =>
                            setExpandedAgent(
                              expandedAgent === agent.agent_id
                                ? null
                                : agent.agent_id,
                            )
                          }
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${config.color}`}
                          >
                            {agent.icon || (
                              <Bot className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-white truncate">
                              @{agent.agent_id}
                            </div>
                            <div className="text-[10px] text-gray-500 truncate">
                              {agent.title}
                            </div>
                          </div>
                          {agent.is_custom && (
                            <span className="badge-gold text-[9px]">Custom</span>
                          )}
                          {expandedAgent === agent.agent_id ? (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedAgent === agent.agent_id && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 border-t border-white/5 pt-2">
                                {agent.description && (
                                  <p className="text-[11px] text-gray-400 mb-2">
                                    {agent.description}
                                  </p>
                                )}

                                {agent.expertise_domains.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {agent.expertise_domains.map((d, i) => (
                                      <span key={i} className="badge-gray text-[9px]">
                                        {String(d)}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {agent.commands.length > 0 && (
                                  <div className="mb-2">
                                    <span className="text-[10px] text-gray-500 block mb-1">
                                      Comandos:
                                    </span>
                                    {agent.commands.map((cmd, i) => (
                                      <span
                                        key={i}
                                        className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-brand-300 font-mono"
                                      >
                                        *{cmd.name}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <button
                                  onClick={() => onSelectAgent(agent.agent_id)}
                                  className="btn-primary text-xs w-full mt-1"
                                >
                                  Acionar @{agent.agent_id}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
