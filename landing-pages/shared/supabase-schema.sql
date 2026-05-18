-- ============================================================
-- Aliança de Amor Landing Page — Supabase Schema
-- Shared across all 5 alternatives
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. LEADS — Primary conversion table
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  city TEXT,
  state TEXT DEFAULT 'SP',
  interest TEXT CHECK (interest IN (
    'alianca_de_amor',
    'retiro',
    'formacao',
    'mae_peregrina',
    'juventude',
    'familia',
    'vida_consagrada',
    'outro'
  )),
  message TEXT,
  source TEXT DEFAULT 'landing_page',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  landing_variant TEXT CHECK (landing_variant IN (
    'sanctuary', 'covenant', 'flame', 'community', 'pilgrimage'
  )),
  converted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. EVENTS — Retreats, formations, celebrations
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN (
    'retiro', 'formacao', 'celebracao', 'peregrinacao',
    'encontro', 'congresso', 'jornada', 'outro'
  )),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  registration_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. TESTIMONIALS — Community stories
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_city TEXT,
  author_image_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  category TEXT CHECK (category IN (
    'alianca', 'retiro', 'formacao', 'comunidade',
    'mae_peregrina', 'cura', 'vocacao'
  )),
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  landing_variant TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- ============================================================
-- 5. PRAYER INTENTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS prayer_intentions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_name TEXT,
  intention TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  prayer_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. DONATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  donor_name TEXT,
  donor_email TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  donation_type TEXT CHECK (donation_type IN (
    'unica', 'mensal', 'dizimo', 'campanha'
  )),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'completed', 'failed', 'refunded'
  )),
  campaign TEXT,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  landing_variant TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. PAGE ANALYTICS — Track conversions per variant
-- ============================================================
CREATE TABLE IF NOT EXISTS page_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  landing_variant TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_view', 'scroll_depth', 'cta_click', 'form_start',
    'form_submit', 'video_play', 'share', 'donation_start'
  )),
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_variant ON leads(landing_variant);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured) WHERE is_approved = TRUE;
CREATE INDEX IF NOT EXISTS idx_analytics_variant ON page_analytics(landing_variant, event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON page_analytics(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_intentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Public read for events and approved testimonials
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Approved testimonials are viewable"
  ON testimonials FOR SELECT USING (is_approved = TRUE);

-- Public insert for leads, subscribers, intentions, analytics
CREATE POLICY "Anyone can submit a lead"
  ON leads FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Anyone can submit a prayer intention"
  ON prayer_intentions FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Anyone can log analytics"
  ON page_analytics FOR INSERT WITH CHECK (TRUE);

-- Donations: insert only (no read for public)
CREATE POLICY "Anyone can create a donation record"
  ON donations FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- SEED DATA — Sample testimonials and events
-- ============================================================
INSERT INTO testimonials (author_name, author_role, author_city, content, category, is_featured, is_approved, display_order) VALUES
  ('Maria Helena Santos', 'Membro da Família Schoenstatt', 'São Paulo, SP',
   'A Aliança de Amor transformou minha vida familiar. Encontrei na Mãe de Deus uma companheira para todos os momentos. Hoje, nossa família reza unida no Santuário e vivemos uma fé muito mais profunda.',
   'alianca', TRUE, TRUE, 1),
  ('Pe. Carlos Eduardo', 'Sacerdote Diocesano', 'Campinas, SP',
   'Participar da formação schoenstattiana me deu ferramentas espirituais que uso todos os dias no meu ministério. A pedagogia do Pe. Kentenich é revolucionária e atual.',
   'formacao', TRUE, TRUE, 2),
  ('Ana Beatriz Oliveira', 'Juventude Feminina de Schoenstatt', 'Curitiba, PR',
   'Na JFS encontrei minha vocação. A Aliança de Amor me ensinou que Maria caminha comigo em cada decisão. Hoje sou mais forte, mais confiante e mais próxima de Deus.',
   'comunidade', TRUE, TRUE, 3),
  ('Roberto e Cláudia Mendes', 'Casal da Liga de Famílias', 'Belo Horizonte, MG',
   'Nosso casamento estava em crise quando conhecemos o Movimento. A espiritualidade da aliança nos ensinou a renovar nosso amor todos os dias. Schoenstatt salvou nossa família.',
   'cura', TRUE, TRUE, 4),
  ('Ir. Teresinha do Carmelo', 'Irmã de Maria de Schoenstatt', 'Atibaia, SP',
   'Viver a Aliança de Amor no coração de uma comunidade religiosa é experimentar o Céu na terra. Cada dia é uma nova oportunidade de dizer sim a Deus junto com Maria.',
   'vocacao', TRUE, TRUE, 5),
  ('João Paulo Ferreira', 'Universitário', 'Rio de Janeiro, RJ',
   'Achava que fé e ciência não combinavam. O Movimento me mostrou que posso ser intelectual e homem de fé. A Aliança me deu raízes profundas num mundo superficial.',
   'comunidade', FALSE, TRUE, 6);

INSERT INTO events (title, slug, description, event_type, start_date, end_date, location, city, state, max_participants, price, is_featured) VALUES
  ('Retiro de Aliança de Amor 2026',
   'retiro-alianca-2026',
   'Um final de semana de profunda imersão espiritual para renovar ou selar sua Aliança de Amor com a Mãe Três Vezes Admirável de Schoenstatt.',
   'retiro',
   '2026-06-15 18:00:00+00',
   '2026-06-17 14:00:00+00',
   'Santuário de Schoenstatt',
   'Atibaia', 'SP', 80, 350.00, TRUE),
  ('Jornada de Formação — Pedagogia Kentenich',
   'jornada-formacao-kentenich',
   'Série de encontros formativos sobre a pedagogia do Pai e Fundador para aplicação na vida familiar e profissional.',
   'formacao',
   '2026-05-10 09:00:00+00',
   '2026-07-12 12:00:00+00',
   'Centro de Formação Tabor',
   'São Paulo', 'SP', 120, 0, TRUE),
  ('18 de Outubro — Dia da Aliança',
   'dia-da-alianca-2026',
   'Celebração solene do aniversário da Aliança de Amor Original, com Santa Missa, consagração e festa comunitária.',
   'celebracao',
   '2026-10-18 09:00:00+00',
   '2026-10-18 18:00:00+00',
   'Santuário Original',
   'Londrina', 'PR', 500, 0, TRUE);
