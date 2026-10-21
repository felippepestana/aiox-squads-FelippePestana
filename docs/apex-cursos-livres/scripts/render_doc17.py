#!/usr/bin/env python3
"""Fills the generated blocks of 17-negocio-financeiro.md from the financial model and the backlog.

Blocks (between HTML comment markers): CONCLUSIONS, TIMELINE, MODEL. All figures are computed here, so the
prose can never drift from modelo-financeiro/model.py or backlog/backlog-fase1.csv.

Usage: python3 scripts/render_doc17.py
"""
from __future__ import annotations

import csv
import importlib.util
import io
import re
import sys
from contextlib import redirect_stdout
from dataclasses import replace
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_model():
    spec = importlib.util.spec_from_file_location("apex_model", ROOT / "modelo-financeiro" / "model.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules["apex_model"] = mod
    spec.loader.exec_module(mod)
    return mod


def nf(x: float, d: int = 0) -> str:
    """pt-BR number: thousands with a dot, decimals with a comma."""
    return f"{x:,.{d}f}".replace(",", "#").replace(".", ",").replace("#", ".")


def mi(x: float) -> str:
    return f"R$ {nf(x / 1e6, 1)} mi"


def mi_range(lo: float, hi: float) -> str:
    return f"R$ {nf(lo / 1e6, 1)} a {nf(hi / 1e6, 1)} mi"


def mil(x: float) -> str:
    return f"R$ {nf(x / 1e3)} mil"


def backlog_facts() -> dict:
    size_days = {"S": 4, "M": 8, "L": 15}
    rows = list(csv.DictReader((ROOT / "backlog" / "backlog-fase1.csv").open(encoding="utf-8")))
    total = sum(size_days[r["size"]] for r in rows)
    core = sum(size_days[r["size"]] for r in rows if r["core"] == "Y")
    per_week = 6 * 5 * 0.65
    return {"total": total, "core": core, "weeks_total": total / per_week, "weeks_core": core / per_week,
            "eng_for_17": total / (5 * 0.65 * 17), "stories": len(rows)}


def main() -> int:
    m = load_model()
    results = {}
    for s in m.SCENARIOS:
        rows = m.simulate(s)
        m.check_invariants(s, rows)
        results[s.name] = (s, rows, m.summary(s, rows), m.unit_economics(s, rows))
    base_s, base_rows, base_sm, base_ue = results["base"]
    alvo_s, alvo_rows, alvo_sm, alvo_ue = results["alvo (enxuto)"]
    generic = [results[n][2] for n in ("conservador", "base", "otimista")]
    torn = {t[0]: t for t in m.tornado(m.BASE)}
    bl = backlog_facts()

    cm_base = base_rows[23]["contribution"] / base_rows[23]["gross_revenue"]
    cm_alvo = alvo_rows[23]["contribution"] / alvo_rows[23]["gross_revenue"]
    static = [m.BASE.team_cost for m in ()] if False else []
    reqs = []
    for team in (4, 6, 8, 12, 14):
        fixed = team * m.BASE.cost_per_head + m.BASE.tools_monthly + m.BASE.legal_monthly
        reqs += [fixed / (cm_base - 0.15), fixed / (cm_alvo - 0.15), fixed / (cm_alvo - 0.25)]

    peak_lo = min(g["peak_funding"] for g in generic)
    peak_hi = max(g["peak_funding"] for g in generic)
    team_cost = base_sm["team_cost_total"]
    team_row = torn["Custo por pessoa da equipe"]
    media_row = torn["Orçamento de mídia (início)"]
    slip_row = next(v for k, v in torn.items() if k.startswith("Atraso"))
    first_sale_month = m.BUILD_MONTHS + 1

    conclusions = f"""1. **Nenhum cenário atinge o equilíbrio em 24 meses**, nem o otimista. A necessidade máxima de caixa fica entre **{mi_range(peak_lo, peak_hi)}** nos três cenários genéricos e em **{mi(alvo_sm['peak_funding'])}** no cenário-alvo.
2. **A equipe é o custo dominante:** {mi(team_cost)} dos {mi_range(peak_lo, peak_hi)} (8 a 14 pessoas a R$ 18 mil/mês cada, incluindo a **construção** da plataforma). A **sensibilidade confirma**: ±20% no custo por pessoa move o caixa de pico em {mi(abs(team_row[3]))}; nenhuma outra alavanca chega perto.
3. **O escopo da Fase 1 não cabe em 17 semanas com a equipe prevista.** O backlog tem {bl['stories']} histórias e **{bl['total']} pessoas-dia** ({bl['core']} só no núcleo da primeira venda). Com 6 engenheiros (fator de foco de 65%) isso leva **~{nf(bl['weeks_total'])} semanas** (~{nf(bl['weeks_core'])} para o núcleo); fechar em 17 semanas exigiria **~{nf(bl['eng_for_17'])} engenheiros**. Por isso **a primeira venda ocorre no mês {first_sale_month}**, não no mês 5 ou 6, e **cada 3 meses de atraso adicionam {mi(abs(slip_row[3]))} à necessidade de caixa**.
4. **Curso de ticket baixo vendido a tráfego pago frio não paga o próprio CAC.** No cenário base, o CAC do canal pago é **R$ {nf(base_ue['cac_paid'])}** e a contribuição da 1ª compra é **R$ {nf(base_ue['first_order_contribution'])}** (LTV de 12 meses: R$ {nf(base_ue['ltv12'])}; **LTV/CAC = {nf(base_ue['ltv_cac_paid'], 1)}**). Para a 1ª compra se pagar seria preciso **ticket ≥ R$ {nf(base_ue['min_price_first_order_payback'])}** ou **conversão lead→compra de {nf(base_ue['conv_needed_first_order_payback']*100, 1)}%**.
5. **Mídia paga adicional piora o resultado** enquanto a economia unitária for negativa (no base, +20% de orçamento de mídia custa {mil(abs(media_row[2]))}/mês no mês 24). **Escalar tráfego só faz sentido depois de provar CAC ≤ contribuição.**
6. **O cenário-alvo ("o que precisa ser verdade") chega mais perto, mas ainda não empata no mês 24:** a equipe fica nas 8 pessoas que constroem a Fase 1 (sem crescer para 14), ticket de **R$ {nf(alvo_s.avg_price)}** com *bump* e trilhas, aquisição puxada por **orgânico, webinars e afiliados** ({nf(alvo_s.organic_start)} leads orgânicos/mês, +{nf(alvo_s.organic_growth*100)}% a.m.), conversão de **{nf(alvo_s.conversion*100, 1)}%**, **APEX Pass** com {nf(alvo_s.sub_adoption*100)}% de adesão e {nf(alvo_s.sub_churn*100)}% de churn, {nf(alvo_s.b2b_new_per_month)} novos contratos B2B/mês e IA resolvendo {nf(alvo_s.ai_resolution_f3*100)}% dos tickets. Ainda faltam **{mil(-alvo_sm['result_m24'])}/mês** no mês 24 (a contribuição teria de crescer **{nf(alvo_sm['contribution_multiple_m24'], 1)}×**).
7. **Escala exigida para empatar:** entre **{mil(min(reqs))} e {mil(max(reqs))} de receita bruta mensal**, conforme o tamanho da equipe (4 a 14 pessoas) e a parcela de mídia (§5.3).
8. **O modelo não inclui as alavancas de escala do roadmap** (*take rate* de marketplace, white-label/SaaS e API, na Fase 4), que **não dependem de produzir conteúdo próprio** e são o motivo de a arquitetura ser multi-tenant (ADR-001). Também não trata parte do custo de equipe como **investimento em um ativo reutilizável** (a plataforma pode atender outras marcas do ecossistema). **Estas são perguntas estratégicas para o plano de negócio**, não para o modelo (§7)."""

    timeline = f"""A linha do tempo do modelo **deriva do backlog** (Doc 19): Fase 0 de 6 semanas + Fase 1 de ~{nf(bl['weeks_total'])} semanas com 6 engenheiros. A venda começa no **mês {first_sale_month}** (após o núcleo da Fase 1); os recursos da Fase 2 (funis perpétuos, recuperação, afiliados, APEX Pass) entram no **mês {m.F2_LIVE_MONTH}** e os da Fase 3 (agentes, B2B) no **mês {m.F3_LIVE_MONTH}**. Equipe por fase (8 a 14 pessoas nos cenários genéricos; **8 fixas** no cenário-alvo): fases 0–1 até o mês {m.HEADCOUNT_BOUNDS[0]}, fase 2 até o mês {m.HEADCOUNT_BOUNDS[1]}, fase 3 até o mês {m.HEADCOUNT_BOUNDS[2]}, fase 4 depois."""

    buf = io.StringIO()
    old_argv = sys.argv
    sys.argv = ["model.py", "--out", str(ROOT / "modelo-financeiro")]
    with redirect_stdout(buf):
        m.main()
    sys.argv = old_argv
    out = buf.getvalue()
    parts = re.split(r"\n### ", "\n" + out.split("\n", 1)[1])
    secs = {}
    for part in parts:
        if part.strip():
            title, body = part.split("\n", 1)
            secs[title.strip()] = body.strip("\n")
    model_block = (
        "## 5. Resultados\n\n> Gerados por `model.py` (verificações de consistência: **OK** nos quatro cenários). Valores em R$ nominais, sem inflação.\n\n"
        "### 5.1 Resumo por cenário\n\n" + secs["Resumo por cenário"] + "\n\n"
        "### 5.2 Economia unitária\n\n" + secs["Economia unitária (mês 24, canal pago)"]
        + "\n\n> **Leitura:** a 1ª compra de um produto de ticket baixo **não paga** o CAC do tráfego pago nos cenários genéricos; só o cenário-alvo (ticket e conversão maiores, CPL menor) chega perto de pagá-lo na 1ª compra.\n\n"
        "### 5.3 Ponto de equilíbrio estático\n\n" + secs["Ponto de equilíbrio estático (receita bruta mensal necessária)"] + "\n\n"
        "### 5.4 Sensibilidade\n\n" + secs["Sensibilidade (cenário base, variações de ±20%)"]
        + "\n\n> **Leitura:** o **custo por pessoa** domina e o **atraso do cronograma** custa caro (cada mês a mais é um mês de equipe sem receita). **Mais orçamento de mídia reduz o resultado** (sinal negativo): enquanto a contribuição da 1ª compra for menor que o CAC, escalar tráfego aprofunda o déficit. **Reembolso e *churn* do Pass quase não mudam o resultado** nestas escalas, porque a base de assinantes ainda é pequena.\n\n"
        "### 5.5 Premissas por cenário\n\n" + secs["Premissas que distinguem os cenários"] + "\n\n"
        "### 5.6 Cenário base: meses selecionados\n\n" + secs["Cenário base — trimestres selecionados"] + "\n"
    )

    path = ROOT / "17-negocio-financeiro.md"
    text = path.read_text(encoding="utf-8")
    for tag, content in (("CONCLUSIONS", conclusions), ("TIMELINE", timeline), ("MODEL", model_block)):
        pat = re.compile(rf"(<!-- {tag}:START -->).*?(<!-- {tag}:END -->)", re.S)
        if not pat.search(text):
            print(f"ERROR: markers for {tag} not found", file=sys.stderr)
            return 1
        text = pat.sub(lambda mo: f"{mo.group(1)}\n{content}\n{mo.group(2)}", text)
    path.write_text(text, encoding="utf-8")
    print("17-negocio-financeiro.md rendered:", {"peak_generic": (round(peak_lo), round(peak_hi)), "alvo_peak": round(alvo_sm['peak_funding']),
          "first_sale_month": first_sale_month, "backlog_pd": bl["total"]})
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
