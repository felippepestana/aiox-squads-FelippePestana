#!/usr/bin/env python3
"""Generate the AIOX agents catalog in JSON, Markdown and PDF."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import textwrap
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE_GLOB = "squads/*/agents/*.md"
DEFAULT_EXPORTS_DIR = ROOT / "exports"
SCHEMA_VERSION = "2.0.0"

STOPWORDS = {
    "para",
    "com",
    "como",
    "the",
    "and",
    "that",
    "this",
    "from",
    "into",
    "quando",
    "sempre",
    "nunca",
    "deve",
    "then",
    "inclua",
    "liste",
    "use",
}
SKILL_KEYWORDS = {
    "análise": "Análise especializada",
    "auditoria": "Auditoria e revisão",
    "avaliação": "Avaliação e diagnóstico",
    "compliance": "Compliance e conformidade",
    "conteúdo": "Estratégia e curadoria de conteúdo",
    "design": "Design e experiência do usuário",
    "document": "Documentação e síntese",
    "educ": "Design instrucional e educação",
    "frontend": "Engenharia frontend",
    "juríd": "Análise jurídica/processual",
    "motion": "Motion e interação",
    "performance": "Performance e otimização",
    "pesquisa": "Pesquisa e investigação",
    "process": "Mapeamento e melhoria de processos",
    "qualidade": "Quality gates e validação",
    "rote": "Roteamento e orquestração",
    "seo": "SEO e visibilidade orgânica",
    "teste": "Testes e validação",
    "visual": "Qualidade visual",
}


def section_text(yaml_text: str, section: str) -> str:
    pattern = rf"^{re.escape(section)}:\n((?:  .*|\n)+)"
    match = re.search(pattern, yaml_text, flags=re.MULTILINE)
    return match.group(1) if match else ""


def simple_scalar(section: str, key: str) -> str:
    lines = section.splitlines()
    for index, line in enumerate(lines):
        match = re.match(rf"^  {re.escape(key)}:\s*(.*)$", line)
        if not match:
            continue
        value = match.group(1).strip()
        if value in {"|", ">"}:
            block: list[str] = []
            for block_line in lines[index + 1:]:
                if block_line.startswith("    "):
                    block.append(block_line[4:])
                elif not block_line.strip():
                    block.append("")
                else:
                    break
            return "\n".join(block).strip()
        return value.strip().strip("'\"")
    return ""


def simple_list(section: str, key: str) -> list[str]:
    lines = section.splitlines()
    for index, line in enumerate(lines):
        if not re.match(rf"^  {re.escape(key)}:\s*$", line):
            continue
        values: list[str] = []
        for list_line in lines[index + 1:]:
            item = re.match(r"^    -\s*(.*)$", list_line)
            if item:
                values.append(item.group(1).strip().strip("'\""))
            elif list_line.startswith("    ") or not list_line.strip():
                continue
            else:
                break
        return values
    return []


def fallback_yaml_data(yaml_text: str) -> dict[str, Any]:
    agent_section = section_text(yaml_text, "agent")
    persona_section = section_text(yaml_text, "persona")
    profile_section = section_text(yaml_text, "persona_profile")
    fallback = {
        "agent": {
            "name": simple_scalar(agent_section, "name"),
            "id": simple_scalar(agent_section, "id"),
            "title": simple_scalar(agent_section, "title"),
            "tier": simple_scalar(agent_section, "tier"),
            "icon": simple_scalar(agent_section, "icon"),
            "aliases": simple_list(agent_section, "aliases"),
            "whenToUse": simple_scalar(agent_section, "whenToUse"),
            "customization": simple_scalar(agent_section, "customization"),
        },
        "persona": {
            "role": simple_scalar(persona_section, "role"),
            "style": simple_scalar(persona_section, "style"),
            "identity": simple_scalar(persona_section, "identity"),
            "focus": simple_scalar(persona_section, "focus"),
        },
        "persona_profile": {
            "known_for": simple_list(profile_section, "known_for"),
        },
        "heuristics": re.findall(r'^  -\s*["\']?(.+?)["\']?\s*$', section_text(yaml_text, "heuristics"), flags=re.MULTILINE),
        "handoffs": re.findall(r'^  -\s*["\']?(.+?)["\']?\s*$', section_text(yaml_text, "handoffs"), flags=re.MULTILINE),
    }
    if "activation-instructions:" in yaml_text:
        fallback["activation-instructions"] = ["Definidas no arquivo do agente"]
    if "IDE-FILE-RESOLUTION:" in yaml_text:
        fallback["IDE-FILE-RESOLUTION"] = ["Definida no arquivo do agente"]
    if "REQUEST-RESOLUTION:" in yaml_text:
        fallback["REQUEST-RESOLUTION"] = "Definida no arquivo do agente"
    return fallback


def markdown_heading(markdown: str, heading: str) -> str:
    pattern = rf"^## {re.escape(heading)}\s*\n(.*?)(?=^## |\Z)"
    match = re.search(pattern, markdown, flags=re.MULTILINE | re.DOTALL)
    return match.group(1).strip() if match else ""


def fallback_markdown_data(markdown: str) -> dict[str, Any]:
    title_match = re.search(r"^# (?:Agent:\s*)?(.+)$", markdown, flags=re.MULTILINE)
    raw_title = title_match.group(1).strip() if title_match else ""
    clean_title = raw_title.split("—", 1)[0].strip() or raw_title
    slug = re.sub(r"[^a-z0-9]+", "-", clean_title.lower()).strip("-")
    tier_match = re.search(r"^## Tier:\s*(.+)$", markdown, flags=re.MULTILINE)
    responsibilities = markdown_heading(markdown, "Responsabilidades")
    heuristics = [item.strip() for item in re.findall(r"^-\s+(.+)$", markdown_heading(markdown, "Heurísticas"), flags=re.MULTILINE)]
    commands = [{"name": name.lstrip("*"), "description": description.strip()} for name, description in re.findall(r'^\s+"(\*[^"\n]+)":\n\s+description:\s+"?([^"\n]+)"?', markdown, flags=re.MULTILINE)]
    data = fallback_yaml_data(markdown)
    if not stringify(data.get("agent", {}).get("name")):
        data["agent"] = {
            "name": clean_title,
            "id": slug,
            "title": raw_title,
            "tier": tier_match.group(1).strip() if tier_match else "",
            "whenToUse": first_sentence(responsibilities or markdown_heading(markdown, "Saída Esperada") or markdown_heading(markdown, "Persona"), 240),
            "customization": responsibilities,
        }
    if not stringify(data.get("persona", {}).get("role")):
        data["persona"] = {
            "role": first_sentence(markdown_heading(markdown, "Persona"), 220),
            "focus": first_sentence(responsibilities or markdown_heading(markdown, "Saída Esperada"), 220),
        }
    if heuristics:
        data["heuristics"] = heuristics
    if commands:
        data["commands"] = commands
    if "activation-instructions:" in markdown:
        data["activation-instructions"] = ["Definidas no arquivo do agente"]
    if "IDE-FILE-RESOLUTION:" in markdown:
        data["IDE-FILE-RESOLUTION"] = ["Definida no arquivo do agente"]
    if "REQUEST-RESOLUTION:" in markdown:
        data["REQUEST-RESOLUTION"] = "Definida no arquivo do agente"
    return data


def read_embedded_yaml(markdown: str) -> dict[str, Any]:
    match = re.search(r"```yaml\n(.*?)\n```", markdown, flags=re.DOTALL)
    if not match:
        return fallback_markdown_data(markdown)
    yaml_text = match.group(1)
    try:
        loaded = yaml.safe_load(yaml_text)
    except yaml.YAMLError:
        return fallback_yaml_data(yaml_text)
    return loaded if isinstance(loaded, dict) else fallback_yaml_data(yaml_text)


def as_list(value: Any) -> list[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def stringify(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return " ".join(value.split())
    if isinstance(value, dict):
        return "; ".join(f"{key}: {stringify(val)}" for key, val in value.items())
    if isinstance(value, list):
        return "; ".join(stringify(item) for item in value)
    return str(value)


def text_list(value: Any) -> list[str]:
    return [stringify(item) for item in as_list(value) if stringify(item)]


def first_sentence(value: Any, limit: int = 220) -> str:
    text = stringify(value)
    if not text:
        return ""
    sentence_match = re.match(r"(.{20,}?[.!?])\s", text)
    sentence = sentence_match.group(1) if sentence_match else text
    return textwrap.shorten(sentence, width=limit, placeholder="...")


def iter_command_items(commands: Any) -> list[tuple[str, Any]]:
    if isinstance(commands, dict):
        return [(str(name), details) for name, details in commands.items()]
    items: list[tuple[str, Any]] = []
    for command in as_list(commands):
        if isinstance(command, dict):
            name = command.get("name") or command.get("command") or command.get("key")
            if name:
                items.append((str(name), command))
        elif isinstance(command, str):
            items.append((command, {}))
    return items


def command_names(commands: Any, markdown: str) -> list[str]:
    names = [name.lstrip("*") for name, _details in iter_command_items(commands)]
    for name in re.findall(r"`\*([^`\s]+)`", markdown):
        names.append(name.lstrip("*"))
    return sorted(dict.fromkeys(name for name in names if name))


def command_details(commands: Any, markdown: str) -> list[dict[str, str]]:
    details: list[dict[str, str]] = []
    for name, command in iter_command_items(commands):
        description = ""
        if isinstance(command, dict):
            description = stringify(command.get("description") or command.get("desc") or command.get("purpose"))
        details.append({"name": name.lstrip("*"), "description": description})
    known = {item["name"] for item in details}
    for name in command_names(commands, markdown):
        if name not in known:
            details.append({"name": name, "description": "Comando referenciado na definição do agente."})
    return details

def expertise_domains(profile: dict[str, Any]) -> dict[str, Any]:
    domains = profile.get("expertise_domains")
    return domains if isinstance(domains, dict) else {}


def infer_skills(agent: dict[str, Any], persona: dict[str, Any], profile: dict[str, Any], data: dict[str, Any]) -> list[str]:
    domains = expertise_domains(profile)
    explicit = text_list(domains.get("primary")) + text_list(domains.get("secondary")) + text_list(data.get("skills")) + text_list(data.get("capabilities"))
    if explicit:
        return sorted(dict.fromkeys(explicit))[:16]
    corpus = " ".join([stringify(agent.get("title")), stringify(agent.get("whenToUse")), stringify(agent.get("customization")), stringify(persona.get("role")), stringify(persona.get("focus")), stringify(data.get("heuristics"))]).lower()
    inferred: list[str] = []
    for key, label in SKILL_KEYWORDS.items():
        if key in corpus:
            inferred.append(label)
    focus = stringify(persona.get("focus"))
    if focus:
        inferred.append(first_sentence(focus, 120))
    role = stringify(persona.get("role"))
    tokens = [token for token in re.split(r"[^A-Za-zÀ-ÿ0-9]+", role) if len(token) > 5 and token.lower() not in STOPWORDS]
    if tokens:
        inferred.append("Especialização em " + ", ".join(tokens[:4]))
    return sorted(dict.fromkeys(item for item in inferred if item))[:10]


def interaction_summary(data: dict[str, Any], commands: list[dict[str, str]]) -> dict[str, Any]:
    handoffs = text_list(data.get("handoffs"))
    modes: list[str] = []
    if bool(data.get("activation-instructions")):
        modes.append("Ativação via instruções do próprio agente")
    if commands:
        modes.append("Comandos `*...` declarados ou referenciados")
    if handoffs:
        modes.append("Handoffs/delegações entre agentes")
    if bool(data.get("IDE-FILE-RESOLUTION")):
        modes.append("Execução sob demanda de tasks/templates/checklists/workflows do squad")
    if bool(data.get("REQUEST-RESOLUTION")):
        modes.append("Roteamento flexível por intenção do usuário")
    return {
        "activation_instructions": bool(data.get("activation-instructions")),
        "commands_defined": bool(commands),
        "handoffs_defined": bool(handoffs),
        "dependencies_resolution": bool(data.get("IDE-FILE-RESOLUTION")),
        "request_resolution": bool(data.get("REQUEST-RESOLUTION")),
        "modes": modes or ["Interação por prompt direto com base na persona do agente"],
        "handoffs": handoffs,
    }


def build_catalog(source_glob: str, generated_at: str) -> dict[str, Any]:
    agent_paths = sorted(ROOT.glob(source_glob))
    agents: list[dict[str, Any]] = []
    warnings: list[str] = []
    for path in agent_paths:
        markdown = path.read_text(encoding="utf-8")
        data = read_embedded_yaml(markdown)
        if not data:
            warnings.append(f"{path.relative_to(ROOT)}: YAML ausente ou inválido")
        squad = path.parts[path.parts.index("squads") + 1] if "squads" in path.parts else "unknown"
        agent = data.get("agent", {}) if isinstance(data.get("agent"), dict) else {}
        persona = data.get("persona", {}) if isinstance(data.get("persona"), dict) else {}
        profile = data.get("persona_profile", {}) if isinstance(data.get("persona_profile"), dict) else {}
        commands = command_details(data.get("commands") or data.get("command_loader"), markdown)
        agent_id = stringify(agent.get("id")) or path.stem
        domains = expertise_domains(profile)
        agents.append({
            "squad": squad,
            "source_file": str(path.relative_to(ROOT)),
            "agent_id": agent_id,
            "name": stringify(agent.get("name")) or agent_id,
            "title": stringify(agent.get("title")),
            "tier": stringify(agent.get("tier")),
            "icon": stringify(agent.get("icon")),
            "aliases": text_list(agent.get("aliases")),
            "purpose": {
                "when_to_use": stringify(agent.get("whenToUse")),
                "role": stringify(persona.get("role")),
                "focus": stringify(persona.get("focus")),
                "summary": first_sentence(agent.get("whenToUse") or persona.get("focus") or persona.get("role")),
            },
            "skills": {
                "capabilities": infer_skills(agent, persona, profile, data),
                "primary_expertise": text_list(domains.get("primary")),
                "secondary_expertise": text_list(domains.get("secondary")),
                "heuristics": text_list(data.get("heuristics")),
                "known_for": text_list(profile.get("known_for")),
                "core_principles": text_list(persona.get("core_principles")),
            },
            "interaction": interaction_summary(data, commands),
            "commands": commands,
            "quality": {
                "has_yaml": bool(data),
                "has_purpose": bool(agent.get("whenToUse") or persona.get("focus")),
                "has_interaction_metadata": bool(commands or data.get("handoffs") or data.get("activation-instructions")),
            },
        })
    squads: dict[str, Any] = {}
    for record in agents:
        squad = squads.setdefault(record["squad"], {"id": record["squad"], "agent_count": 0, "agents": []})
        squad["agent_count"] += 1
        squad["agents"].append(record["agent_id"])
    return {
        "schema_version": SCHEMA_VERSION,
        "generated_at": generated_at,
        "source": {"pattern": source_glob, "agent_file_count": len(agent_paths)},
        "summary": {"total_agents": len(agents), "total_squads": len(squads)},
        "squads": [squads[key] for key in sorted(squads)],
        "agents": agents,
        "warnings": warnings,
    }


def bullet_list(items: list[str], empty: str = "Não declarado explicitamente.") -> list[str]:
    if not items:
        return [f"- {empty}"]
    return [f"- {item}" for item in items]


def render_markdown(catalog: dict[str, Any]) -> str:
    lines: list[str] = [
        "# Catálogo de Agentes AIOX Squads", "",
        f"> Export reprodutível gerado em **{catalog['generated_at']}** pelo script `scripts/export-agent-catalog.py`.", "",
        "## Visão geral", "",
        f"- **Schema**: `{catalog['schema_version']}`",
        f"- **Total de squads**: {catalog['summary']['total_squads']}",
        f"- **Total de agentes**: {catalog['summary']['total_agents']}",
        f"- **Fonte**: `{catalog['source']['pattern']}`", "",
        "## Resumo por squad", "", "| Squad | Agentes |", "|---|---:|",
    ]
    for squad in catalog["squads"]:
        lines.append(f"| `{squad['id']}` | {squad['agent_count']} |")
    lines += ["", "## Índice de agentes", "", "| Squad | Agente | Nome | Finalidade resumida |", "|---|---|---|---|"]
    for record in catalog["agents"]:
        lines.append(f"| `{record['squad']}` | `{record['agent_id']}` | {record['name']} | {record['purpose']['summary'] or 'Não informado.'} |")
    current_squad = None
    for record in catalog["agents"]:
        if current_squad != record["squad"]:
            current_squad = record["squad"]
            lines += ["", f"## Squad `{current_squad}`"]
        lines += ["", f"### {record['name']} (`{record['agent_id']}`)", "",
            f"- **Arquivo fonte**: `{record['source_file']}`",
            f"- **Título**: {record['title'] or 'Não informado.'}",
            f"- **Tier**: {record['tier'] or 'Não informado.'}",
            f"- **Aliases**: {', '.join(record['aliases']) if record['aliases'] else 'Não informado.'}", "",
            "#### Finalidade", "",
            f"- **Quando usar**: {record['purpose']['when_to_use'] or 'Não informado.'}",
            f"- **Papel**: {record['purpose']['role'] or 'Não informado.'}",
            f"- **Foco operacional**: {record['purpose']['focus'] or 'Não informado.'}", "",
            "#### Skills e capacidades", ""]
        lines += bullet_list(record["skills"]["capabilities"])
        lines += ["", "#### Heurísticas relevantes", ""]
        heuristics = record["skills"]["heuristics"]
        lines += bullet_list(heuristics[:12])
        if len(heuristics) > 12:
            lines.append(f"- ... mais {len(heuristics) - 12} heurística(s) no JSON.")
        lines += ["", "#### Meios de interação", ""]
        lines += bullet_list(record["interaction"]["modes"])
        if record["commands"]:
            lines += ["", "#### Comandos", ""]
            for command in record["commands"]:
                description = f" — {command['description']}" if command.get("description") else ""
                lines.append(f"- `*{command['name']}`{description}")
        if record["interaction"]["handoffs"]:
            lines += ["", "#### Handoffs", ""]
            lines += bullet_list(record["interaction"]["handoffs"][:8])
    if catalog["warnings"]:
        lines += ["", "## Warnings de geração", ""] + bullet_list(catalog["warnings"])
    return "\n".join(lines) + "\n"


def pdf_escape(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def write_simple_pdf(markdown: str, output_path: Path) -> None:
    page_width, page_height = 595, 842
    margin_x, margin_y = 42, 42
    line_height = 12
    max_lines = int((page_height - 2 * margin_y) / line_height)
    pages: list[list[str]] = [[]]
    for raw_line in markdown.splitlines():
        clean = raw_line.replace("`", "").replace("**", "")
        for line in textwrap.wrap(clean, width=105, replace_whitespace=False) or [""]:
            if len(pages[-1]) >= max_lines:
                pages.append([])
            pages[-1].append(line)
    objects: list[str] = []
    page_refs: list[int] = []
    for page in pages:
        stream_lines = ["BT", "/F1 8 Tf", f"{margin_x} {page_height - margin_y} Td", "12 TL"]
        for line in page:
            stream_lines.append(f"({pdf_escape(line)}) Tj")
            stream_lines.append("T*")
        stream_lines.append("ET")
        stream = "\n".join(stream_lines)
        content_id = len(objects) + 4
        page_id = len(objects) + 5
        objects.append(f"{content_id} 0 obj\n<< /Length {len(stream.encode('latin-1', errors='replace'))} >>\nstream\n{stream}\nendstream\nendobj\n")
        objects.append(f"{page_id} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {page_width} {page_height}] /Resources << /Font << /F1 3 0 R >> >> /Contents {content_id} 0 R >>\nendobj\n")
        page_refs.append(page_id)
    body_objects = [
        "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
        f"2 0 obj\n<< /Type /Pages /Kids [{' '.join(f'{ref} 0 R' for ref in page_refs)}] /Count {len(page_refs)} >>\nendobj\n",
        "3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    ] + objects
    pdf = "%PDF-1.4\n"
    offsets: list[int] = []
    for obj in body_objects:
        offsets.append(len(pdf.encode("latin-1", errors="replace")))
        pdf += obj
    xref_pos = len(pdf.encode("latin-1", errors="replace"))
    pdf += f"xref\n0 {len(body_objects) + 1}\n0000000000 65535 f \n"
    for offset in offsets:
        pdf += f"{offset:010d} 00000 n \n"
    pdf += f"trailer\n<< /Size {len(body_objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n"
    output_path.write_bytes(pdf.encode("latin-1", errors="replace"))


def write_readme(exports_dir: Path) -> None:
    readme = """# Exports do catálogo de agentes

