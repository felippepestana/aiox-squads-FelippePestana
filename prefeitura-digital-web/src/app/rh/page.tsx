const processos = [
  "Ingresso (concurso, nomeação, posse, exercício)",
  "Estágio probatório (3 anos) e avaliação de desempenho",
  "Férias, licenças e afastamentos",
  "Progressão/promoção; cargos em comissão e funções gratificadas",
  "Processo Administrativo Disciplinar (PAD)",
  "Aposentadoria via RPPS (IPAM)",
];

export default function RhPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-fg">Recursos Humanos (Semad)</h1>
        <p className="mt-1 max-w-3xl text-gray-600">
          Atos de pessoal e rotinas com conformidade legal, observância da LGPD e impacto na folha
          verificado contra o limite de pessoal da LRF.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Processos cobertos</h2>
        <ul className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
          {processos.map((p, i) => (
            <li key={i} className="rounded bg-gray-50 px-3 py-2">{p}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Roadmap: geração de atos de pessoal assinados (Lei 14.063), cálculo de prazos, conferência de
        folha e integração com eSocial, SIPREV e TCE-RO.
      </div>
    </div>
  );
}
