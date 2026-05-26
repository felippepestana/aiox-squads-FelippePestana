# Squad: Android Judicial Assessment 🤖

Squad especializado na elaboração de laudos técnicos periciais judiciais para dispositivos Android, com foco em smartphones **Samsung Galaxy**. Desenvolvido para uso exclusivo por **perito judicial habilitado**, registrado no CREA.

---

## Sobre o Squad

Este squad orquestra o processo pericial completo para dispositivos Android/Samsung em ações judiciais, cobrindo desde a avaliação inicial até a entrega do laudo assinado digitalmente. Incorpora o conhecimento técnico específico do ecossistema Samsung: Knox e-FUSE, diagnóstico via ADB, firmware ODIN/Heimdall, sistema de carregamento Adaptive Fast Charge e Samsung Service Center (SSC).

---

## Casos de Uso Típicos

- Falha de carregamento via USB-C (cabo) com carga wireless funcional
- Verificação de Knox Warranty Void Flag e suas implicações jurídicas
- Análise de intervenções por assistência técnica não autorizada
- Avaliação de dano por líquido (LDI ativado vs. falha de fabricação)
- Disputa sobre vícios de qualidade em Samsung Galaxy S/A/Z series
- Avaliação de firmware ODIN e bootloader unlock em contexto judicial

---

## Estrutura do Squad

```
android-judicial-assessment/
├── config.yaml                                     # Configuração e metadados
├── README.md                                       # Este arquivo
├── agents/
│   ├── chief-coordinator.md                        # Tier 0: Orquestrador
│   ├── hardware-specialist.md                      # Tier 1: Diagnóstico técnico
│   ├── legal-normative-specialist.md               # Tier 1: Enquadramento jurídico
│   ├── report-writer.md                            # Tier 2: Redação do laudo
│   └── qc-validator.md                             # Tier 3: Controle de qualidade
├── tasks/
│   ├── 01-initial-assessment.md                    # Avaliação inicial e custódia
│   ├── 02-hardware-diagnosis.md                    # Diagnóstico de hardware (4 fases)
│   ├── 03-legal-framework.md                       # Enquadramento jurídico-normativo
│   ├── 04-report-drafting.md                       # Redação do laudo
│   └── 05-qc-validation.md                         # Validação de qualidade
├── templates/
│   ├── laudo-tecnico.md                            # Template com [CAMPOS] (puro)
│   ├── laudo-tecnico-exemplo-samsung-s24ultra.md   # Exemplo preenchido (S24 Ultra)
│   └── quesitos-padrao.md                          # Quesitos padrão por parte
└── data/
    ├── android-diagnostics.md                      # Tabelas técnicas Samsung/Android
    ├── nbr-references.md                           # 12 normas ABNT aplicáveis
    └── legal-definitions.md                        # Definições CDC/CPC + Knox
```

---

## Fluxo de Execução

```
ENTRADA (inputs) → Task 01 (Chief Coordinator)
                       ↓
                  Task 02 (Hardware Specialist)
                       ↓
                  Task 03 (Legal-Normative Specialist)
                       ↓
                  Task 04 (Report Writer)
                       ↓
                  Task 05 (QC Validator)
                       ↓
               SAÍDA: Laudo Técnico Pericial assinado
```

---

## Especificidades Samsung/Android

### Knox e-FUSE
O Samsung Knox Warranty Void Flag é um fusível eletrônico permanente e irreversível:
- **0x0** = Garantia intacta (bootloader nunca foi desbloqueado)
- **0x1** = Garantia violada (Knox acionado; não pode ser revertido)

O acionamento do Knox por reparo não autorizado pode configurar **Categoria E** do CDC (intervenção de terceiro), com implicações para a responsabilidade do fabricante.

### Ferramentas de Diagnóstico
| Ferramenta | Plataforma | Finalidade |
|---|---|---|
| ADB (Android Debug Bridge) | Windows/macOS/Linux | Diagnóstico, logs, propriedades do sistema |
| ODIN | Windows | Flash de firmware Samsung |
| Heimdall | macOS/Linux | Alternativa ao ODIN para macOS |
| Samsung Members | Android | Diagnóstico nativo do dispositivo |
| Smart Switch | Windows/macOS | Backup, restauração, informações do dispositivo |

### Sistema de Carregamento Samsung
| Padrão | Potência | Conector |
|---|---|---|
| AFC (Adaptive Fast Charge) | 15W | USB-C |
| SFC (Super Fast Charge) | 25W | USB-C |
| SFC+ (Super Fast Charge+) | 45W | USB-C |
| Wireless PowerShare | 4,5W (reverso) | Qi |
| Wireless Qi2 | 15W | Qi2 |
| USB PD 3.0 / PPS | Até 45W | USB-C |

---

## Conformidade Legal

| Área | Norma/Lei |
|---|---|
| Processo Pericial | CPC/2015, Arts. 156–187, 464–480 |
| Direito do Consumidor | CDC, Lei 8.078/1990 |
| Competência Técnica | Resolução CFT nº 1.010/2005 |
| Laboratório Pericial | ABNT NBR ISO/IEC 17025:2017 |
| Evidência Digital | ABNT NBR ISO/IEC 27037:2013 |
| Certificação de Telecomunicações | Resolução ANATEL nº 680/2017 |
| Segurança de Equipamentos | ABNT NBR IEC 62368-1:2023 |

---

## Requisitos do Perito

- **Formação:** Engenheiro Eletricista, Engenheiro Eletrônico ou Tecnólogo em Eletrônica
- **Registro:** CREA ativo
- **Experiência mínima:** 3 anos em diagnóstico e reparo de dispositivos Android/Samsung
- **Recomendado:** Certificação Samsung Authorized Service Technician (SAST) ou equivalente
- **Recomendado:** Familiaridade com ADB, ODIN/Heimdall e Knox Security Architecture

---

## Exemplo de Caso Contemplado

O arquivo `templates/laudo-tecnico-exemplo-samsung-s24ultra.md` apresenta um laudo completamente preenchido para o seguinte cenário:

- **Dispositivo:** Samsung Galaxy S24 Ultra (SM-S928B/DS)
- **Defeito:** Falha de carregamento intermitente via USB-C; carga wireless (Qi2) funcional
- **Knox:** 0x0 (intacto)
- **LDI:** Não ativado
- **Indício:** Evidência de reparo anterior não autorizado

---

*Squad desenvolvido para o framework AIOX. Versão 1.0.0.*
