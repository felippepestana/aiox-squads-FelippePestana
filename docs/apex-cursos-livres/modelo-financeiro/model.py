#!/usr/bin/env python3
"""Illustrative 24-month financial model for APEX (see docs/apex-cursos-livres/17-negocio-financeiro.md).

EVERY INPUT BELOW IS AN ASSUMPTION TO BE REPLACED WITH REAL DATA. The model exists to
(1) make the business structure explicit, (2) show which levers matter (sensitivity) and
(3) tell what must be true to break even. It is NOT a forecast.

Usage:
    python3 model.py                 # prints the summary tables (markdown) and writes CSVs
    python3 model.py --out DIR       # choose the CSV output directory
"""
from __future__ import annotations

import argparse
import csv
import math
from dataclasses import dataclass, replace
from pathlib import Path

MONTHS = 24
# Timeline derived from the bottom-up backlog estimate (docs 04 and 19, scripts/estimate_backlog.py):
# Phase 1 totals 619 person-days; with 6 engineers at a 65% focus factor that is ~32 weeks, and the
# "core" needed for the first paid sale (492 person-days) is reached after ~25 weeks. Phase 0 = 6 weeks.
#   weeks 0-6   Phase 0     weeks 6-38  Phase 1 (first sale after week 31)
#   weeks 38-54 Phase 2     weeks 54-70 Phase 3     weeks 70-94 Phase 4
# => first sales in month 8; Phase 2 features modelled live from the middle of that phase (month 11)
# and Phase 3 features from the end of that phase (month 16).
BUILD_MONTHS = 7      # months 1-7: building, no revenue
F2_LIVE_MONTH = 11    # evergreen funnels, recovery, affiliates, APEX Pass
F3_LIVE_MONTH = 16    # sales/support agents, B2B
HEADCOUNT_BOUNDS = (9, 13, 17)  # last month of phases 0-1, 2, 3


@dataclass(frozen=True)
class Scenario:
    name: str
    # --- acquisition ---
    marketing_start: float      # BRL/month at the first selling month
    marketing_growth: float     # monthly growth of the budget
    marketing_cap: float        # BRL/month ceiling
    cpl: float                  # BRL per paid lead
    organic_start: float        # organic leads/month at first selling month
    organic_growth: float
    organic_cap: float
    conversion: float           # lead -> first purchase
    conv_uplift_f2: float       # multiplier from month F2_LIVE_MONTH (evergreen funnels, recovery)
    conv_uplift_f3: float       # multiplier from month F3_LIVE_MONTH (sales/recovery agents)
    # --- offer ---
    avg_price: float            # BRL, main product
    bump_rate: float
    bump_price: float
    upsell_rate: float
    upsell_price: float
    repeat_rate: float          # monthly share of past customers buying again
    refund_rate: float          # refunds inside 7 days, share of one-off gross
    chargeback_rate: float
    # --- subscription (APEX Pass) and B2B ---
    sub_start_month: int
    sub_adoption: float         # share of new customers who subscribe
    sub_price: float            # BRL/month
    sub_churn: float            # monthly
    b2b_start_month: int
    b2b_new_per_month: float
    b2b_mrr: float              # BRL/month per contract
    b2b_churn: float
    # --- variable costs ---
    tax_rate: float             # on net revenue (regime-dependent; placeholder)
    psp_pct: float
    psp_fixed: float            # BRL per transaction
    instructor_share: float     # share of (net revenue - PSP fees) paid to third-party instructors
    affiliate_start_month: int
    affiliate_sales_share: float
    affiliate_commission: float
    var_cost_per_active: float  # video + AI + live, BRL per active student per month
    tickets_per_active: float
    cost_per_ticket: float      # human-handled ticket
    ai_resolution_f1: float
    ai_resolution_f3: float     # from month F3_LIVE_MONTH
    # --- fixed costs ---
    team: tuple                 # headcount in phases 0-1, 2, 3 and 4 (6 of the 8 people of phase 0-1 are engineers)
    cost_per_head: float        # BRL/month, loaded
    tools_monthly: float
    legal_monthly: float
    delay: int = 0              # months added to the whole schedule (sensitivity)


def headcount(month: int, team: tuple) -> int:
    """Illustrative team size by phase (see doc 19): phases 0-1, 2, 3 and 4 (month bounds above)."""
    if month <= HEADCOUNT_BOUNDS[0]:
        return team[0]
    if month <= HEADCOUNT_BOUNDS[1]:
        return team[1]
    if month <= HEADCOUNT_BOUNDS[2]:
        return team[2]
    return team[3]


