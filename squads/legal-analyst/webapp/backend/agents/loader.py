"""Load agent definitions from the squad's agents/ directory."""
from __future__ import annotations

import re
from pathlib import Path

import yaml

from ..core.config import AGENTS_DIR, DATA_DIR, WORKFLOWS_DIR
from ..core.models import AgentInfo, AgentTier


_TIER_MAP = {
    "orchestrator": AgentTier.ORCHESTRATOR,
    "0": AgentTier.TIER_0,
    "1": AgentTier.TIER_1,
    "2": AgentTier.TIER_2,
    "3": AgentTier.TIER_3,
}


def _parse_agent_md(filepath: Path) -> AgentInfo | None:
    """Parse agent markdown file to extract structured info."""
    content = filepath.read_text(encoding="utf-8")

    yaml_match = re.search(r"```yaml\s*\n(.+?)```", content, re.DOTALL)
    if not yaml_match:
        return None

    try:
        data = yaml.safe_load(yaml_match.group(1))
    except yaml.YAMLError:
        return None

    if not isinstance(data, dict):
        return None

    agent_data = data.get("agent", data)
    name = agent_data.get("name", filepath.stem)
    agent_id = agent_data.get("id", filepath.stem)
    tier_raw = str(agent_data.get("tier", "1"))
    tier = _TIER_MAP.get(tier_raw, AgentTier.TIER_1)

    commands = []
    raw_commands = data.get("commands", [])
    if isinstance(raw_commands, list):
        for cmd in raw_commands:
            if isinstance(cmd, dict):
                commands.append({
                    "name": cmd.get("name", ""),
                    "description": cmd.get("description", ""),
                    "args": cmd.get("args", ""),
                })

    expertise = []
    persona = data.get("persona_profile", data.get("persona", {}))
    if isinstance(persona, dict):
        domains = persona.get("expertise_domains", {})
        if isinstance(domains, dict):
            expertise = domains.get("primary", []) + domains.get("secondary", [])
        elif isinstance(domains, list):
            expertise = domains

    description = ""
    if isinstance(persona, dict):
        description = persona.get("background", agent_data.get("whenToUse", ""))

    return AgentInfo(
        agent_id=agent_id,
        name=name,
        title=agent_data.get("title", name),
        icon=agent_data.get("icon", ""),
        tier=tier,
        squad="legal-analyst",
        description=str(description)[:300],
        commands=commands,
        expertise_domains=expertise if isinstance(expertise, list) else [],
    )


def load_all_agents() -> list[AgentInfo]:
    """Load all agents from the squad agents directory."""
    agents = []
    if not AGENTS_DIR.exists():
        return agents
    for md_file in sorted(AGENTS_DIR.glob("*.md")):
        agent = _parse_agent_md(md_file)
        if agent:
            agents.append(agent)
    return agents


def load_agent(agent_id: str) -> AgentInfo | None:
    """Load a specific agent by ID."""
    filepath = AGENTS_DIR / f"{agent_id}.md"
    if filepath.exists():
        return _parse_agent_md(filepath)
    for md_file in AGENTS_DIR.glob("*.md"):
        agent = _parse_agent_md(md_file)
        if agent and agent.agent_id == agent_id:
            return agent
    return None


def get_agent_full_prompt(agent_id: str) -> str:
    """Get the complete agent definition as prompt text."""
    filepath = AGENTS_DIR / f"{agent_id}.md"
    if not filepath.exists():
        for md_file in AGENTS_DIR.glob("*.md"):
            if md_file.stem == agent_id:
                filepath = md_file
                break
    if filepath.exists():
        return filepath.read_text(encoding="utf-8")
    return ""


def load_workflow(workflow_id: str) -> dict | None:
    """Load a workflow YAML definition."""
    for wf_file in WORKFLOWS_DIR.glob("*.yaml"):
        if workflow_id in wf_file.stem:
            content = wf_file.read_text(encoding="utf-8")
            return yaml.safe_load(content)
    return None


def load_knowledge_base() -> str:
    """Load the legal knowledge base for context enrichment."""
    kb_file = DATA_DIR / "legal-kb.md"
    if kb_file.exists():
        return kb_file.read_text(encoding="utf-8")
    return ""


def search_agents(query: str, agents: list[AgentInfo] | None = None) -> list[AgentInfo]:
    """Search agents by query matching name, description, or expertise."""
    if agents is None:
        agents = load_all_agents()
    query_lower = query.lower()
    results = []
    for agent in agents:
        score = 0
        if query_lower in agent.name.lower():
            score += 3
        if query_lower in agent.description.lower():
            score += 2
        for domain in agent.expertise_domains:
            if query_lower in str(domain).lower():
                score += 1
        if score > 0:
            results.append((score, agent))
    results.sort(key=lambda x: x[0], reverse=True)
    return [a for _, a in results]
