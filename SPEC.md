# SPEC.md — ANALISTA PROCESSUAL WEB

## 1. Concept & Vision

**Plataforma web de análise processual jurídica brasileira potenciada por multiagentes IA.** Sistema inteligente que orquestra agentes especializados (navegador, extrator, calculador, mapeador) para análise completa de processos judiciais, com gateway LLM que seleciona automaticamente o modelo ideal por tarefa — otimizando custo-benefício.

**Feeling:** Profissional, confiável, eficiente — como um escritório de advocacia premium com tecnologia de ponta.

---

## 2. Design Language

### Aesthetic Direction
Inspiração: **Notion meets Bloomberg Terminal** — Interface limpa e minimalista com toques de sofisticação corporativa. Dados jurídicos apresentados de forma clara e navegável.

### Color Palette
```css
:root {
  /* Primary */
  --primary: #1E3A5F;          /* Azul institucional */
  --primary-light: #2D5A8B;
  --primary-dark: #0F1F33;
  
  /* Secondary */
  --secondary: #64748B;        /* Slate */
  --secondary-light: #94A3B8;
  
  /* Accent */
  --accent: #F59E0B;           /* Âmbar para destaques */
  --accent-light: #FBBF24;
  
  /* Semantic */
  --success: #10B981;          /* Verde - prazos favoráveis */
  --warning: #F59E0B;         /* Amarelo - atenção */
  --danger: #EF4444;           /* Vermelho - prazos críticos */
  --info: #3B82F6;            /* Azul - informações */
  
  /* Background */
  --bg-primary: #FAFBFC;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F1F5F9;
  --bg-dark: #0F172A;
  
  /* Text */
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;
  
  /* Border */
  --border: #E2E8F0;
  --border-light: #F1F5F9;
}
```

### Typography
- **Headings:** Inter (700, 600) — moderna e legível
- **Body:** Inter (400, 500) — consistência visual
- **Monospace:** JetBrains Mono — códigos, números de processo
- **Fallback:** system-ui, -apple-system, sans-serif

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Border radius: 6px (small), 8px (medium), 12px (large), 16px (xl)
- Card padding: 24px
- Section gaps: 32px

### Motion Philosophy
- **Transitions:** 150ms ease-out (micro), 300ms ease-out (standard)
- **Loading states:** Skeleton shimmer com gradiente sutil
- **Page transitions:** Fade + slide (opacity 0→1, translateY 8px→0)
- **Hover:** Scale 1.02, shadow elevation
- **Feedback:** Pulse animation para estados de processamento

### Visual Assets
- **Icons:** Lucide React (consistente com shadcn/ui)
- **Charts:** Recharts (gráficos de prazos, estatísticas)
- **File icons:** Custom para PDF, DOCX, imagens
- **Status badges:** Pill-shaped com cores semânticas

---

## 3. Layout & Structure

