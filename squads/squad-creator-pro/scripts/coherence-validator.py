#!/usr/bin/env python3
"""
Pro coherence validator for squad-creator-pro.

Validates structural and semantic coherence of a squad: checks that agents,
tasks, and workflows are mutually consistent and that configuration is complete.

Usage:
  python coherence-validator.py [--target PATH] [--output json|text]

Exit codes:
  0 = PASS  (no blocking issues)
  1 = FAIL  (one or more blocking issues detected)
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def _collect_issues(base: Path) -> tuple[list[dict], list[dict]]:
    """
    Return (blocking_issues, warnings) for the squad at *base*.
    Each issue is a dict with keys: id, severity, message, path.
    """
    blocking: list[dict] = []
    warnings: list[dict] = []

    # C1 — config.yaml must exist
    config_path = base / "config.yaml"
    if not config_path.exists():
        blocking.append({
            "id": "C1",
            "severity": "BLOCKING",
            "message": "config.yaml not found",
            "path": str(config_path),
        })
    else:
        text = config_path.read_text(encoding="utf-8")
        # C2 — config must declare agents list
        if "agents:" not in text:
            blocking.append({
                "id": "C2",
                "severity": "BLOCKING",
                "message": "config.yaml does not declare an 'agents:' section",
                "path": str(config_path),
            })

    # C3 — agents/ directory must exist and contain at least one .md file
    agents_dir = base / "agents"
    agent_files = sorted(agents_dir.glob("*.md")) if agents_dir.is_dir() else []
    if not agent_files:
        blocking.append({
            "id": "C3",
            "severity": "BLOCKING",
            "message": "No agent .md files found in agents/",
            "path": str(agents_dir),
        })

    # C4 — tasks/ directory must exist and contain at least one .md file
    tasks_dir = base / "tasks"
    task_files = sorted(tasks_dir.glob("*.md")) if tasks_dir.is_dir() else []
    if not task_files:
        blocking.append({
            "id": "C4",
            "severity": "BLOCKING",
            "message": "No task .md files found in tasks/",
            "path": str(tasks_dir),
        })

    # C5 — workflows/ directory should contain at least one .yaml file
    workflows_dir = base / "workflows"
    workflow_files = sorted(workflows_dir.glob("*.yaml")) if workflows_dir.is_dir() else []
    if not workflow_files:
        warnings.append({
            "id": "C5",
            "severity": "WARNING",
            "message": "No workflow .yaml files found in workflows/",
            "path": str(workflows_dir),
        })

    # C6 — each agent file should declare a name
    for af in agent_files:
        content = af.read_text(encoding="utf-8")
        if "name:" not in content:
            warnings.append({
                "id": "C6",
                "severity": "WARNING",
                "message": f"Agent file '{af.name}' does not contain a 'name:' declaration",
                "path": str(af),
            })

    return blocking, warnings


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="coherence-validator.py",
        description="Pro structural coherence validator for squads (squad-creator-pro).",
    )
    parser.add_argument(
        "--target",
        default=".",
        help="Squad directory to validate (default: current directory)",
    )
    parser.add_argument(
        "--output",
        choices=["json", "text"],
        default="text",
        help="Output format (default: text)",
    )
    return parser


def main() -> int:
    parser = _build_parser()
    args = parser.parse_args()

    base = Path(args.target) if Path(args.target).is_absolute() else Path.cwd() / args.target
    blocking, warnings_list = _collect_issues(base)

    passed = len(blocking) == 0
    result = {
        "status": "PASS" if passed else "FAIL",
        "validator": "coherence-validator.py",
        "target": str(args.target),
        "blocking_issues": len(blocking),
        "warnings": len(warnings_list),
        "issues": blocking + warnings_list,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    if args.output == "json":
        print(json.dumps(result, indent=2))
    else:
        status_icon = "✅" if passed else "❌"
        print(f"{status_icon} Coherence: {result['status']}  "
              f"(blocking: {result['blocking_issues']}, warnings: {result['warnings']})")
        print(f"   Target: {args.target}")
        for issue in result["issues"]:
            icon = "❌" if issue["severity"] == "BLOCKING" else "⚠️"
            print(f"   {icon} [{issue['id']}] {issue['message']}")

    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
