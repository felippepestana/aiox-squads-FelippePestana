# Landing Pages — Aliança de Amor (Schoenstatt)

## 5 Alternativas de Alta Conversão

Este diretório contém 5 versões alternativas da landing page "Aliança de Amor", cada uma com uma abordagem visual e estratégica diferente. Todas são construídas com **React + Vite + Tailwind CSS + Shadcn/UI** e se conectam ao **Supabase** para backend.

### Alternativas

| # | Nome | Conceito | Foco |
|---|------|----------|------|
| 1 | **Sanctuary** | Espiritual, imersivo, elegante escuro | Experiência contemplativa, atmosfera de santuário |
| 2 | **Covenant** | Moderno, minimalista, clean | Clareza, confiança, profissionalismo |
| 3 | **Flame** | Bold, energético, alta conversão | CTAs agressivos, urgência, transformação |
| 4 | **Community** | Social proof, testemunhos | Pertencimento, histórias reais, comunidade |
| 5 | **Pilgrimage** | Storytelling, jornada scroll | Narrativa imersiva, jornada de fé |

### Estrutura de Cada Alternativa

```
alternative-X-nome/
├── index.html          # Entry point
├── src/
│   ├── App.tsx         # Root component
│   ├── main.tsx        # React entry
│   ├── index.css       # Global styles + Tailwind
│   ├── components/     # Page sections
│   ├── lib/            # Utilities (Supabase client, etc.)
│   └── hooks/          # Custom hooks
├── package.json        # Dependencies
├── vite.config.ts      # Vite config
├── tailwind.config.ts  # Tailwind theme
├── tsconfig.json       # TypeScript config
└── .env.example        # Environment variables
```

### Stack Tecnológica

- **React 18** + TypeScript
- **Vite 5** — Build tool
- **Tailwind CSS 3.4** — Utility-first CSS
- **Shadcn/UI** — Component library
- **Framer Motion** — Animations
- **Supabase** — Auth, Database, Storage
- **React Hook Form + Zod** — Form validation
- **Lucide React** — Icons

### Como Rodar

```bash
cd alternative-X-nome
npm install
npm run dev
```

### Banco de Dados (Supabase)

O schema compartilhado está em `shared/supabase-schema.sql`. Inclui:

- `leads` — Cadastro de interessados
- `events` — Eventos e retiros
- `testimonials` — Testemunhos da comunidade
- `newsletter_subscribers` — Inscrições na newsletter
- `prayer_intentions` — Intenções de oração
- `donations` — Registro de doações

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

---

*Desenvolvido com auxílio dos squads AIOX: APEX (Frontend), SEO (Otimização), Curator (Copywriting), Deep-Research (Análise).*