BASE = Scenario(
    name="base",
    marketing_start=30_000, marketing_growth=0.06, marketing_cap=150_000, cpl=12.0,
    organic_start=400, organic_growth=0.05, organic_cap=6_000,
    conversion=0.030, conv_uplift_f2=1.10, conv_uplift_f3=1.20,
    avg_price=147.0, bump_rate=0.15, bump_price=29.0, upsell_rate=0.08, upsell_price=97.0,
    repeat_rate=0.010, refund_rate=0.06, chargeback_rate=0.004,
    sub_start_month=F2_LIVE_MONTH, sub_adoption=0.04, sub_price=39.90, sub_churn=0.07,
    b2b_start_month=F3_LIVE_MONTH, b2b_new_per_month=1.0, b2b_mrr=2_500.0, b2b_churn=0.02,
    tax_rate=0.06, psp_pct=0.045, psp_fixed=1.50, instructor_share=0.30,
    affiliate_start_month=F2_LIVE_MONTH, affiliate_sales_share=0.20, affiliate_commission=0.30,
    var_cost_per_active=4.50, tickets_per_active=0.15, cost_per_ticket=8.0,
    ai_resolution_f1=0.30, ai_resolution_f3=0.60,
    team=(8, 10, 12, 14), cost_per_head=18_000.0, tools_monthly=20_000.0, legal_monthly=12_000.0,
)
CONSERVATIVE = replace(
    BASE, name="conservador", cpl=18.0, conversion=0.020, conv_uplift_f2=1.00, conv_uplift_f3=1.00,
    avg_price=127.0, refund_rate=0.08, repeat_rate=0.005, sub_adoption=0.02, sub_churn=0.10,
    organic_growth=0.03, b2b_new_per_month=0.5, ai_resolution_f3=0.45,
)
OPTIMISTIC = replace(
    BASE, name="otimista", cpl=9.0, conversion=0.045, conv_uplift_f2=1.15, conv_uplift_f3=1.30,
    avg_price=167.0, refund_rate=0.04, repeat_rate=0.015, sub_adoption=0.06, sub_churn=0.05,
    organic_growth=0.07, b2b_new_per_month=2.0, ai_resolution_f3=0.70,
)
# "What must be true": NOT a forecast. Every value below is a CONDITION to be proven by the Phase 0/1
# experiments (hypotheses H-01..H-06): the team stays at the 8 people needed to build Phase 1 (no growth
# to 14, because automation and buy-over-build replace headcount), higher-ticket tracks, and acquisition
# led by webinars, organic and affiliates.
TARGET = replace(
    BASE, name="alvo (enxuto)", team=(8, 8, 8, 8), avg_price=297.0, bump_rate=0.20, upsell_rate=0.12,
    cpl=9.0, conversion=0.045, conv_uplift_f2=1.10, conv_uplift_f3=1.20,
    organic_start=1_500, organic_growth=0.08, organic_cap=25_000,
    marketing_start=20_000, marketing_growth=0.05, marketing_cap=80_000,
    sub_adoption=0.08, sub_churn=0.05, repeat_rate=0.015, b2b_new_per_month=2.0,
    instructor_share=0.25, ai_resolution_f3=0.70,
)
SCENARIOS = (CONSERVATIVE, BASE, OPTIMISTIC, TARGET)


