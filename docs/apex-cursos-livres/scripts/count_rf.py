import re, sys, collections
path = sys.argv[1]
rows = []
for line in open(path, encoding="utf-8"):
    m = re.match(r"\|\s*(RF-[A-Z]+-\d{3})\s*\|(.*)\|\s*([MSC])\s*\|\s*(\d)\*?\s*\|\s*$", line)
    if m:
        rows.append((m.group(1), m.group(3), int(m.group(4))))
ids = [r[0] for r in rows]
dups = [i for i, c in collections.Counter(ids).items() if c > 1]
mods = collections.OrderedDict()
for i, p, f in rows:
    mod = i.split("-")[1]
    d = mods.setdefault(mod, {"total":0,"M":0,"S":0,"C":0,"F1":0,"F2":0,"F3":0,"F4":0})
    d["total"] += 1; d[p] += 1; d[f"F{f}"] += 1
print("duplicates:", dups)
# check sequence continuity per module
byprefix = collections.defaultdict(list)
for i in ids:
    byprefix[i.rsplit("-",1)[0]].append(int(i.rsplit("-",1)[1]))
for k, v in byprefix.items():
    exp = list(range(1, len(v)+1))
    if sorted(v) != exp:
        print("GAP in", k, sorted(set(exp)-set(v)))
hdr = "| Módulo | Total | Must | Should | Could | Fase 1 | Fase 2 | Fase 3 | Fase 4 |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|"
print(hdr)
tot = collections.Counter()
for m, d in mods.items():
    print(f"| {m} | {d['total']} | {d['M']} | {d['S']} | {d['C']} | {d['F1']} | {d['F2']} | {d['F3']} | {d['F4']} |")
    tot.update(d)
print(f"| **Total** | **{tot['total']}** | **{tot['M']}** | **{tot['S']}** | **{tot['C']}** | **{tot['F1']}** | **{tot['F2']}** | **{tot['F3']}** | **{tot['F4']}** |")
