# Definições Jurídicas — Perícia em Dispositivos Android/Samsung

## 1. Classificação de Defeitos (CDC)

### Categoria A — Vício de Fabricação (CDC, Art. 12)

**Definição:** Defeito intrínseco ao produto, presente desde a fabricação ou que se manifesta em condições normais de uso.

**Exemplos em Samsung Galaxy:**
- PMIC com defeito de solda de fábrica causando falha prematura
- Bateria com capacidade inferior à especificada desde o início
- Conector USB-C com pinos fora de especificação de fábrica
- Software One UI com bug de fabricação causando superaquecimento

**Responsável:** Fabricante (Samsung Electronics) e/ou Importador (Samsung Brasil)
**Prazo CDC:** 90 dias a contar da entrega para reclamar (Art. 26, II)
**Prescrição:** 5 anos para reparação de danos (Art. 27)

---

### Categoria B — Vício por Inadequação ao Uso (CDC, Art. 18)

**Definição:** Produto se tornou impróprio ou inadequado ao uso a que se destina, ou teve seu valor diminuído.

**Exemplos em Samsung Galaxy:**
- Dispositivo que parou de carregar durante o período de garantia
- Tela com defeito de fábrica que se manifestou no uso normal

**Responsáveis:** Fabricante + distribuidor + varejista (solidários)
**Prazo para saneamento:** 30 dias; se não sanado, o consumidor pode exigir substituição, reembolso ou abatimento

---

### Categoria C — Dano por Fato do Produto (CDC, Art. 12)

**Definição:** O produto causou dano ao consumidor por defeito de segurança (acidente de consumo).

**Exemplos em Samsung Galaxy:**
- Bateria que inflamou causando dano material ou corporal
- Superaquecimento do dispositivo causando queimadura

**Responsável:** Fabricante (responsabilidade objetiva)

---

### Categoria D — Dano por Uso Inadequado (CDC, Art. 12, §3º, III)

**Definição:** Dano causado por uso do produto fora das especificações do fabricante.

**Exemplos em Samsung Galaxy:**
- Imersão em água por tempo/profundidade além do IP68 (> 2m ou > 30 min)
- Uso de carregador com tensão incompatível
- Queda de altura que excede a especificação MIL-STD-810H
- Exposição a temperaturas fora do range operacional (-20°C a 50°C)

**Efeito:** Pode excluir a responsabilidade do fabricante (ônus de prova: fabricante)

---

### Categoria E — Dano por Intervenção de Terceiro (CDC, Art. 12, §3º, II)

**Definição:** Dano causado exclusivamente por intervenção de assistência técnica não autorizada ou pelo próprio consumidor.

**Exemplos em Samsung Galaxy:**
- FPC do USB-C danificado durante reparo não autorizado
- Componente SMD danificado por calor excessivo em reparo externo
- Flash de firmware incorreto por assistência não Samsung

**Efeito:** Pode excluir a responsabilidade do fabricante (ônus de prova: fabricante)

---

### Categoria F — Knox e-FUSE Acionado com Nexo Causal (CDC, Art. 12, §3º, II)

**Definição:** Knox 0x1 + defeito **diretamente causado** pelo desbloqueio do bootloader.

**Caso específico que pode excluir responsabilidade:**
- Bootloader desbloqueado + instalação de ROM não oficial com driver incompatível → dano ao firmware
- Flash de partição errada via ODIN pelo usuário → brick do dispositivo
- Kernel customizado instável → falha de hardware por voltagem incorreta

**Requisito:** A Samsung deve **provar o nexo causal** (CDC, Art. 12, §3º). Apenas alegar "Knox 0x1" sem demonstrar a relação com o defeito específico **não** é suficiente.

**Nota importante:** Knox 0x1 em dispositivo com defeito de hardware (PMIC, conector, bateria) **não configura** esta categoria, pois o desbloqueio de bootloader não afeta hardware físico.

---