def simulate(s: Scenario) -> list[dict]:
    rows: list[dict] = []
    customers_total = 0.0
    new_history: list[float] = []
    sub_base = 0.0
    b2b_base = 0.0
    cumulative = 0.0

    build, f2, f3 = BUILD_MONTHS + s.delay, F2_LIVE_MONTH + s.delay, F3_LIVE_MONTH + s.delay
    for m in range(1, MONTHS + 1):
        selling = m > build
        k = m - build - 1  # months since the first selling month

        budget = min(s.marketing_cap, s.marketing_start * (1 + s.marketing_growth) ** k) if selling else 0.0
        paid_leads = budget / s.cpl if selling else 0.0
        organic = min(s.organic_cap, s.organic_start * (1 + s.organic_growth) ** k) if selling else 0.0
        leads = paid_leads + organic

        uplift = 1.0 if m < f2 else (s.conv_uplift_f2 if m < f3 else s.conv_uplift_f3)
        new_customers = leads * s.conversion * uplift
        repeat_orders = s.repeat_rate * customers_total if selling else 0.0
        orders = new_customers + repeat_orders

        per_order = s.avg_price + s.bump_rate * s.bump_price + s.upsell_rate * s.upsell_price
        gross_oneoff = orders * per_order

        new_subs = s.sub_adoption * new_customers if m >= s.sub_start_month + s.delay else 0.0
        sub_base = sub_base * (1 - s.sub_churn) + new_subs
        sub_revenue = sub_base * s.sub_price

        new_b2b = s.b2b_new_per_month if m >= s.b2b_start_month + s.delay else 0.0
        b2b_base = b2b_base * (1 - s.b2b_churn) + new_b2b
        b2b_revenue = b2b_base * s.b2b_mrr

        gross = gross_oneoff + sub_revenue + b2b_revenue
        refunds = s.refund_rate * gross_oneoff
        chargebacks = s.chargeback_rate * gross_oneoff
        net = gross - refunds - chargebacks

        taxes = s.tax_rate * net
        psp = s.psp_pct * (gross_oneoff + sub_revenue) + s.psp_fixed * (orders + sub_base)
        instructor = s.instructor_share * max(net - psp, 0.0)
        affiliate = s.affiliate_commission * s.affiliate_sales_share * gross_oneoff if m >= s.affiliate_start_month + s.delay else 0.0

        new_history.append(new_customers)
        recent = sum(new_history[-6:])
        active = 0.5 * recent + 0.5 * sub_base
        variable_infra = active * s.var_cost_per_active
        ai_rate = s.ai_resolution_f1 if m < f3 else s.ai_resolution_f3
        support = active * s.tickets_per_active * (1 - ai_rate) * s.cost_per_ticket

        contribution = net - taxes - psp - instructor - affiliate - variable_infra - support
        team = headcount(m - s.delay if m > s.delay else 1, s.team) * s.cost_per_head
        fixed = team + s.tools_monthly + s.legal_monthly
        result = contribution - budget - fixed
        cumulative += result
        customers_total += new_customers

        rows.append({
            "month": m, "leads": leads, "new_customers": new_customers, "orders": orders,
            "gross_revenue": gross, "refunds_chargebacks": refunds + chargebacks, "net_revenue": net,
            "taxes": taxes, "psp": psp, "instructor_share": instructor, "affiliates": affiliate,
            "variable_infra": variable_infra, "support": support, "contribution": contribution,
            "marketing": budget, "team": team, "fixed_other": s.tools_monthly + s.legal_monthly,
            "operating_result": result, "cumulative": cumulative,
            "sub_base": sub_base, "b2b_base": b2b_base, "active_students": active,
        })
    return rows


def check_invariants(s: Scenario, rows: list[dict]) -> None:
    run = 0.0
    for r in rows:
        for key, val in r.items():
            assert math.isfinite(val), (s.name, r["month"], key)
        if r["month"] <= BUILD_MONTHS + s.delay:
            assert r["gross_revenue"] == 0 and r["marketing"] == 0, "no revenue/marketing while building"
        run += r["operating_result"]
        assert abs(run - r["cumulative"]) < 1e-6, "cumulative must equal the running sum"
        parts = (r["taxes"] + r["psp"] + r["instructor_share"] + r["affiliates"]
                 + r["variable_infra"] + r["support"])
        assert abs(r["net_revenue"] - parts - r["contribution"]) < 1e-6, "contribution identity"
        assert abs(r["contribution"] - r["marketing"] - r["team"] - r["fixed_other"] - r["operating_result"]) < 1e-6
        assert r["new_customers"] >= 0 and r["sub_base"] >= 0


