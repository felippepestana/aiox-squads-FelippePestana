import { useState, useEffect, useCallback } from 'react'
import type { AgentDefinition, ApiSquad } from '../types'
import { getAgentMeta, SQUAD_LABELS } from '../data/agents'

export interface SquadGroup {
  id: string
  label: string
  agents: AgentDefinition[]
}

interface UseAgentsReturn {
  squads: SquadGroup[]
  allAgents: AgentDefinition[]
  activeAgent: AgentDefinition | null
  setActiveAgent: (agent: AgentDefinition) => void
  isLoading: boolean
  error: string | null
  refresh: () => void
}

export function useAgents(): UseAgentsReturn {
  const [squads, setSquads] = useState<SquadGroup[]>([])
  const [allAgents, setAllAgents] = useState<AgentDefinition[]>([])
  const [activeAgent, setActiveAgentState] = useState<AgentDefinition | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgents = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/agents')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: ApiSquad[] = await res.json()

      const groups: SquadGroup[] = data.map((s) => ({
        id: s.id,
        label: SQUAD_LABELS[s.id] || s.id,
        agents: s.agents.map((a) => getAgentMeta(a.id, a.name, a.squad)),
      }))

      const flat: AgentDefinition[] = groups.flatMap((g) => g.agents)

      setSquads(groups)
      setAllAgents(flat)

      // Auto-select legal squad first agent if available
      if (!activeAgent && flat.length > 0) {
        const legalFirst = flat.find((a) => a.squad === 'legal')
        setActiveAgentState(legalFirst || flat[0])
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar agentes'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [activeAgent])

  useEffect(() => {
    fetchAgents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setActiveAgent = useCallback((agent: AgentDefinition) => {
    setActiveAgentState(agent)
  }, [])

  return {
    squads,
    allAgents,
    activeAgent,
    setActiveAgent,
    isLoading,
    error,
    refresh: fetchAgents,
  }
}
