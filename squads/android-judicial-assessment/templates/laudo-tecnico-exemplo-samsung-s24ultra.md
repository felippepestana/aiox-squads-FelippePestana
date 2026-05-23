<!-- ============================================================
     EXEMPLO — LAUDO TÉCNICO PERICIAL — Samsung Galaxy S24 Ultra
     Caso: Falha de carregamento via USB-C com carga wireless funcional
     Knox Warranty Void Flag: 0x0 (íntegro)
     Este é um documento de exemplo para orientação. Todos os dados são fictícios.
     ============================================================ -->

---

# LAUDO TÉCNICO PERICIAL Nº 042/2026

**PROCESSO Nº:** 1234567-89.2026.8.26.0100
**VARA:** 3ª Vara do Consumidor
**COMARCA:** São Paulo/SP
**OBJETO:** Perícia técnica em dispositivo Samsung Galaxy S24 Ultra SM-S928B/DS

---

## 1. IDENTIFICAÇÃO DO PROCESSO E DAS PARTES

**1.1** O presente Laudo Técnico Pericial é elaborado no âmbito do Processo nº 1234567-89.2026.8.26.0100, que tramita perante a 3ª Vara do Consumidor da Comarca de São Paulo, Estado de São Paulo, em ação de indenização por danos materiais e morais.

**1.2** São partes no processo:

- **AUTOR:** João da Silva Santos, CPF nº 123.456.789-00, representado pelo Dr. Carlos Eduardo Oliveira, OAB/SP nº 123.456.
- **RÉU:** TechFix Assistência Técnica Ltda., CNPJ nº 12.345.678/0001-90, representada pela Dra. Maria Fernanda Costa, OAB/SP nº 654.321.

---

## 2. IDENTIFICAÇÃO DO PERITO

**2.1** O perito subscritor foi nomeado pelo MM. Juiz de Direito por despacho proferido em 10 de março de 2026.

**2.2** Dados do Perito:

| Campo | Dados |
|---|---|
| Nome | Dr. Roberto Almeida Ferreira |
| CPF | 987.654.321-00 |
| Registro Profissional | CREA-SP nº 5.555.555-5 — Engenheiro Eletrônico |
| Especialização | Engenharia Eletrônica — Dispositivos Android/Samsung, Perícia Judicial |
| Endereço Profissional | Av. Paulista, 1000, cj. 201, São Paulo/SP |

---

## 3. OBJETO DA PERÍCIA

**3.2** Identificação do dispositivo periciado:

| Campo | Dado |
|---|---|
| Marca | Samsung Electronics |
| Modelo Comercial | Galaxy S24 Ultra |
| Número de Modelo | SM-S928B/DS |
| SKU Brasil | SM-S928BZKPZTO |
| IMEI 1 | 359 123 456 789 012 |
| IMEI 2 | 359 123 456 789 013 |
| Número de Série | RF8T1ABCDEF |
| Capacidade | 256 GB |
| Cor | Titanium Black |
| Certificação ANATEL | 02648-25-12345 |
| Versão One UI / Android | One UI 6.1 / Android 14 |
| Status de Garantia Samsung | VIGENTE até 15/01/2026 |
| Knox Warranty Void Flag | 0x0 — ÍNTEGRO |

---

## 6. EXAME PERICIAL

### 6.2 Diagnóstico por Software e Knox e-FUSE

**6.2.2** **Knox Warranty Void Flag:** O status do fusível eletrônico Knox foi verificado via ADB (Android Debug Bridge), com o comando `adb shell getprop ro.boot.warranty_bit`, com o seguinte resultado:

> **Knox Warranty Void Flag: 0x0 — ÍNTEGRO**

O Knox e-FUSE é um fusível eletrônico de hardware permanente, gravado no chip de segurança do dispositivo Samsung, que registra de forma irreversível se o bootloader do aparelho foi desbloqueado. O estado **0x0** indica que o bootloader nunca foi desbloqueado, confirmando que o dispositivo permanece com firmware original Samsung e sem modificações de sistema.

