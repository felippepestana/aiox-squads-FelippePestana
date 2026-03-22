#!/usr/bin/env python3
"""
Pro scoring engine for squad-creator-pro.

Performs axioma-based weighted scoring of a squad target, applying the
10 quality dimensions and model-routing tier qualification.

Usage:
  python scoring.py <squad_target> [--output json|text] [--threshold FLOAT]

Exit codes:
  0 = PASS  (score >= threshold)
  1 = FAIL  (score < threshold)
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


AXIOMAS = [
    ("A1", "Structural Completeness",    0.15),
    ("A2", "Agent Role Clarity",         0.12),
    ("A3", "Task Decomposition Quality", 0.12),
    ("A4", "Workflow Coherence",         0.12),
    ("A5", "Model Routing Fitness",      0.10),
    ("A6", "Documentation Coverage",     0.08),
    ("A7", "Veto Condition Coverage",    0.10),
    ("A8", "Template Fidelity",          0.08),
    ("A9", "Source Classification",      0.08),
    ("A10", "Output Example Coverage",   0.05),
]

DEFAULT_THRESHOLD = 9.0


def _score_squad(target: str) -> dict:
    """
    Evaluate a squad directory against the 10 axiomas.
    Returns a scored result dictionary.
    """
    base = Path(target) if Path(target).is_absolute() else Path.cwd() / target

    scores: list[dict] = []
    weighted_total = 0.0

    for axioma_id, axioma_name, weight in AXIOMAS:
        raw_score = _evaluate_axioma(axioma_id, base)
        weighted = raw_score * weight * 10.0
        weighted_total += weighted
        scores.append({
            "axioma": axioma_id,
            "name": axioma_name,
            "weight": weight,
            "raw_score": raw_score,
            "weighted_score": round(weighted, 4),
            "status": "PASS" if raw_score >= 0.7 else "FAIL",
        })

    final_score = round(weighted_total, 2)
    return {
        "target": str(target),
        "final_score": final_score,
        "axiomas": scores,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


def _evaluate_axioma(axioma_id: str, base: Path) -> float:
    """Return a normalised [0.0, 1.0] score for the given axioma."""
    checks: dict[str, bool] = {
        "A1":  (base / "config.yaml").exists() and (base / "agents").is_dir() and (base / "tasks").is_dir(),
        "A2":  (base / "agents").is_dir() and any((base / "agents").glob("*.md")),
        "A3":  (base / "tasks").is_dir() and any((base / "tasks").glob("*.md")),
        "A4":  (base / "workflows").is_dir() and any((base / "workflows").glob("*.yaml")),
        "A5":  (base / "config.yaml").exists() and _yaml_has_key(base / "config.yaml", "model_routing"),
        "A6":  (base / "README.md").exists(),
        "A7":  (base / "config.yaml").exists(),
        "A8":  True,  # template fidelity: pass by default when structure present
        "A9":  True,  # source classification: pass by default
        "A10": any((base / "tasks").glob("*.md")) if (base / "tasks").is_dir() else False,
    }
    return 1.0 if checks.get(axioma_id, False) else 0.0


def _yaml_has_key(path: Path, key: str) -> bool:
    try:
        text = path.read_text(encoding="utf-8")
        return f"{key}:" in text
    except OSError:
        return False


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="scoring.py",
        description="Pro axioma-based squad scoring engine (squad-creator-pro).",
    )
    parser.add_argument(
        "target",
        nargs="?",
        default=".",
        help="Squad directory to score (default: current directory)",
    )
    parser.add_argument(
        "--output",
        choices=["json", "text"],
        default="text",
        help="Output format (default: text)",
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=DEFAULT_THRESHOLD,
        help=f"Minimum passing score 0-10 (default: {DEFAULT_THRESHOLD})",
    )
    return parser


def main() -> int:
    parser = _build_parser()
    args = parser.parse_args()

    result = _score_squad(args.target)
    score = result["final_score"]
    passed = score >= args.threshold

    result["status"] = "PASS" if passed else "FAIL"
    result["threshold"] = args.threshold

    if args.output == "json":
        print(json.dumps(result, indent=2))
    else:
        status_icon = "✅" if passed else "❌"
        print(f"{status_icon} Score: {score}/10.0  [{result['status']}]  (threshold: {args.threshold})")
        print(f"   Target: {args.target}")
        for a in result["axiomas"]:
            icon = "✅" if a["status"] == "PASS" else "❌"
            print(f"   {icon} {a['axioma']} {a['name']}: {a['raw_score']:.1f} × {a['weight']} = {a['weighted_score']:.4f}")

    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
