# Task: Cadastrar Colaborador

**Squad**: clinic-mgmt  
**Agent**: intake-coordinator  
**UC**: UC-AN-002  
**Pattern**: AN-TASK-003

---

## Input Esperado

```yaml
required:
  - full_name: string
  - cpf: string (validado)
  - role: admin | doctor | nurse | receptionist | viewer
  - professional_register: string (CRM/COREN/outros — obrigatório para roles clínicos)
optional:
  - birth_date: DATE
  - contact: {phone, email}
  - specialties: [string]
  - tangerino_id: string
  - branch_id: UUID
  - hourly_cost: decimal (para cálculo de custo de procedimento)
```

## Passos de Execução

```
1. VALIDAÇÃO:
   ├── CPF: formato e dígito verificador
   ├── Registro profissional: formato CRM/COREN por estado
   └── Role 'doctor' exige CRM; 'nurse' exige COREN

2. CRIAR USUÁRIO AUTH:
   ├── Gerar convite por email (Supabase Auth)
   ├── Configurar obrigatoriedade de 2FA
   └── Definir permissões por role (RLS policies)

3. SALVAR PERFIL:
   ├── Inserir em staff_profiles
   └── Vincular ao branch_id configurado

4. CENTRO DE CUSTO:
   ├── Se hourly_cost informado: registrar para uso em cálculo de procedimentos
   └── Notificar @financial-intel sobre novo colaborador

5. INTEGRAÇÃO TANGERINO:
   └── Se tangerino_id informado: validar via @accounting-bridge
```

## Output

```yaml
staff_id: UUID
auth_invite_sent: boolean
role: string
access_level_summary: [string]
professional_register_validated: boolean
tangerino_linked: boolean
```

## Quality Gate

- [ ] CPF válido
- [ ] Registro profissional presente para roles clínicos
- [ ] Convite de acesso enviado por email
- [ ] 2FA configurado como obrigatório