O dispositivo apresenta Knox íntegro, não havendo indício de desbloqueio de bootloader. A garantia contratual Samsung encontra-se preservada neste aspecto.

### 6.3 Diagnóstico Elétrico — AFC/PPS

**6.3.2** **Teste de Carga via Cabo USB-C (Samsung AFC):**

| Carregador Utilizado | Cabo | Tensão Medida (V) | Corrente Medida (A) | Potência (W) | AFC Negociado | Carregamento |
|---|---|---|---|---|---|---|
| Samsung 25W EP-TA800 | EP-DX510 original | 4,98V | 0,08A | 0,4W | NÃO | NÃO |
| Samsung 45W EP-TA845 | EP-DX510 original | 4,97V | 0,07A | 0,35W | NÃO | NÃO |
| Carregador USB PD 3.0 (Anker) | USB-C certificado | 4,96V | 0,06A | 0,3W | NÃO | NÃO |

**Interpretação:** O dispositivo não negocia o protocolo AFC nem USB PD. A tensão permanece em ~5V com corrente próxima de zero, indicando que não há transferência efetiva de energia para a bateria. O Charging IC não está respondendo à negociação do protocolo de carga.

**6.3.3** **Teste de Carga sem Fio:**

| Carregador | Potência Máx. | Resultado |
|---|---|---|
| Samsung EP-P2400 (15W) | 15W | **CARREGANDO** — ícone confirmado na tela |

**Conclusão parcial:** A carga sem fio funciona normalmente (15W), enquanto a carga via cabo USB-C falha completamente. Esta dissociação é tecnicamente diagnóstica de falha no Charging IC (SMB1398) ou no subsistema de carga com fio, uma vez que os circuitos de carga por indução e por cabo são independentes.

---

## 7. DISCUSSÃO TÉCNICA

**7.2 Hipótese 1 (probabilidade: ALTA):**

Falha no Charging IC (Samsung SMB1398 / MFC) → impossibilidade de negociação do protocolo AFC/USB PD → ausência de transferência de corrente via cabo USB-C → não carregamento via cabo com carga sem fio preservada.

**7.4 Análise do Knox Warranty Void Flag:**

O dispositivo apresenta Knox íntegro (0x0), indicando que o bootloader nunca foi desbloqueado. A garantia contratual Samsung encontra-se preservada neste aspecto, e o Knox não é variável relevante na análise de responsabilidade deste caso.

**7.5** O enquadramento do caso é **Categoria E — Dano por Intervenção de Terceiro (CDC, Art. 12, §3º, II)**: a análise interna revelou que o FPC do conector USB-C foi removido e reinserido de forma incorreta durante o reparo realizado pela TechFix, resultando em dano ao Charging IC por tensão mecânica.

---

## 9. CONCLUSÃO

1. O dispositivo Samsung Galaxy S24 Ultra periciado apresenta defeito total de carregamento via cabo USB-C, com carga sem fio preservada.
2. A causa determinante é dano ao Charging IC (SMB1398) causado por intervenção técnica inadequada na Ordem de Serviço nº 2025/0789 realizada pela TechFix.
3. O Knox Warranty Void Flag apresenta-se íntegro (0x0), não sendo fator relevante na análise causal.
4. O dispositivo é reparável mediante substituição do Charging IC, com custo estimado de R$ 680,00 a R$ 950,00 (Samsung SSC).
5. A responsabilidade pelo dano recai sobre a assistência técnica TechFix, nos termos do art. 12, §3º, II do CDC.

[São Paulo, 15 de maio de 2026]

**Dr. Roberto Almeida Ferreira**
CREA-SP nº 5.555.555-5 — Engenheiro Eletrônico
Perito Judicial Nomeado — Processo nº 1234567-89.2026.8.26.0100
