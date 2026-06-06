export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      exames: {
        Row: {
          arquivo_url: string
          created_at: string
          id: string
          motivo_reprovacao: string | null
          senderista_id: string
          tipo: string
          validado: boolean | null
          validado_por: string | null
        }
        Insert: {
          arquivo_url: string
          created_at?: string
          id?: string
          motivo_reprovacao?: string | null
          senderista_id: string
          tipo: string
          validado?: boolean | null
          validado_por?: string | null
        }
        Update: {
          arquivo_url?: string
          created_at?: string
          id?: string
          motivo_reprovacao?: string | null
          senderista_id?: string
          tipo?: string
          validado?: boolean | null
          validado_por?: string | null
        }
        Relationships: []
      }
      hakunas: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          role?: string
        }
        Relationships: []
      }
      prontuarios: {
        Row: {
          condutas: string | null
          created_at: string
          fotos_urls: string[]
          hakuna_id: string | null
          id: string
          queixas: string | null
          senderista_id: string
        }
        Insert: {
          condutas?: string | null
          created_at?: string
          fotos_urls?: string[]
          hakuna_id?: string | null
          id?: string
          queixas?: string | null
          senderista_id: string
        }
        Update: {
          condutas?: string | null
          created_at?: string
          fotos_urls?: string[]
          hakuna_id?: string | null
          id?: string
          queixas?: string | null
          senderista_id?: string
        }
        Relationships: []
      }
      senderistas: {
        Row: {
          altura_cm: number | null
          classificacao_risco: string
          comorbidades: string[]
          created_at: string
          data_nascimento: string
          exames_exigidos: string[]
          id: string
          imc: number | null
          motivo_reprovacao: string | null
          nfc_tag_id: string | null
          nome: string
          orientacoes: string | null
          peso_kg: number | null
          plano_saude: boolean
          qual_plano: string | null
          status: string
          telefone: string
          tipo_sanguineo: string | null
          updated_at: string
          upload_token: string
        }
        Insert: {
          altura_cm?: number | null
          classificacao_risco: string
          comorbidades?: string[]
          created_at?: string
          data_nascimento: string
          exames_exigidos?: string[]
          id?: string
          motivo_reprovacao?: string | null
          nfc_tag_id?: string | null
          nome: string
          orientacoes?: string | null
          peso_kg?: number | null
          plano_saude?: boolean
          qual_plano?: string | null
          status?: string
          telefone: string
          tipo_sanguineo?: string | null
          updated_at?: string
          upload_token?: string
        }
        Update: {
          altura_cm?: number | null
          classificacao_risco?: string
          comorbidades?: string[]
          created_at?: string
          data_nascimento?: string
          exames_exigidos?: string[]
          id?: string
          imc?: number | null
          motivo_reprovacao?: string | null
          nfc_tag_id?: string | null
          nome?: string
          orientacoes?: string | null
          peso_kg?: number | null
          plano_saude?: boolean
          qual_plano?: string | null
          status?: string
          telefone?: string
          tipo_sanguineo?: string | null
          updated_at?: string
          upload_token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