Este diretório contém artefatos gerados a partir das definições de agentes em `squads/*/agents/*.md`.

## Arquivos

- `agentes-detalhado.json`: catálogo estruturado para integração, auditoria e automações.
- `agentes-detalhado.md`: versão editorial em Markdown para leitura humana.
- `agentes-detalhado.pdf`: versão portátil para download, impressão ou compartilhamento.

## Como regenerar

Execute a partir da raiz do repositório:

```bash
python scripts/export-agent-catalog.py
```

Para builds determinísticos, informe `--generated-at` ou defina `SOURCE_DATE_EPOCH`:

```bash
python scripts/export-agent-catalog.py --generated-at 2026-06-21T00:00:00+00:00
```

## Validações recomendadas

```bash
python -m json.tool exports/agentes-detalhado.json >/tmp/agentes-detalhado.validated.json
python scripts/validate-agent-catalog.py
```

## Estrutura do JSON

O JSON usa `schema_version` e contém:

- `source`: padrão de arquivos analisados.
- `summary`: totais globais.
- `squads`: resumo por squad.
- `agents`: lista normalizada com finalidade, skills, interação, comandos e qualidade de metadados.
- `warnings`: avisos de parse/geração.
"""
    (exports_dir / "README.md").write_text(readme, encoding="utf-8")


def default_generated_at() -> str:
    source_date_epoch = os.environ.get("SOURCE_DATE_EPOCH")
    if source_date_epoch:
        timestamp = dt.datetime.fromtimestamp(int(source_date_epoch), tz=dt.UTC)
        return timestamp.replace(microsecond=0).isoformat()
    return dt.datetime.now(dt.UTC).replace(microsecond=0).isoformat()


def main() -> None:
    parser = argparse.ArgumentParser(description="Export AIOX agent catalog")
    parser.add_argument("--source-glob", default=DEFAULT_SOURCE_GLOB)
    parser.add_argument("--exports-dir", default=str(DEFAULT_EXPORTS_DIR))
    parser.add_argument("--generated-at", default=default_generated_at())
    args = parser.parse_args()
    exports_dir = Path(args.exports_dir)
    if not exports_dir.is_absolute():
        exports_dir = ROOT / exports_dir
    exports_dir.mkdir(parents=True, exist_ok=True)
    catalog = build_catalog(args.source_glob, args.generated_at)
    markdown = render_markdown(catalog)
    (exports_dir / "agentes-detalhado.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (exports_dir / "agentes-detalhado.md").write_text(markdown, encoding="utf-8")
    write_simple_pdf(markdown, exports_dir / "agentes-detalhado.pdf")
    write_readme(exports_dir)


if __name__ == "__main__":
    main()
