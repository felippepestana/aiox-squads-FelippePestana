// Configuração compartilhada do Supabase. O app degrada graciosamente quando
// as variáveis não estão definidas: sem persistência nem login, mas a geração
// de documentos continua funcionando (mesma filosofia do cliente de IA).

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/** true quando Supabase está configurado (persistência/auth habilitadas). */
export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
