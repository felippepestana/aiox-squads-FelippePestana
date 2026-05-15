const STEPS = [
  {
    num: '01',
    title: 'Configure sua clínica',
    desc: 'Adicione o nome, contato e logotipo no painel admin. Os placeholders são substituídos automaticamente.',
  },
  {
    num: '02',
    title: 'Escolha os procedimentos',
    desc: 'Selecione quais procedimentos exibir e configure o loop: todos os públicos, somente feminino ou masculino.',
  },
  {
    num: '03',
    title: 'Grave os vídeos',
    desc: 'Use os roteiros de 15s como guia para sua equipe de gravação. Cada cena tem foco, ângulo e legenda definidos.',
  },
  {
    num: '04',
    title: 'Exiba na TV da recepção',
    desc: 'Abra o Display TV em qualquer browser ou smart TV. Loop de 90s com cross-dissolve automático.',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-[#0a1120]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-[#d4af37] text-sm font-semibold tracking-widest uppercase mb-3">
            Fluxo de uso
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Da configuração
            <br />
            <span className="text-white/40">ao display em 4 passos</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent z-10" />
              )}
              <div className="text-5xl font-bold text-white/5 mb-4 font-mono">{step.num}</div>
              <h3 className="text-white font-semibold mb-2">{step.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
