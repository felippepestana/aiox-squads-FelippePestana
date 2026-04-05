import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  interest: string;
  source: string;
}

export async function submitLead(data: LeadFormData) {
  const { error } = await supabase.from('leads').insert([
    {
      ...data,
      landing_page: 'flame',
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) throw error;
  return { success: true };
}