### Page Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (fixed)                                             │
│  Logo | Nav: Dashboard | Análises | Biblioteca | Config    │
│  User menu (avatar, dropdown)                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  MAIN CONTENT (scrollable)                                 │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Page Header (breadcrumb, title, actions)            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Content Area                                        │   │
│  │  (cards, tables, forms)                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  FOOTER (minimal)                                           │
│  © 2026 Analista Processual | Termos | Privacidade           │
└─────────────────────────────────────────────────────────────┘
```

### Page Structure

#### 1. Dashboard (`/`)
- **Hero stats:** Processos analisados, prazos pendentes,成功率
- **Timeline:** Últimas análises com status
- **Alerts:** Prazos críticos que requerem atenção
- **Quick actions:** Upload novo processo, buscar jurisprudência

#### 2. Upload & Análise (`/analise`)
- **Step wizard:** Upload → Configuração → Processamento → Resultado
- **Drag & drop zone:** Suporte PDF, DOCX, imagens
- **Progress indicator:** Status em tempo real do processamento multiagente
- **Live logs:** Output dos agentes durante execução

#### 3. Resultados (`/analise/[id]`)
- **Process info:** Número, tribunal, classe, partes
- **Tabs:** Resumo | Prazos | Partes | Riscos | Cronologia | Minuta
- **Export:** PDF, DOCX, JSON
- **Share:** Link compartilhável com token

#### 4. Biblioteca (`/biblioteca`)
- **Search:** Busca semântica de jurisprudência
- **Filters:** Tribunal, classe, assunto, período
- **Saved:** Documentos salvos pelo usuário
- **Vector index:** Status da indexação pgvector

#### 5. Configurações (`/config`)
- **LLM Gateway:** API keys, prioridade de modelos
- **Templates:** Modelos de minutas customizáveis
- **Webhooks:** Integração com sistemas externos
- **Profile:** Preferências, equipe, billing

### Responsive Strategy
- **Desktop (1280px+):** Layout completo, sidebar expandida
- **Tablet (768-1279px):** Sidebar colapsada, grid adaptivo
- **Mobile (< 768px):** Bottom nav, stacked cards, full-width

---

## 4. Features & Interactions

### Core Features

#### F1: Upload de Processos
- **Drag & drop** ou click para selecionar arquivos
- **Tipos:** PDF, DOCX, DOC, TXT, imagens (PNG, JPG)
- **Limite:** 50MB por arquivo, 10 arquivos por upload
- **Feedback:** Barra de progresso, preview da primeira página
- **Error:** Toast com mensagem específica (arquivo corrompido, tamanho excedido)

#### F2: Análise Multiagente
- **Trigger:** Automático após upload ou manual
- **Pipeline:**
  1. Agente Navegador: Indexa documentos
  2. Agente Extrator: Extrai dados estruturados
  3. Agente Calculador: Computa prazos
  4. Agente Mapeador: Identifica riscos
  5. Agente Analista: Consolida resultado
- **Timeout:** 5 minutos por agente
- **Retry:** 3 tentativas automáticas em caso de falha

#### F3: Dashboard de Prazos
- **Calendário visual:** Dias úteis restantes
- **Cores semânticas:**
  - Verde: > 15 dias úteis
  - Amarelo: 5-15 dias úteis
  - Vermelho: < 5 dias úteis
- **Notificações:** Email, push (configurável)
- **Export:** ICS para Google/Outlook

#### F4: Biblioteca de Jurisprudência
- **Busca vetorial:** Semantic search com pgvector
- **Filtros:** CNJ, tribunal, classe, período, termos
- **Snippet preview:** Trechos relevantes
- **Save/Tag:** Organize para referência futura
- **Citation:** Formato ABNT, LAWS, ILaws

#### F5: Gateway LLM
- **Modelos suportados:**
  | Tier | Modelos | Uso |
  |------|---------|-----|
  | Budget | DeepSeek V3, Qwen, MiniMax | Tarefas simples |
  | Standard | Kimi, GPT-4o-mini | Análise padrão |
  | Premium | Claude 3.5, GPT-4o, Gemini 2.0 | Análise complexa |
- **Seleção:** Baseada em complexidade estimada da tarefa
- **Fallback:** Escalona para modelo superior se necessário
- **Caching:** Respostas similares em cache

#### F6: Minutas Automáticas
- **Templates:** Contestação, recurso, petição inicial
- **Personalização:** Editor rich text com variáveis
- **Review:** Destaque de cláusulas geradas por IA
- **Export:** DOCX, PDF

### Interaction Details

#### Upload Flow
```
[User drags file]
    ↓
[Validate file type & size]
    ↓ (pass)
[Show preview + extract text metadata]
    ↓
[Confirm to start analysis]
    ↓
[Navigate to /analise/[id] with loading state]
```

#### Analysis Flow
```
[Initialize agents with LLM selection]
    ↓
[Run navigator → extractor → calculator → mapper]
    ↓ (parallel where possible)
[Aggregate results in Chief agent]
    ↓
[Store in Supabase + cache in Redis]
    ↓