## 2. O Knox Warranty Void Flag sob a Ótica do CDC

### Posição da Samsung vs. CDC Brasileiro

| Aspecto | Posição Samsung | CDC Brasileiro |
|---|---|---|
| Knox 0x1 = void de garantia | Samsung considera garantia contratual void | A garantia **legal** de 90 dias (CDC Art. 26) não pode ser afastada por cláusula contratual (CDC Art. 51, I) |
| Ônus da prova | Consumidor deve provar que não causou o defeito | Fabricante deve provar que o defeito foi causado pelo desbloqueio (CDC Art. 12, §3º) |
| Defeito de hardware | Samsung nega cobertura | Hardware independe do estado do firmware; CDC Art. 12 ampara o consumidor |
| Garantia contratual vs. legal | Vicia a garantia contratual (1 ano) | Garantia legal de 90 dias prevalece sobre restrições contratuais |

### Hierarquia de Proteção

1. **Garantia Legal (CDC):** 90 dias para produtos duráveis — não pode ser afastada
2. **Garantia Contratual Samsung:** 1 ano — complementar à legal (Art. 50); pode ser restringida pelo Knox apenas se houver nexo causal comprovado pelo fabricante
3. **Samsung Care+ (seguro):** Cobertura adicional — segue termos contratuais específicos

---

## 3. Terminologia Técnico-Jurídica

| Termo Técnico | Definição para o Laudo |
|---|---|
| Knox e-FUSE | Fusível eletrônico de hardware permanente no chip de segurança Samsung; registra se o bootloader foi desbloqueado |
| Knox Warranty Void Flag 0x0 | Estado íntegro — bootloader nunca desbloqueado; garantia contratual preservada |
| Knox Warranty Void Flag 0x1 | Estado acionado — bootloader foi desbloqueado em algum momento; **não** implica automaticamente excludente de responsabilidade |
| AFC (Adaptive Fast Charge) | Protocolo de carregamento rápido Samsung — 9V/1,67A = 15W; negociação via linha D+/D- |
| Super Fast Charging 2.0 | Protocolo Samsung baseado em PPS (Programmable Power Supply) — até 45W |
| LDI (Liquid Damage Indicator) | Indicador de dano por líquido interno Samsung; muda de branco/prata para vermelho/rosa quando ativado |
| Bootloader | Software de inicialização do dispositivo; seu desbloqueio permite instalação de ROMs não oficiais |
| ROM | Sistema operacional instalado; ROM oficial Samsung vs. ROM customizada (AOSP, LineageOS, etc.) |
| ODIN | Ferramenta proprietária Samsung para flash de firmware; uso por não-SASC é considerado "não autorizado" |
| Samsung SSC | Samsung Service Center — assistência técnica oficial e autorizada pelo fabricante |
| SASC | Samsung Authorized Service Center — rede oficial de assistência técnica |
| Nexo causal | Relação de causa e efeito entre o ato (ex: desbloqueio) e o dano (ex: falha no firmware); essencial para excludentes de responsabilidade |

---

## 4. Jurisprudência Relevante

### Sobre Knox e Garantia Legal

O entendimento predominante no TJSP e STJ é que:

1. A **garantia legal de 90 dias** (CDC, Art. 26) não pode ser afastada por cláusula de exclusão relacionada ao Knox, pois tal cláusula seria abusiva (CDC, Art. 51, I — cláusula que "exonere o fornecedor de responsabilidade por vícios de qualquer natureza dos produtos");

2. Para afastar a responsabilidade com base no Knox 0x1, o fabricante precisa demonstrar **nexo causal específico** entre o desbloqueio e o defeito — não basta alegar genericamente o acionamento do Knox;

3. Defeitos de hardware (componentes físicos) são independentes do estado do firmware/bootloader, portanto o Knox 0x1 não é argumento válido para eles.

*Nota: Consultar jurisprudência atualizada nas bases do TJSP, STJ e TJSC conforme a data do laudo.*
