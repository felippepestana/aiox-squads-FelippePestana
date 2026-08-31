#!/usr/bin/env python3
"""Validate generated AIOX agent catalog artifacts."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPORTS_DIR = ROOT / "exports"
JSON_PATH = EXPORTS_DIR / "agentes-detalhado.json"
MARKDOWN_PATH = EXPORTS_DIR / "agentes-detalhado.md"
PDF_PATH = EXPORTS_DIR / "agentes-detalhado.pdf"
README_PATH = EXPORTS_DIR / "README.md"
AGENT_GLOB = "squads/*/agents/*.md"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    catalog = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    source_count = len(list(ROOT.glob(AGENT_GLOB)))
    require(catalog["schema_version"] == "2.0.0", "unexpected schema_version")
    require(catalog["source"]["agent_file_count"] == source_count, "source count mismatch")
    require(catalog["summary"]["total_agents"] == len(catalog["agents"]), "agent total mismatch")
    require(catalog["summary"]["total_agents"] == source_count, "agent source mismatch")
    require(catalog["summary"]["total_squads"] == len(catalog["squads"]), "squad total mismatch")
    require(catalog["warnings"] == [], "catalog contains warnings")
    for path in [JSON_PATH, MARKDOWN_PATH, PDF_PATH, README_PATH]:
        require(path.exists(), f"missing artifact: {path}")
        require(path.stat().st_size > 0, f"empty artifact: {path}")
    print("agent catalog artifacts are valid")


if __name__ == "__main__":
    main()