def unit_economics(s: Scenario, rows: list[dict]) -> dict:
    """CAC, LTV (12 months) and payback on a steady-state month (24)."""
    last = rows[-1]
    cac_blended = last["marketing"] / last["new_customers"] if last["new_customers"] else float("nan")
    paid_cac = s.cpl / (s.conversion * s.conv_uplift_f3)  # cost per customer acquired from paid leads
    per_order = s.avg_price + s.bump_rate * s.bump_price + s.upsell_rate * s.upsell_price
    # variable cost ratio on a one-off order (taxes, PSP, instructor, affiliates, refunds, chargebacks)
    net = per_order * (1 - s.refund_rate - s.chargeback_rate)
    psp = s.psp_pct * per_order + s.psp_fixed
    instr = s.instructor_share * (net - psp)
    aff = s.affiliate_commission * s.affiliate_sales_share * per_order
    first_contrib = net - s.tax_rate * net - psp - instr - aff
    # subscription contribution over 12 months with churn
    sub_unit = s.sub_price * (1 - s.tax_rate) - (s.psp_pct * s.sub_price + s.psp_fixed)
    sub_months = sum((1 - s.sub_churn) ** i for i in range(12))
    repeat = s.repeat_rate * 12 * first_contrib
    ltv12 = first_contrib + s.sub_adoption * sub_unit * sub_months + repeat
    def first_contribution(price: float) -> float:
        po = price + s.bump_rate * s.bump_price + s.upsell_rate * s.upsell_price
        n = po * (1 - s.refund_rate - s.chargeback_rate)
        ps = s.psp_pct * po + s.psp_fixed
        return n - s.tax_rate * n - ps - s.instructor_share * (n - ps) - s.affiliate_commission * s.affiliate_sales_share * po

    lo, hi = 1.0, 20_000.0
    for _ in range(80):  # bisection: lowest main-product price whose first order pays the paid CAC
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if first_contribution(mid) < paid_cac else (lo, mid)
    return {
        "min_price_first_order_payback": hi,
        "conv_needed_first_order_payback": s.cpl / first_contrib / s.conv_uplift_f3 if first_contrib > 0 else float("inf"),
        "first_order_contribution": first_contrib, "ltv12": ltv12, "cac_blended_m24": cac_blended,
        "cac_paid": paid_cac, "ltv_cac_paid": ltv12 / paid_cac if paid_cac else float("nan"),
        "payback_months_paid": paid_cac / first_contrib if first_contrib > 0 else float("inf"),
    }


def summary(s: Scenario, rows: list[dict]) -> dict:
    cum = [r["cumulative"] for r in rows]
    be = next((r["month"] for i, r in enumerate(rows) if all(x["operating_result"] >= 0 for x in rows[i:])), None)
    return {
        "scenario": s.name,
        "revenue_m12": rows[11]["gross_revenue"], "revenue_m24": rows[23]["gross_revenue"],
        "result_m12": rows[11]["operating_result"], "result_m24": rows[23]["operating_result"],
        "breakeven_month": be, "peak_funding": -min(cum), "cumulative_m24": cum[-1],
        "customers_total": sum(r["new_customers"] for r in rows),
        "contribution_margin_m24": rows[23]["contribution"] / rows[23]["net_revenue"] if rows[23]["net_revenue"] else float("nan"),
        # how many times the month-24 contribution would have to grow (same costs) to cover marketing + team + fixed
        "contribution_multiple_m24": (rows[23]["marketing"] + rows[23]["team"] + rows[23]["fixed_other"]) / rows[23]["contribution"],
        "team_cost_total": sum(r["team"] for r in rows),
    }


def tornado(base: Scenario) -> list[tuple[str, float, float, float, float]]:
    """One-at-a-time +/-20% sensitivity on result at month 24 and peak funding."""
    knobs = [
        ("CPL (custo por lead)", "cpl"), ("Conversão lead→compra", "conversion"), ("Ticket médio do produto", "avg_price"),
        ("Taxa de reembolso", "refund_rate"), ("Custo por pessoa da equipe", "cost_per_head"),
        ("Churn do APEX Pass", "sub_churn"), ("Repasse a instrutores", "instructor_share"),
        ("Leads orgânicos (início)", "organic_start"), ("Orçamento de mídia (início)", "marketing_start"),
    ]
    slip = replace(base, delay=3)
    slip_sum = summary(slip, simulate(slip))
    base_sum = summary(base, simulate(base))
    out = []
    for label, field in knobs:
        vals = []
        for factor in (0.8, 1.2):
            sc = replace(base, **{field: getattr(base, field) * factor})
            sm = summary(sc, simulate(sc))
            vals.append((sm["result_m24"], sm["peak_funding"]))
        out.append((label, vals[0][0] - base_sum["result_m24"], vals[1][0] - base_sum["result_m24"],
                    vals[0][1] - base_sum["peak_funding"], vals[1][1] - base_sum["peak_funding"]))
    bs = summary(base, simulate(base))
    out.append(("Atraso de 3 meses em todo o cronograma (+3 meses de equipe antes de vender)",
                slip_sum["result_m24"] - bs["result_m24"], 0.0, slip_sum["peak_funding"] - bs["peak_funding"], 0.0))
    out.sort(key=lambda t: -max(abs(t[1]), abs(t[2]), abs(t[3]) / 20, abs(t[4]) / 20))
    return out


