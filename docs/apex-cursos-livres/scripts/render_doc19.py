#!/usr/bin/env python3
"""Fills the BACKLOG block of 19-roadmap-backlog-equipe.md from backlog/backlog-fase1.csv.

Runs estimate_backlog.py first (coverage and effort checks); aborts if it fails.
Usage: python3 scripts/render_doc19.py
"""
from __future__ import annotations

import csv
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    res = subprocess.run([sys.executable, "-I", str(ROOT / "scripts" / "estimate_backlog.py")], capture_output=True, text=True)
    if res.returncode != 0:
        print(res.stderr, file=sys.stderr)
        return 1
    out = res.stdout
    first, rest = out.split("\n", 1)
    rest = rest.replace("### Esforço por épico", "#### Esforço por épico").replace("### Esforço × capacidade", "#### Esforço × capacidade")

    rows = list(csv.DictReader((ROOT / "backlog" / "backlog-fase1.csv").open(encoding="utf-8")))
    lines = ["| ID | Épico | História | Requisitos | Tam. | Núcleo |", "|---|---|---|---|:-:|:-:|"]
    for r in rows:
        reqs = ", ".join(x.replace("RF-", "") for x in r["requirements"].split(";") if x) or "—"
        lines.append(f"| {r['id']} | {r['epic']} | {r['title']} | {reqs} | {r['size']} | {'✔' if r['core'] == 'Y' else ''} |")
    stories = "\n".join(lines)

    mm = re.match(r"COVERAGE OK: (\d+) stories; (\d+)/(\d+) Phase 1 Must requirements covered; (\d+)/(\d+) Phase 1 Should covered", first)
    if not mm:
        print("ERROR: unexpected estimate_backlog output:", first, file=sys.stderr)
        return 1
    n, mc, mt, sc, st = mm.groups()
    block = (f"> Verificação automática (`scripts/estimate_backlog.py`): **{n} histórias; {mc}/{mt} requisitos *Must* da Fase 1 cobertos; {sc}/{st} *Should* da Fase 1 cobertos.**\n\n"
             "#### Histórias\n\n" + stories + "\n\n" + rest.strip() + "\n")
    path = ROOT / "19-roadmap-backlog-equipe.md"
    text = path.read_text(encoding="utf-8")
    pat = re.compile(r"(<!-- BACKLOG:START -->).*?(<!-- BACKLOG:END -->)", re.S)
    if not pat.search(text):
        print("ERROR: BACKLOG markers not found", file=sys.stderr)
        return 1
    path.write_text(pat.sub(lambda m: f"{m.group(1)}\n{block}{m.group(2)}", text), encoding="utf-8")
    print("19-roadmap-backlog-equipe.md rendered:", len(rows), "stories")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
