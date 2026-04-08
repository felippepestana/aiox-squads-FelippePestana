# Laudo de Avaliação Imobiliária — {{titulo}}

> **Norma Base:** ABNT NBR 14653-2 | **Data-Base:** {{data_base}} | **Squad:** Property Data v1.0

---

## 1. Identificação e Objetivo

| Campo | Valor |
|-------|-------|
| **Solicitante** | {{solicitante}} |
| **Finalidade** | {{finalidade}} |
| **Objetivo** | Determinação do valor de mercado do imóvel |
| **Pressuposto** | {{pressuposto}} |
| **Data-Base da Avaliação** | {{data_base}} |
| **Data da Vistoria/Análise** | {{data_vistoria}} |

---

## 2. Identificação e Caracterização do Imóvel

| Campo | Valor |
|-------|-------|
| **Endereço** | {{endereco}} |
| **Bairro** | {{bairro}} |
| **Cidade/UF** | {{cidade_uf}} |
| **CEP** | {{cep}} |
| **Tipo** | {{tipo_imovel}} |
| **Matrícula** | {{matricula}} — {{cartorio}} |
| **Inscrição Municipal** | {{inscricao_municipal}} |
| **Área do Terreno** | {{area_terreno}} m² |
| **Área Construída** | {{area_construida}} m² |
| **Fração Ideal** | {{fracao_ideal}} |
| **Proprietário(s)** | {{proprietarios}} |

### Descrição do Terreno

| Aspecto | Dado |
|---------|------|
| **Formato** | {{formato_terreno}} |
| **Topografia** | {{topografia}} |
| **Testada Principal** | {{testada}} m |
| **Profundidade** | {{profundidade}} m |
| **Situação na Quadra** | {{situacao_quadra}} |

### Descrição da Benfeitoria

| Aspecto | Dado |
|---------|------|
| **Tipo de Construção** | {{tipo_construcao}} |
| **Nº de Pavimentos** | {{pavimentos}} |
| **Padrão Construtivo** | {{padrao_construtivo}} ({{classificacao_cub}}) |
| **Estado de Conservação** | {{estado_conservacao}} ({{letra_heidecke}}) |
| **Idade Aparente** | {{idade_aparente}} anos |
| **Vida Útil Estimada** | {{vida_util}} anos |
| **Nº de Dormitórios** | {{dormitorios}} |
| **Nº de Banheiros** | {{banheiros}} |
| **Vagas de Garagem** | {{vagas}} |
| **Materiais Predominantes** | {{materiais}} |
| **Cobertura** | {{cobertura}} |
| **Infraestrutura** | {{infraestrutura}} |

---

## 3. Caracterização da Região

| Aspecto | Dado |
|---------|------|
| **Uso Predominante** | {{uso_predominante}} |
| **Padrão do Entorno** | {{padrao_entorno}} |
| **Infraestrutura Urbana** | {{infra_urbana}} |
| **Serviços Públicos** | {{servicos_publicos}} |
| **Transporte** | {{transporte}} |
| **Comércio/Serviços** | {{comercio_servicos}} |
| **Tendência de Mercado** | {{tendencia_mercado}} |
| **Zona/Zoneamento** | {{zoneamento}} |

---

## 4. Análise Visual e Fotográfica

### Registros Visuais

| # | Descrição | Observação | Confiança |
|---|-----------|------------|-----------|
| 1 | {{foto_1_desc}} | {{foto_1_obs}} | {{foto_1_confianca}} |
| 2 | {{foto_2_desc}} | {{foto_2_obs}} | {{foto_2_confianca}} |
| 3 | {{foto_3_desc}} | {{foto_3_obs}} | {{foto_3_confianca}} |

### Verificação Geoespacial

| Verificação | Resultado | Confiança |
|-------------|-----------|-----------|
| **Correspondência Endereço/Satélite** | {{verif_geo}} | {{confianca_geo}} |
| **Medidas Terreno vs Matrícula** | {{verif_medidas}} | {{confianca_medidas}} |

---

## 5. Método Utilizado e Justificativa

**Método:** {{metodo_utilizado}}

**Justificativa:** {{justificativa_metodo}}

---

## 6. Pesquisa de Mercado

### Dados Comparáveis

| # | Endereço/Referência | Tipo | Área (m²) | Valor (R$) | R$/m² | Fonte | Data |
|---|---------------------|------|-----------|-----------|-------|-------|------|
| 1 | {{comp_1_endereco}} | {{comp_1_tipo}} | {{comp_1_area}} | {{comp_1_valor}} | {{comp_1_unitario}} | {{comp_1_fonte}} | {{comp_1_data}} |
| 2 | {{comp_2_endereco}} | {{comp_2_tipo}} | {{comp_2_area}} | {{comp_2_valor}} | {{comp_2_unitario}} | {{comp_2_fonte}} | {{comp_2_data}} |
| 3 | {{comp_3_endereco}} | {{comp_3_tipo}} | {{comp_3_area}} | {{comp_3_valor}} | {{comp_3_unitario}} | {{comp_3_fonte}} | {{comp_3_data}} |