def dec(x: float, d: int = 1) -> str:
    """Decimal with a comma, as in pt-BR."""
    return f"{x:.{d}f}".replace(".", ",")


def brl(x: float) -> str:
    sign = "-" if x < 0 else ""
    return f"{sign}R$ {abs(x):,.0f}".replace(",", ".")


def write_csv(path: Path, rows: list[dict]) -> None:
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        for r in rows:
            w.writerow({k: (round(v, 2) if isinstance(v, float) else v) for k, v in r.items()})


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(Path(__file__).parent))
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    results = {}
    for s in SCENARIOS:
        rows = simulate(s)
        check_invariants(s, rows)
        write_csv(out / f"cenario_{s.name.split()[0]}.csv", rows)  # "alvo (enxuto)" -> cenario_alvo.csv
        results[s.name] = (s, rows, summary(s, rows), unit_economics(s, rows))
    print("INVARIANTS OK for", ", ".join(results))

    print("\n### Resumo por cenário\n")
    print("| Indicador | " + " | ".join(results) + " |")
    print("|---|" + "---:|" * len(results))
    def line(label, fn):
        print(f"| {label} | " + " | ".join(fn(*results[n][2:]) for n in results) + " |")
    line("Receita bruta no mês 12", lambda sm, ue: brl(sm["revenue_m12"]))
    line("Receita bruta no mês 24", lambda sm, ue: brl(sm["revenue_m24"]))
    line("Resultado operacional no mês 12", lambda sm, ue: brl(sm["result_m12"]))
    line("Resultado operacional no mês 24", lambda sm, ue: brl(sm["result_m24"]))
    line("Margem de contribuição no mês 24", lambda sm, ue: f"{sm['contribution_margin_m24']*100:.0f}%")
    line("Mês de equilíbrio (sustentado)", lambda sm, ue: str(sm["breakeven_month"]) if sm["breakeven_month"] else "não atinge em 24 meses")
    line("Necessidade máxima de caixa (pico do déficit acumulado)", lambda sm, ue: brl(sm["peak_funding"]))
    line("Resultado acumulado em 24 meses", lambda sm, ue: brl(sm["cumulative_m24"]))
    line("Custo de equipe acumulado em 24 meses", lambda sm, ue: brl(sm["team_cost_total"]))
    line("Quantas vezes a contribuição do mês 24 precisaria crescer para empatar", lambda sm, ue: dec(sm['contribution_multiple_m24']) + "x")
    line("Clientes adquiridos em 24 meses", lambda sm, ue: f"{sm['customers_total']:,.0f}".replace(",", "."))

    print("\n### Economia unitária (mês 24, canal pago)\n")
    print("| Indicador | " + " | ".join(results) + " |")
    print("|---|" + "---:|" * len(results))
    line("Contribuição da 1ª compra (após reembolsos, taxas, repasse, afiliados)", lambda sm, ue: brl(ue["first_order_contribution"]))
    line("CAC do canal pago (CPL ÷ conversão)", lambda sm, ue: brl(ue["cac_paid"]))
    line("LTV em 12 meses (contribuição)", lambda sm, ue: brl(ue["ltv12"]))
    line("LTV/CAC (canal pago)", lambda sm, ue: dec(ue['ltv_cac_paid']))
    line("Payback na 1ª compra (meses; >1 = não paga na 1ª compra)", lambda sm, ue: dec(ue['payback_months_paid']))
    line("CAC misto no mês 24 (mídia ÷ novos clientes)", lambda sm, ue: brl(ue["cac_blended_m24"]))
    line("Preço mínimo do produto para a 1ª compra pagar o CAC pago", lambda sm, ue: brl(ue["min_price_first_order_payback"]))
    line("Conversão lead→compra necessária para a 1ª compra pagar o CAC pago", lambda sm, ue: dec(ue['conv_needed_first_order_payback']*100) + "%")

    print("\n### Sensibilidade (cenário base, variações de ±20%)\n")
    print("| Alavanca | Resultado m24 com −20% | Resultado m24 com +20% | Caixa de pico com −20% | Caixa de pico com +20% |")
    print("|---|---:|---:|---:|---:|")
    for label, a, b, c, d in tornado(BASE):
        print(f"| {label} | {a:+,.0f} | {b:+,.0f} | {c:+,.0f} | {d:+,.0f} |".replace(",", "."))
    print("\n(Valores são diferenças em R$ em relação ao cenário base. Na linha de atraso há só um cenário (+3 meses); a coluna de −20% mostra a diferença e a de +20% fica em zero.)")

    base_rows = results["base"][1]
    print("\n### Ponto de equilíbrio estático (receita bruta mensal necessária)\n")
    print("Fórmula: receita bruta necessária = custos fixos ÷ (margem de contribuição sobre a receita bruta − mídia como % da receita bruta).")
    print("Custos fixos = equipe × custo por pessoa + ferramentas + jurídico/contábil. Margem de contribuição observada no mês 24 de cada cenário.\n")
    print("| Equipe | Custos fixos/mês | Receita bruta necessária (margem do base, mídia 15%) | idem (margem do alvo, mídia 15%) | idem (margem do alvo, mídia 25%) | Primeiras compras/mês equivalentes (ticket do alvo) |")
    print("|---:|---:|---:|---:|---:|---:|")
    cm_base = results["base"][1][23]["contribution"] / results["base"][1][23]["gross_revenue"]
    cm_alvo = results["alvo (enxuto)"][1][23]["contribution"] / results["alvo (enxuto)"][1][23]["gross_revenue"]
    per_order_alvo = TARGET.avg_price + TARGET.bump_rate * TARGET.bump_price + TARGET.upsell_rate * TARGET.upsell_price
    for team in (4, 6, 8, 12, 14):
        fixed = team * BASE.cost_per_head + BASE.tools_monthly + BASE.legal_monthly
        r1 = fixed / (cm_base - 0.15)
        r2 = fixed / (cm_alvo - 0.15)
        r3 = fixed / (cm_alvo - 0.25)
        print(f"| {team} | {brl(fixed)} | {brl(r1)} | {brl(r2)} | {brl(r3)} | {r2 / per_order_alvo:,.0f} |".replace(",", "."))
    print(f"\n(Margem de contribuição sobre receita bruta no mês 24: base {cm_base*100:.0f}%, alvo {cm_alvo*100:.0f}%.)")

    print("\n### Premissas que distinguem os cenários\n")
    print("| Premissa | " + " | ".join(results) + " |")
    print("|---|" + "---:|" * len(results))
    def prem(label, fn):
        print(f"| {label} | " + " | ".join(fn(results[n][0]) for n in results) + " |")
    prem("Equipe (pessoas, fases 1/2/3/4)", lambda sc: "/".join(str(x) for x in sc.team))
    prem("CPL (R$/lead pago)", lambda sc: f"{sc.cpl:.0f}")
    prem("Conversão lead→compra", lambda sc: dec(sc.conversion*100) + "%")
    prem("Ticket do produto principal (R$)", lambda sc: f"{sc.avg_price:.0f}")
    prem("Leads orgânicos no início / crescimento mensal", lambda sc: f"{sc.organic_start:,.0f} / {sc.organic_growth*100:.0f}%".replace(",", "."))
    prem("Reembolso (7 dias)", lambda sc: f"{sc.refund_rate*100:.0f}%")
    prem("Adesão ao APEX Pass / churn mensal", lambda sc: f"{sc.sub_adoption*100:.0f}% / {sc.sub_churn*100:.0f}%")
    prem("Repasse a instrutores", lambda sc: f"{sc.instructor_share*100:.0f}%")
    prem(f"Resolução de tickets por IA (a partir do mês {F3_LIVE_MONTH})", lambda sc: f"{sc.ai_resolution_f3*100:.0f}%")

    print("\n### Cenário base — trimestres selecionados\n")
    print("| Mês | Leads | Novos clientes | Receita bruta | Contribuição | Marketing | Equipe + fixos | Resultado | Acumulado |")
    print("|---:|---:|---:|---:|---:|---:|---:|---:|---:|")
    for m in (8, 11, 14, 17, 20, 24):
        r = base_rows[m - 1]
        print(f"| {m} | {r['leads']:,.0f} | {r['new_customers']:,.0f} | {brl(r['gross_revenue'])} | {brl(r['contribution'])} | "
              f"{brl(r['marketing'])} | {brl(r['team'] + r['fixed_other'])} | {brl(r['operating_result'])} | {brl(r['cumulative'])} |".replace(",", "."))


if __name__ == "__main__":
    main()
