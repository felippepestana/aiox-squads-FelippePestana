const checklist = [
  "Receitas e despesas detalhadas, em tempo real (LC 131/2009)",
  "Licitações, contratos e convênios",
  "Folha/remuneração nominal (sem dados pessoais excedentes — LGPD)",
  "RREO e RGF (LRF art. 48/48-A)",
  "e-SIC funcional (transparência passiva)",
  "Dados abertos em formato aberto + API documentada (OpenAPI)",
  "Padrão mínimo SIAFIC (Decreto 10.540/2020)",
  "Acessibilidade WCAG 2.1 AA / ABNT NBR 17225:2025",
  "Linguagem cidadã em sumários (RREO/RGF)",
];

export default function TransparenciaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-fg">Transparência</h1>
        <p className="mt-1 max-w-3xl text-gray-600">
          Diagnóstico de conformidade e plano de reconstrução do Portal da Transparência, alinhado à
          LAI, LC 131/2009, SIAFIC, EBT/PNTP (CGU) e acessibilidade WCAG.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Checklist de conformidade</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {checklist.map((c, i) => (
            <li key={i} className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Roadmap: integração de dados abertos (CKAN), dashboards interativos por tema (execução
        orçamentária, licitações, pessoal) e auditoria automatizada de acessibilidade.
      </div>
    </div>
  );
}
