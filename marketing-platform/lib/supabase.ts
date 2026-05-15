import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string
          name: string
          contact: string
          tagline: string
          logo_url: string | null
          color_primary: string
          color_accent: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['clinics']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['clinics']['Insert']>
      }
      procedures: {
        Row: {
          id: string
          clinic_id: string
          slug: string
          name: string
          short_name: string
          audience: 'feminino' | 'masculino' | 'misto'
          description: string
          color_primary: string
          color_accent: string
          icon: string
          active: boolean
          order_index: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['procedures']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['procedures']['Insert']>
      }
      slides: {
        Row: {
          id: string
          procedure_id: string
          order_index: number
          duration_seconds: number
          type: 'gancho' | 'definicao' | 'procedimentos' | 'beneficios' | 'cta'
          title: string
          subtitle: string | null
          body: string[] | null
          cta_text: string | null
          image_url: string | null
          active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['slides']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['slides']['Insert']>
      }
    }
  }
}
