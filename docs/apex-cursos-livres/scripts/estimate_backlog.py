#!/usr/bin/env python3
"""Checks the Phase 1 backlog against the functional requirements and compares effort with capacity.

* Every requirement id in the backlog must exist in 05-requisitos-funcionais.md.
* Every Phase 1 *Must* requirement must be covered by at least one story (traceability).
* Effort uses rough person-day weights per t-shirt size and a focus factor; it is a planning
  aid to expose scope-versus-time risk, not a commitment.

Usage: python3 estimate_backlog.py [--engineers 6] [--weeks 17] [--focus 0.65]
"""
from __future__ import annotations

import argparse
import csv
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SIZE_DAYS = {"S": 4, "M": 8, "L": 15}


def load_requirements() -> dict[str, tuple[str, int]]:
    reqs = {}
    pat = re.compile(r"\|\s*(RF-[A-Z]+-\d{3})\s*\|(.*)\|\s*([MSC])\s*\|\s*(\d)\*?\s*\|\s*$")
    for line in (ROOT / "05-requisitos-funcionais.md").read_text(encoding="utf-8").splitlines():
        m = pat.match(line)
        if m:
            reqs[m.group(1)] = (m.group(3), int(m.group(4)))
    return reqs


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--engineers", type=float, default=6)
    ap.add_argument("--weeks", type=float, default=17)
    ap.add_argument("--focus", type=float, default=0.65)
    args = ap.parse_args()

    reqs = load_requirements()
    stories = list(csv.DictReader((ROOT / "backlog" / "backlog-fase1.csv").open(encoding="utf-8")))
    errors: list[str] = []
    covered: set[str] = set()
    ids_seen: set[str] = set()
    for st in stories:
        if st["id"] in ids_seen:
            errors.append(f"duplicate story id {st['id']}")
        ids_seen.add(st["id"])
        if st["size"] not in SIZE_DAYS:
            errors.append(f"{st['id']}: invalid size {st['size']}")
        for rid in filter(None, st["requirements"].split(";")):
            if rid not in reqs:
                errors.append(f"{st['id']}: unknown requirement {rid}")
            else:
                covered.add(rid)
    f1_must = sorted(r for r, (p, f) in reqs.items() if f == 1 and p == "M")
    f1_should = sorted(r for r, (p, f) in reqs.items() if f == 1 and p == "S")
    missing_must = [r for r in f1_must if r not in covered]
    missing_should = [r for r in f1_should if r not in covered]
    off_phase = sorted(r for r in covered if reqs[r][1] != 1)
    if missing_must:
        errors.append("Phase 1 Must requirements without a story: " + ", ".join(missing_must))
    if errors:
        print("\n".join("ERROR: " + e for e in errors), file=sys.stderr)
        return 1

    print(f"COVERAGE OK: {len(stories)} stories; {len(f1_must)}/{len(f1_must)} Phase 1 Must requirements covered; "
          f"{len(f1_should) - len(missing_should)}/{len(f1_should)} Phase 1 Should covered"
          + (f"; Should without story: {', '.join(missing_should)}" if missing_should else "")
          + (f"; stories also touching other phases: {', '.join(off_phase)}" if off_phase else ""))

    def days(group):
        return sum(SIZE_DAYS[s["size"]] for s in group)

    by_epic: dict[str, list] = defaultdict(list)
    for st in stories:
        by_epic[st["epic"]].append(st)
    core = [s for s in stories if s["core"] == "Y"]
    rest = [s for s in stories if s["core"] != "Y"]
    capacity_per_week = args.engineers * 5 * args.focus
    capacity = capacity_per_week * args.weeks

    print("\n### Esforço por épico\n")
    print("| Épico | Histórias | S | M | L | Pessoas-dia | Núcleo (pessoas-dia) |")
    print("|---|---:|---:|---:|---:|---:|---:|")
    for ep in sorted(by_epic):
        g = by_epic[ep]
        n = lambda sz: sum(1 for s in g if s["size"] == sz)
        print(f"| {ep} | {len(g)} | {n('S')} | {n('M')} | {n('L')} | {days(g)} | {days([s for s in g if s['core'] == 'Y'])} |")
    n = lambda grp, sz: sum(1 for s in grp if s["size"] == sz)
    print(f"| **Total** | **{len(stories)}** | **{n(stories,'S')}** | **{n(stories,'M')}** | **{n(stories,'L')}** | **{days(stories)}** | **{days(core)}** |")

    print("\n### Esforço × capacidade\n")
    print(f"Pesos: S = {SIZE_DAYS['S']}, M = {SIZE_DAYS['M']}, L = {SIZE_DAYS['L']} pessoas-dia. "
          f"Capacidade = engenheiros × 5 dias × fator de foco ({args.focus:.0%}).\n")
    print("| Escopo | Pessoas-dia | Engenheiros | Capacidade em 17 semanas | Semanas necessárias | Engenheiros para 17 semanas |")
    print("|---|---:|---:|---:|---:|---:|")
    for label, grp in (("Fase 1 completa", stories), ("Somente o núcleo (primeira venda e entrega)", core), ("Fora do núcleo", rest)):
        d = days(grp)
        for eng in (args.engineers, 4):
            cap = eng * 5 * args.focus * args.weeks
            weeks_needed = d / (eng * 5 * args.focus)
            eng_for_17 = d / (5 * args.focus * args.weeks)
            print(f"| {label} | {d} | {eng:.0f} | {cap:.0f} | {weeks_needed:.0f} | {eng_for_17:.1f} |")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