[Notify user via email/push]
```

### Edge Cases & Error Handling

| Scenario | Behavior |
|----------|----------|
| Upload > 50MB | Toast error: "Arquivo muito grande (máx. 50MB)" |
| Unsupported type | Toast: "Tipo não suportado. Use PDF, DOCX, ou imagem." |
| LLM API failure | Retry 3x, then fallback to cheaper model |
| All models down | Queue analysis, notify user of delay |
| Session timeout | Redirect to login, preserve draft |
| Rate limit exceeded | Show cooldown timer, queue if premium user |
| Storage full | Prompt cleanup, disable new uploads |

### Empty States
- **Dashboard:** "Comece enviando seu primeiro processo" + CTA
- **Análises:** "Nenhuma análise ainda" + illustration
- **Biblioteca:** "Sua biblioteca está vazia" + upload prompt
- **Search:** "Nenhum resultado para '[query]'" + suggestions

---

## 5. Component Inventory

### Navigation
#### Header
- **States:** Default, scrolled (shadow), mobile (hamburger)
- **Logo:** Clickable → Dashboard
- **Nav items:** Active (underline), hover (bg tertiary)
- **User menu:** Avatar + dropdown (profile, config, logout)

#### Sidebar (Desktop)
- **Width:** 280px expanded, 72px collapsed
- **Items:** Icon + label, active state
- **Collapse:** Chevron button or responsive

### Cards
#### Analysis Card
```
┌─────────────────────────────────────┐
│ [Icon] Processo nº XXXXX             │
│ TRF1 • Classe • Última ação: XX/XX  │
│                                     │
│ [Status Badge] [Date Badge]         │
│                                     │
│ [Ver análise →]                    │
└─────────────────────────────────────┘
```
- **States:** Default, hover (elevate), loading (skeleton)
- **Click:** Navigate to detail

#### Stat Card
```
┌───────────────┐
│    [Icon]    │  ← Large icon
│     127      │  ← Big number
│  Processos   │  ← Label
│   +12 hoje   │  ← Trend indicator
└───────────────┘
```

### Forms
#### File Upload Zone
```
┌─────────────────────────────────────┐
│                                     │
│        [Cloud Upload Icon]          │
│                                     │
│   Arraste arquivos aqui ou          │
│      clique para selecionar         │
│                                     │
│   PDF, DOCX, DOC, TXT, Imagens     │
│          (máx. 50MB)               │
│                                     │
└─────────────────────────────────────┘
```
- **States:** Default, dragover (highlight), uploading (progress), error (red border)

#### Input Field
- **States:** Default, focus (ring), error (red border + message), disabled
- **Variants:** Text, textarea, select, combobox, datepicker

### Feedback
#### Toast Notifications
- **Types:** Success (green), error (red), warning (yellow), info (blue)
- **Position:** Top-right, stacked
- **Duration:** 5s auto-dismiss, hover pauses

#### Loading States
- **Skeleton:** Shimmer effect on cards, tables
- **Spinner:** Small actions, inline
- **Progress bar:** Upload, analysis steps

### Data Display
#### Timeline
```
●───── 15/01: Petição inicial
│
●───── 22/01: Distribuição
│
●───── 10/02: Contestação (atual)
│
○───── 25/02: Audiência (pendente)
```

#### Table
- **Features:** Sortable columns, pagination, row selection
- **States:** Loading (skeleton rows), empty, error

#### Tabs
- **Style:** Underline active, pill variant for filters
- **Content:** Lazy load on tab switch

---

## 6. Technical Approach

### Stack
```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 15 (App Router) • React 19 • TypeScript 5          │
│  Tailwind CSS 4 • Shadcn/UI • Lucide Icons                 │
│  TanStack Query • Zustand (state) • React Hook Form         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER                              │
│  Next.js API Routes / Express (WebSocket for live updates)  │
│  tRPC or REST • Zod validation • Rate limiting             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     AGENT ORCHESTRATOR                       │
│  Node.js Agent Runtime • LLM Gateway • Task Queue          │
│  BullMQ (Redis) • Streaming responses                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     SERVICES                                 │
│  Supabase (Auth, DB, Storage) • Redis (Cache, Queue)       │
│  Vector (pgvector) • Email (Resend) • Storage (S3-like)    │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure
```
analista-processual-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── analise/
│   │   │   │   ├── page.tsx   # List
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── biblioteca/
│   │   │   └── config/
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/               # Shadcn components
│   │   ├── forms/
│   │   ├── cards/
│   │   ├── tables/
│   │   └── layout/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   ├── agents/
│   │   │   ├── orchestrator.ts
│   │   │   ├── llm-gateway.ts
│   │   │   └── agents/
│   │   │       ├── navigator.ts
│   │   │       ├── extractor.ts
│   │   │       ├── calculator.ts
│   │   │       └── mapper.ts
│   │   ├── utils/
│   │   └── constants/
│   │
│   └── types/
│       ├── analysis.ts
│       ├── process.ts
│       └── user.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── fonts/
│   └── images/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docker/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

### Database Schema (Supabase/PostgreSQL)

```sql
-- Users (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analyses
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  process_number TEXT,
  court TEXT,
  process_class TEXT,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  result JSONB,
  documents JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id),
  filename TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT,
  extracted_text TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deadlines (prazos)
