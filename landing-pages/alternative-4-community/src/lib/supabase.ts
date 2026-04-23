import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// Lead submission
// ============================================================
export async function submitLead(data: {
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  interest?: string;
  message?: string;
  landing_variant: string;
}) {
  const params = new URLSearchParams(window.location.search);
  return supabase.from('leads').insert({
    ...data,
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
  });
}

// ============================================================
// Newsletter subscription
// ============================================================
export async function subscribeNewsletter(email: string, name?: string, variant?: string) {
  return supabase.from('newsletter_subscribers').upsert(
    { email, name, landing_variant: variant },
    { onConflict: 'email' }
  );
}

// ============================================================
// Prayer intention
// ============================================================
export async function submitPrayerIntention(intention: string, authorName?: string) {
  return supabase.from('prayer_intentions').insert({
    intention,
    author_name: authorName,
    is_anonymous: !authorName,
  });
}

// ============================================================
// Fetch events
// ============================================================
export async function getUpcomingEvents(limit = 3) {
  return supabase
    .from('events')
    .select('*')
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(limit);
}

export async function getFeaturedEvents() {
  return supabase
    .from('events')
    .select('*')
    .eq('is_featured', true)
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true });
}

// ============================================================
// Fetch testimonials
// ============================================================
export async function getTestimonials(featured = true) {
  let query = supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true });

  if (featured) {
    query = query.eq('is_featured', true);
  }

  return query;
}

// ============================================================
// Analytics tracking
// ============================================================
export async function trackEvent(
  variant: string,
  eventType: string,
  eventData: Record<string, unknown> = {}
) {
  return supabase.from('page_analytics').insert({
    landing_variant: variant,
    event_type: eventType,
    event_data: eventData,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    referrer: document.referrer,
  });
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('aa_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('aa_session_id', sessionId);
  }
  return sessionId;
}
