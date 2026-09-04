import Link from "next/link";

const modulos = [
  {
    href: "/contratacoes",
    icon: "📋",
    titulo: "Contratações (Lei 14.133)",
    desc: "ETP, Termo de Referência e Projeto Básico assistidos por IA, com pesquisa de preços (PNCP) e checagem orçamentária.",
    ativo: true,
  },
  {
    href: "/transparencia",
    icon: "🔍",
    titulo: "Transparência",
    desc: "Diagnóstico de conformidade (LAI/PNTP/EBT/WCAG) e plano de reconstrução do painel.",
    ativo: true,
  },
  {
    href: "/diario-oficial",
    icon: "📰",
    titulo: "Diário Oficial",
    desc: "Elaboração de atos por tipo/caderno e biblioteca de consulta (roadmap: publicação assinada).",
    ativo: true,
  },
  {
    href: "/rh",
    icon: "👥",
    titulo: "Recursos Humanos",
    desc: "Atos de pessoal, prazos e conformidade (roadmap: eSocial/SIPREV/ponto).",
    ativo: true,
  },
  {
    href: "/orcamento",
    icon: "💰",
    titulo: "Orçamento (eixo)",
    desc: "Execução do orçamento via SICONFI (RREO), mínimos constitucionais e limites da LRF.",
    ativo: true,
  },
  {
    href: "/contratacoes",
    icon: "🗂️",
    titulo: "Processo Administrativo (SEI)",
    desc: "Trâmite e despachos no padrão SEI (roadmap: integração mod-wssei).",
    ativo: false,
  },
];

export default function Home() {
  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-brand-fg">Gestão municipal, do orçamento à publicação.</h1>
        <p className="mt-2 max-w-3xl text-gray-600">
          Solução intuitiva para o poder executivo municipal, organizada em torno do eixo orçamentário e
          alinhada à Lei 14.133/2021, à LRF e à LGPD. Caso de referência: Porto Velho/RO.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modulos.map((m, i) => (
          <Link
            key={i}
            href={m.href}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span>{m.icon}</span>
              <span>{m.titulo}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{m.desc}</p>
            {!m.ativo && (
              <span className="mt-3 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                Roadmap
              </span>
            )}
          </Link>
        ))}
      </section>
    </div>
  );
}