CREATE TABLE deadlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id),
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  business_days INTEGER,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library (jurisprudence)
CREATE TABLE library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  content TEXT,
  court TEXT,
  process_class TEXT,
  tags TEXT[],
  embedding VECTOR(1536), -- OpenAI ada-002 or similar
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector search index
CREATE INDEX library_items_embedding_idx ON library_items 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- API Keys for LLM Gateway
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  provider TEXT NOT NULL, -- openai, anthropic, deepseek, etc.
  encrypted_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Endpoints

```
Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

Analyses:
GET    /api/analyses              # List user's analyses
POST   /api/analyses               # Create new analysis
GET    /api/analyses/:id           # Get analysis details
DELETE /api/analyses/:id           # Delete analysis
POST   /api/analyses/:id/upload    # Upload documents
GET    /api/analyses/:id/status    # Poll processing status

Documents:
GET    /api/documents/:id          # Download document
DELETE /api/documents/:id          # Delete document

Deadlines:
GET    /api/deadlines              # List upcoming deadlines
GET    /api/deadlines/calendar     # Calendar view data
PATCH  /api/deadlines/:id          # Update deadline status

Library:
GET    /api/library                # List library items
POST   /api/library                # Add item
GET    /api/library/search         # Vector search
DELETE /api/library/:id           # Delete item

LLM Gateway:
GET    /api/llm/models             # Available models
POST   /api/llm/estimate           # Estimate cost
POST   /api/llm/config             # Configure API keys

Webhooks:
POST   /api/webhooks/analysis      # Analysis complete callback
POST   /api/webhooks/deadline      # Deadline reminder
```

### LLM Gateway Architecture

```typescript
// lib/agents/llm-gateway.ts
interface LLMGateway {
  // Model tiers
  models: {
    budget: ['deepseek-v3', 'qwen-2.5', 'minimax-01'];
    standard: ['kimi-k2', 'gpt-4o-mini', 'claude-3-haiku'];
    premium: ['claude-3.5-sonnet', 'gpt-4o', 'gemini-2.0-pro'];
  };
  
  // Intelligent selection
  selectModel(taskComplexity: TaskComplexity): string;
  
  // Execution with fallback
  complete(prompt: string, options?: CompleteOptions): Promise<LLMResponse>;
  
  // Streaming for real-time feedback
  stream(prompt: string, onChunk: (chunk: string) => void): Promise<void>;
  
  // Cost tracking
  trackCost(model: string, tokens: number): void;
  getCostSummary(): CostSummary;
}

type TaskComplexity = 'simple' | 'moderate' | 'complex' | 'expert';

interface TaskConfig {
  complexity: TaskComplexity;
  preferredTier?: 'budget' | 'standard' | 'premium';
  fallbackEnabled: boolean;
  maxRetries: number;
  timeout: number;
}
```

### Agent Implementation Pattern

