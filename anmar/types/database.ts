export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Role = "admin" | "doctor" | "nurse" | "biomedical" | "receptionist" | "viewer";

export interface Database {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string;
          name: string;
          cnpj: string | null;
          address: Json | null;
          contact: Json | null;
          settings: Json | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          cnpj?: string | null;
          address?: Json | null;
          contact?: Json | null;
          settings?: Json | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          cnpj?: string | null;
          address?: Json | null;
          contact?: Json | null;
          settings?: Json | null;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      branches: {
        Row: {
          id: string;
          clinic_id: string;
          name: string;
          address: Json | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          name: string;
          address?: Json | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          name?: string;
          address?: Json | null;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "branches_clinic_id_fkey"; columns: ["clinic_id"]; referencedRelation: "clinics"; referencedColumns: ["id"] }
        ];
      };
      staff_profiles: {
        Row: {
          id: string;
          clinic_id: string;
          user_id: string | null;
          full_name: string;
          cpf: string;
          role: Role;
          professional_register: string | null;
          specialties: string[];
          email: string | null;
          phone: string | null;
          birth_date: string | null;
          hourly_cost: number | null;
          branch_id: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          user_id?: string | null;
          full_name: string;
          cpf: string;
          role?: Role;
          professional_register?: string | null;
          specialties?: string[];
          email?: string | null;
          phone?: string | null;
          birth_date?: string | null;
          hourly_cost?: number | null;
          branch_id?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          user_id?: string | null;
          full_name?: string;
          cpf?: string;
          role?: Role;
          professional_register?: string | null;
          specialties?: string[];
          email?: string | null;
          phone?: string | null;
          birth_date?: string | null;
          hourly_cost?: number | null;
          branch_id?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: "staff_profiles_clinic_id_fkey"; columns: ["clinic_id"]; referencedRelation: "clinics"; referencedColumns: ["id"] },
          { foreignKeyName: "staff_profiles_branch_id_fkey"; columns: ["branch_id"]; referencedRelation: "branches"; referencedColumns: ["id"] }
        ];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      staff_role: Role;
    };
    CompositeTypes: Record<never, never>;
  };
}

export type StaffProfile = Database["public"]["Tables"]["staff_profiles"]["Row"];
export type Clinic = Database["public"]["Tables"]["clinics"]["Row"];
export type Branch = Database["public"]["Tables"]["branches"]["Row"];
