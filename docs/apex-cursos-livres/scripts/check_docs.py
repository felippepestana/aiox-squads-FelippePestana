#!/usr/bin/env python3
"""Consistency checks for the APEX documentation set (no third-party dependencies).

Checks:
  1. Relative links between files resolve.
  2. Every RF-<MOD>-NNN referenced anywhere is defined in 05-requisitos-funcionais.md.
  3. ADR-NNN (Doc 11), Q-NN (Doc 04) and B-NN (Doc 19) references point to defined ids.
  4. "Doc N §M" pointers resolve to a numbered heading in Doc N.

Usage: python3 scripts/check_docs.py        (exit code 1 if any check fails)
"""
from __future__ import annotations

import collections
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = {p.name: p.read_text(encoding="utf-8") for p in sorted(ROOT.glob("[0-9][0-9]-*.md"))}
DOCS["README.md"] = (ROOT / "README.md").read_text(encoding="utf-8")


def broken_links() -> list[str]:
    out = []
    for name, text in DOCS.items():
        for m in re.finditer(r"\]\(([^)#\s]+)(#[^)]*)?\)", text):
            href = m.group(1)
            if href.startswith(("http", "mailto:")):
                continue
            if not (ROOT / href).exists():
                out.append(f"{name}: broken link -> {href}")
    return out


def undefined_ids(pattern: str, defined: set[str], label: str) -> list[str]:
    used: dict[str, set[str]] = collections.defaultdict(set)
    for name, text in DOCS.items():
        for ident in re.findall(pattern, text):
            used[ident].add(name)
    return [f"{label} {i} used in {sorted(v)} but not defined" for i, v in sorted(used.items()) if i not in defined]


def section_pointers() -> list[str]:
    heads: dict[str, set[str]] = {}
    for name, text in DOCS.items():
        if name[:2].isdigit():
            heads[name[:2]] = {m.group(2) for m in re.finditer(r"^(#{2,4})\s+(\d+(?:\.\d+)*)[.\s·]", text, re.M)}
    out = []
    for name, text in DOCS.items():
        # Matches "Doc 11 §5.1", "Doc 11 (§5.1)" and "[Doc 11](11-arquitetura-tecnica.md) §5.1".
        for m in re.finditer(r"Docs?\s+(\d{1,2})(?:\]\([^)]*\))?\s*\(?\s*§\s*(\d+(?:\.\d+)*)", text):
            doc, sec = m.group(1).zfill(2), m.group(2)
            if doc in heads and sec not in heads[doc]:
                out.append(f"{name}: 'Doc {doc} §{sec}' has no matching heading")
    return sorted(set(out))


def main() -> int:
    rf_defined = set(re.findall(r"^\|\s*(RF-[A-Z]+-\d{3})\s*\|", DOCS["05-requisitos-funcionais.md"], re.M))
    adr_defined = set(re.findall(r"^\|\s*\*\*(ADR-\d{3})\*\*", DOCS["11-arquitetura-tecnica.md"], re.M))
    q_defined = set(re.findall(r"^\|\s*(Q-\d{2})\s*\|", DOCS["04-prd.md"], re.M))
    b_defined = set(re.findall(r"^\|\s*(B-\d{2})\s*\|", DOCS["19-roadmap-backlog-equipe.md"], re.M))

    problems = (
        broken_links()
        + undefined_ids(r"\bRF-[A-Z]+-\d{3}\b", rf_defined, "RF")
        + undefined_ids(r"\bADR-\d{3}\b", adr_defined, "ADR")
        + undefined_ids(r"\bQ-\d{2}\b", q_defined, "Q")
        + undefined_ids(r"\bB-\d{2}\b", b_defined, "B")
        + section_pointers()
    )
    print(f"RF defined: {len(rf_defined)} | ADR: {len(adr_defined)} | Q: {len(q_defined)} | B: {len(b_defined)}")
    for p in problems:
        print("FAIL", p)
    print("OK: no problems found" if not problems else f"{len(problems)} problem(s) found")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