```typescript
// lib/agents/agents/extractor.ts
export class ExtractorAgent {
  name = 'Extrator de Documentos';
  description = 'Extrai dados estruturados de petições e decisões';
  mind = Minds.CASSIO_SCARPINELLA;
  
  async execute(input: ExtractorInput, context: AgentContext): Promise<ExtractorOutput> {
    // 1. Validate input
    // 2. Call LLM with prompt template
    // 3. Parse structured output (JSON/Zod)
    // 4. Post-process and validate
    // 5. Return structured data
  }
  
  getPromptTemplate(): string {
    return `Você é ${this.name}, um especialista...
    
    Dados do processo:
    {processData}
    
    Extraia os seguintes campos:
    {schema}
    
    Responda em JSON válido.`;
  }
}
```

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     HOSTINGER VPS                             │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Nginx     │  │   PM2       │  │   Docker             │   │
│  │  (Reverse   │  │  (Node.js)  │  │   ┌─────────────┐   │   │
│  │   Proxy)    │  │             │  │   │ Next.js     │   │   │
│  │             │  │  ┌───────┐  │  │   └─────────────┘   │   │
│  │  SSL/TLS    │  │  │ API   │  │  │   ┌─────────────┐   │   │
│  │             │  │  │ Worker│  │  │   │ PostgreSQL  │   │   │
│  └──────┬──────┘  │  └───────┘  │  │   └─────────────┘   │   │
│         │         └─────────────┘  │   ┌─────────────┐   │   │
│         │                           │   │ Redis      │   │   │
│         │                           │   └─────────────┘   │   │
│         │                           └─────────────────────┘   │
│         │                                                         │
└─────────┼─────────────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────┐
│   Supabase      │
│  ┌───────────┐  │
│  │ Auth      │  │
│  │ Database  │  │
│  │ Storage   │  │
│  │ Vector    │  │
│  └───────────┘  │
└─────────────────┘
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Redis
REDIS_URL=redis://localhost:6379

# LLM Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
DEEPSEEK_API_KEY=
QWEN_API_KEY=
KIMI_API_KEY=
MINIMAX_API_KEY=
GEMINI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://analista-processual.com
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Email
RESEND_API_KEY=
EMAIL_FROM=noreply@analista-processual.com

# Storage
STORAGE_BUCKET=documents
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Next.js project setup with TypeScript, Tailwind, Shadcn
- [ ] Supabase integration (Auth, Database)
- [ ] Basic layout components (Header, Sidebar, Layout)
- [ ] Dashboard page with stats cards
- [ ] User authentication flow

### Phase 2: Core Features (Week 3-4)
- [ ] File upload with drag & drop
- [ ] Document storage in Supabase
- [ ] Basic analysis flow (single agent)
- [ ] Analysis results page with tabs
- [ ] List and detail views for analyses

### Phase 3: Multi-Agent (Week 5-6)
- [ ] Agent orchestrator setup
- [ ] LLM Gateway with model selection
- [ ] All 5 agents implemented
- [ ] Real-time progress updates
- [ ] Error handling and retry logic

### Phase 4: Intelligence (Week 7-8)
- [ ] Deadline calculator with business days
- [ ] Vector search for library
- [ ] Semantic search UI
- [ ] Citation generation
- [ ] Template engine for minutas

### Phase 5: Polish (Week 9-10)
- [ ] Email/push notifications
- [ ] Export functionality (PDF, DOCX)
- [ ] Mobile responsive
- [ ] Performance optimization
- [ ] E2E tests

### Phase 6: Deploy (Week 11-12)
- [ ] VPS setup on Hostinger
- [ ] Docker configuration
- [ ] CI/CD pipeline
- [ ] SSL/TLS
- [ ] Monitoring and logging

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|-------|-------------|
| Analysis time | < 2 min | Average from upload to result |
| Accuracy | > 90% | Manual review sample |
| Cost per analysis | < $0.10 | LLM API costs / analyses |
| Uptime | 99.5% | Monitoring |
| User satisfaction | > 4.5/5 | In-app survey |