---

## 7. Tratamento dos Dados

### Fatores de Homogeneização Aplicados

| Fator | Comp. 1 | Comp. 2 | Comp. 3 | Justificativa |
|-------|---------|---------|---------|---------------|
| **Oferta** | {{fo_1}} | {{fo_2}} | {{fo_3}} | {{just_oferta}} |
| **Localização** | {{fl_1}} | {{fl_2}} | {{fl_3}} | {{just_localizacao}} |
| **Área** | {{fa_1}} | {{fa_2}} | {{fa_3}} | {{just_area}} |
| **Padrão** | {{fp_1}} | {{fp_2}} | {{fp_3}} | {{just_padrao}} |
| **Idade/Conservação** | {{fi_1}} | {{fi_2}} | {{fi_3}} | {{just_idade}} |
| **Fator Final** | {{ff_1}} | {{ff_2}} | {{ff_3}} | — |

### Valores Homogeneizados

| # | Valor Original (R$/m²) | Fator Final | Valor Homogeneizado (R$/m²) |
|---|------------------------|-------------|---------------------------|
| 1 | {{orig_1}} | {{ff_1}} | {{homog_1}} |
| 2 | {{orig_2}} | {{ff_2}} | {{homog_2}} |
| 3 | {{orig_3}} | {{ff_3}} | {{homog_3}} |

**Média Homogeneizada:** R$ {{media_homogeneizada}} /m²

---

## 8. Depreciação (quando aplicável — Método Evolutivo)

<!-- Incluir quando método evolutivo -->

| Parâmetro | Valor |
|-----------|-------|
| **Idade Real/Aparente** | {{idade}} anos |
| **Vida Útil Estimada** | {{vida_util}} anos |
| **Estado de Conservação** | {{estado}} ({{letra_heidecke}}) |
| **Coeficiente Ross (idade)** | {{coef_ross}} |
| **Coeficiente Heidecke (conservação)** | {{coef_heidecke}} |
| **Depreciação Total (%)** | {{depreciacao_pct}}% |
| **CUB Base (R$/m²)** | {{cub_base}} |
| **Custo Reprodução (R$)** | {{custo_reproducao}} |
| **Valor Depreciado (R$)** | {{valor_depreciado}} |

---

## 9. Especificação da Avaliação

| Especificação | Classificação |
|---------------|--------------|
| **Grau de Fundamentação** | {{grau_fundamentacao}} (I, II ou III) |
| **Grau de Precisão** | {{grau_precisao}} (I, II ou III) |
| **Intervalo de Confiança** | {{intervalo_confianca}} |
| **Amplitude** | {{amplitude}}% |

---

## 10. Resultado da Avaliação

| Resultado | Valor |
|-----------|-------|
| **Valor Unitário (R$/m²)** | R$ {{valor_unitario}} |
| **Valor Total do Imóvel** | **R$ {{valor_total}}** |
| **Limite Inferior** | R$ {{valor_inferior}} |
| **Limite Superior** | R$ {{valor_superior}} |
| **Data-Base** | {{data_base}} |

---

## 11. Ressalvas e Limitações

{{ressalvas}}

---

## 12. Anexos

### Documentos Analisados
- [ ] Certidão de matrícula
- [ ] Certidão de habite-se
- [ ] IPTU
- [ ] Fotos do imóvel
- [ ] Imagens de satélite
- [ ] {{anexo_adicional}}

### Mapas e Imagens de Referência

{{descricao_mapas_imagens}}

---

```citacoes
fonte: {{fonte_1}}
data_consulta: {{data_consulta_1}}
tipo: {{tipo_fonte_1}}
---
fonte: {{fonte_2}}
data_consulta: {{data_consulta_2}}
tipo: {{tipo_fonte_2}}
---
```

---

## Referências Normativas

- ABNT NBR 14653-1:2019 — Avaliação de bens — Procedimentos gerais
- ABNT NBR 14653-2:2011 — Avaliação de bens — Imóveis urbanos
- ABNT NBR 12721:2006 — Avaliação de custos unitários de construção
- Tabela Ross-Heidecke — Depreciação de edificações
- CUB/SINDUSCON {{estado}} — {{mes_ano_cub}}

---
*Property Data Squad v1.0 | Laudo elaborado por avaliador-imovel + relator-imobiliario*
