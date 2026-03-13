import { useState, useEffect, useRef } from "react";
import {
  Scale,
  Shield,
  Zap,
  FileText,
  Users,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Star,
  Clock,
  BarChart3,
  Brain,
  Lock,
  Play,
  X,
} from "lucide-react";

interface VSLPageProps {
  onAccessApp: () => void;
}

const API_BASE = "/api";

interface Plan {
  name: string;
  price_monthly: number;
  analyses_per_month: number;
  agents: number;
  features: string[];
}

export default function VSLPage({ onAccessApp }: VSLPageProps) {
  const [plans, setPlans] = useState<Record<string, Plan>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [email, setEmail] = useState("");
  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/stripe/plans`)
      .then((r) => r.json())
      .then(setPlans)
      .catch(() => {});
  }, []);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCheckout = async (planKey: string) => {
    setLoading(planKey);
    try {
      const res = await fetch(`${API_BASE}/stripe/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, customer_email: email }),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch {
      alert("Erro ao processar. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  const testimonials = [
    {
      name: "Dr. Ricardo Almeida",
      role: "Advogado Tributarista",
      text: "Reduzi o tempo de analise processual de 3 dias para 2 horas. A jurimetria dos agentes e impressionante.",
      stars: 5,
    },
    {
      name: "Dra. Camila Santos",
      role: "Escritorio Santos & Associados",
      text: "Os 15 agentes especializados sao como ter uma equipe inteira de pesquisadores. ROI absurdo.",
      stars: 5,
    },
    {
      name: "Dr. Fernando Costa",
      role: "Procurador Federal",
      text: "A fundamentacao CPC Art. 489 automatica economiza horas. Ferramenta essencial para qualquer jurista.",
      stars: 5,
    },
  ];

  const faqs = [
    {
      q: "Como funciona a inteligencia artificial?",
      a: "Utilizamos 15 agentes de IA especializados, cada um modelado com base em expertise de grandes juristas brasileiros. Eles analisam processos, pesquisam jurisprudencia, constroem estrategias e validam fundamentacoes automaticamente.",
    },
    {
      q: "Meus documentos estao seguros?",
      a: "Sim. Todos os documentos sao processados com criptografia end-to-end. Nao armazenamos seus PDFs apos o processamento. Conformidade total com LGPD.",
    },
    {
      q: "Posso cancelar a qualquer momento?",
      a: "Sim. Sem fidelidade. Cancele quando quiser direto pelo painel. Seu acesso continua ate o fim do periodo pago.",
    },
    {
      q: "Quais tipos de processo sao suportados?",
      a: "Todos os tipos: civel, trabalhista, tributario, penal, administrativo, constitucional. O sistema classifica automaticamente via TPU/SGT do CNJ.",
    },
    {
      q: "Preciso de conhecimento tecnico?",
      a: "Nao. Basta fazer upload do PDF e descrever em linguagem natural o que precisa. Os agentes fazem todo o trabalho pesado.",
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#111827] to-[#0a0e1a]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
        </div>

        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Legal Analyst</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#como-funciona" className="hover:text-white transition">Como Funciona</a>
            <a href="#agentes" className="hover:text-white transition">Agentes</a>
            <a href="#pricing" className="hover:text-white transition">Planos</a>
            <button
              onClick={onAccessApp}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition"
            >
              Acessar App
            </button>
          </div>
        </nav>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-8">
            <Zap className="w-4 h-4" />
            <span>15 Agentes de IA Especializados em Direito Brasileiro</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Analise Processual com
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              {" "}Inteligencia Artificial
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Transforme horas de trabalho em minutos. Upload do PDF, descricao em linguagem natural
            e 15 agentes especializados entregam analise completa: classificacao, jurisprudencia,
            estrategia, fundamentacao e validacao CNJ.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={scrollToPricing}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all flex items-center gap-2"
            >
              Comecar Agora
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowVideo(true)}
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Ver Demonstracao
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>LGPD Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-500" />
              <span>Criptografia End-to-End</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOCIAL PROOF BAR ============ */}
      <section className="border-y border-white/5 bg-white/[0.02] py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-amber-400">15</div>
            <div className="text-sm text-gray-500 mt-1">Agentes IA</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400">6</div>
            <div className="text-sm text-gray-500 mt-1">Fases Automaticas</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400">95%</div>
            <div className="text-sm text-gray-500 mt-1">Reducao de Tempo</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400">CNJ</div>
            <div className="text-sm text-gray-500 mt-1">100% Conforme</div>
          </div>
        </div>
      </section>

      {/* ============ COMO FUNCIONA ============ */}
      <section id="como-funciona" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como Funciona em <span className="text-amber-400">3 Passos</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Sem complexidade. Sem curva de aprendizado. Resultados imediatos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: FileText,
                title: "Upload do Processo",
                desc: "Faca upload do PDF. O sistema extrai e indexa automaticamente todas as paginas, partes e dados processuais.",
              },
              {
                step: "02",
                icon: Brain,
                title: "IA Analisa",
                desc: "15 agentes especializados trabalham em paralelo: classificacao, pesquisa de jurisprudencia, jurimetria, estrategia argumentativa.",
              },
              {
                step: "03",
                icon: FileText,
                title: "Receba o Resultado",
                desc: "Relatorio completo com fundamentacao CPC Art. 489, minutas prontas, dados DATAJUD e validacao CNJ.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition group"
              >
                <div className="text-5xl font-black text-amber-500/10 absolute top-4 right-6">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AGENTES ============ */}
      <section id="agentes" className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-amber-400">15 Agentes</span> Especializados
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Cada agente e modelado com base na expertise de grandes juristas brasileiros.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: "&#9878;", name: "Barbosa", role: "Classificacao TPU" },
              { icon: "&#9879;", name: "Fux", role: "Admissibilidade CPC" },
              { icon: "&#128220;", name: "CNJ", role: "Conformidade" },
              { icon: "&#128218;", name: "Mendes", role: "Pesquisa Constitucional" },
              { icon: "&#128202;", name: "Toffoli", role: "Consolidacao" },
              { icon: "&#128196;", name: "Weber", role: "Indexacao Tematica" },
              { icon: "&#128737;", name: "Moraes", role: "Direitos Fundamentais" },
              { icon: "&#9881;", name: "Barroso", role: "Estrategia" },
              { icon: "&#128209;", name: "Fachin", role: "Precedentes" },
              { icon: "&#128200;", name: "Nunes", role: "Jurimetria" },
              { icon: "&#128101;", name: "Carmen", role: "Perfil Relator" },
              { icon: "&#9989;", name: "Theodoro", role: "Validacao" },
              { icon: "&#127942;", name: "Marinoni", role: "Qualidade" },
              { icon: "&#128190;", name: "DATAJUD", role: "Formatacao" },
              { icon: "&#128081;", name: "Legal Chief", role: "Orquestrador" },
            ].map((agent) => (
              <div
                key={agent.name}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center hover:border-amber-500/20 transition"
              >
                <div
                  className="text-2xl mb-2"
                  dangerouslySetInnerHTML={{ __html: agent.icon }}
                />
                <div className="font-semibold text-sm">{agent.name}</div>
                <div className="text-xs text-gray-500 mt-1">{agent.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que Voce Precisa para{" "}
              <span className="text-amber-400">Vencer Causas</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Jurimetria Avancada",
                desc: "Analise quantitativa de decisoes com probabilidade de exito calculada por relator e materia.",
              },
              {
                icon: FileText,
                title: "Minutas Automaticas",
                desc: "Gerecao de pecas processuais com fundamentacao CPC Art. 489 e jurisprudencia atualizada.",
              },
              {
                icon: Users,
                title: "Perfil de Relatores",
                desc: "Mapeamento do posicionamento de cada relator/ministro sobre o tema do seu processo.",
              },
              {
                icon: Shield,
                title: "Validacao CNJ",
                desc: "Conformidade automatica com Resolucoes do CNJ e formatacao DATAJUD.",
              },
              {
                icon: Zap,
                title: "Pipeline 6 Fases",
                desc: "Triagem, Pesquisa, Analise, Fundamentacao, Validacao e Entrega — tudo automatico.",
              },
              {
                icon: Brain,
                title: "Linguagem Natural",
                desc: "Descreva o que precisa em portugues. Os agentes entendem e executam automaticamente.",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition"
              >
                <feat.icon className="w-8 h-8 text-amber-400 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que Dizem Nossos <span className="text-amber-400">Clientes</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/5"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed italic">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" ref={pricingRef} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Escolha seu <span className="text-amber-400">Plano</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Sem fidelidade. Cancele quando quiser. Garantia de 7 dias.
            </p>
          </div>

          <div className="mb-8 max-w-md mx-auto">
            <label className="text-sm text-gray-400 block mb-2">Seu email para acesso:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(plans).length > 0
              ? Object.entries(plans).map(([key, plan]) => {
                  const isPopular = key === "pro";
                  return (
                    <div
                      key={key}
                      className={`relative p-8 rounded-2xl border transition ${
                        isPopular
                          ? "bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/30 scale-105"
                          : "bg-white/[0.03] border-white/5 hover:border-white/10"
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-black text-xs font-bold">
                          MAIS POPULAR
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-extrabold">
                          R${plan.price_monthly}
                        </span>
                        <span className="text-gray-400">/mes</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((f: string) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleCheckout(key)}
                        disabled={loading === key || !email}
                        className={`w-full py-3 rounded-xl font-semibold transition ${
                          isPopular
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                            : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {loading === key ? "Processando..." : "Assinar Agora"}
                      </button>
                    </div>
                  );
                })
              : /* Fallback static plans */
                [
                  { name: "Starter", price: 97, popular: false, features: ["5 Agentes", "10 Analises/mes", "Upload 20MB", "Relatorios basicos"] },
                  { name: "Profissional", price: 197, popular: true, features: ["15 Agentes", "50 Analises/mes", "Upload 50MB", "Relatorios estrategicos", "Minutas automaticas", "Jurimetria avancada"] },
                  { name: "Enterprise", price: 497, popular: false, features: ["15 Agentes + Custom", "Analises ilimitadas", "Upload 100MB", "API dedicada", "Suporte prioritario", "SLA 99.9%"] },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative p-8 rounded-2xl border transition ${
                      plan.popular
                        ? "bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/30 scale-105"
                        : "bg-white/[0.03] border-white/5 hover:border-white/10"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-black text-xs font-bold">
                        MAIS POPULAR
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-extrabold">R${plan.price}</span>
                      <span className="text-gray-400">/mes</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={scrollToPricing}
                      className={`w-full py-3 rounded-xl font-semibold transition ${
                        plan.popular
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
                          : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      Assinar Agora
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perguntas <span className="text-amber-400">Frequentes</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition"
                >
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Pronto para Revolucionar sua
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              {" "}Pratica Juridica?
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de advogados que ja estao economizando horas por semana com
            analise processual inteligente.
          </p>
          <button
            onClick={scrollToPricing}
            className="px-10 py-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all"
          >
            Comecar Agora — 7 Dias de Garantia
          </button>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Legal Analyst Squad</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Termos</a>
            <a href="#" className="hover:text-white transition">Privacidade</a>
            <a href="#" className="hover:text-white transition">Contato</a>
          </div>
          <span>2025 Todos os direitos reservados</span>
        </div>
      </footer>

      {/* ============ VIDEO MODAL ============ */}
      {showVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
          <div className="relative max-w-4xl w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                <p className="text-lg">Video de demonstracao</p>
                <p className="text-sm text-gray-600 mt-2">Configure a URL do video no painel</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
