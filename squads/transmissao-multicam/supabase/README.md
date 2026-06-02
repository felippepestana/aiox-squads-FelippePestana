# Supabase — Transmissão Multicam

## Pré-requisitos

- Conta Supabase (free tier suporta esta carga)
- Supabase CLI (opcional, para migrations locais)

## Setup

1. Criar projeto em [supabase.com](https://supabase.com)
2. Copiar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` do Dashboard → Project Settings → API
3. Colar no `.env.local` do operator-panel (ver `.env.example`)
4. Para o F6 engine (Python), copiar `SUPABASE_SERVICE_ROLE_KEY` do Dashboard → API → service_role

## Aplicar migrations

### Via Supabase Dashboard (mais simples)
Abrir Dashboard → SQL Editor e executar cada arquivo em ordem:
1. `migrations/001_initial_schema.sql`
2. `migrations/002_seed_defaults.sql`

### Via Supabase CLI
```bash
supabase link --project-ref <seu-project-ref>
supabase db push
```

## Tabelas

| Tabela | Uso |
|---|---|
| `obs_settings` | Config de conexão OBS WebSocket |
| `meet_settings` | Config do Google Meet / Workspace |
| `camera_configs` | Config por câmera (nome, porta USB, presets) |
| `mic_channels` | Mapeamento canal de microfone → câmera |
| `api_credentials` | Chaves de API (hint apenas; valor salvo no Vault) |
| `events` | Sessões de transmissão agendadas/ao vivo |
| `switch_logs` | Histórico de trocas de câmera (tempo real via Realtime) |

## Real-time

O painel operador usa `supabase.channel()` para receber novas linhas em `switch_logs` em tempo real. O engine F6 insere via `service_role` e a UI atualiza sem refresh.

## Segurança

- RLS habilitado em todas as tabelas
- Usuários autenticados têm acesso total (ajustar policies para multi-tenant se necessário)
- `service_role` só pode INSERT em `switch_logs`
- Credenciais de API: armazenar valor real no Supabase Vault (Dashboard → Vault); salvar apenas hint (últimos 4 chars) na tabela `api_credentials`
