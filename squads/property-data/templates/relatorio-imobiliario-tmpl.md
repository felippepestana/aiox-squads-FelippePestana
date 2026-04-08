# Relatório de Levantamento Imobiliário — {{titulo_demanda}}

> **Gerado em:** {{data}} | **Squad:** Property Data v1.0 | **Modo:** {{modo}}

---

## 1. Identificação do Imóvel

| Campo | Valor |
|-------|-------|
| **Endereço Completo** | {{endereco}} |
| **Bairro** | {{bairro}} |
| **Cidade/UF** | {{cidade_uf}} |
| **CEP** | {{cep}} |
| **Tipo do Imóvel** | {{tipo_imovel}} |
| **Matrícula** | {{matricula}} |
| **Cartório** | {{cartorio}} |
| **Inscrição Municipal** | {{inscricao_municipal}} |
| **Área do Terreno** | {{area_terreno}} m² |
| **Área Construída** | {{area_construida}} m² |
| **Proprietário(s)** | {{proprietarios}} |
| **Data da Análise** | {{data}} |

---

## 2. Dados Registrais

### Certidão de Matrícula

| Campo | Valor | Fonte |
|-------|-------|-------|
| **Nº Matrícula** | {{matricula_numero}} | {{fonte_matricula}} |
| **Cadeia Dominial** | {{cadeia_dominial}} | {{fonte_cadeia}} |
| **Ônus Reais** | {{onus_reais}} | {{fonte_onus}} |
| **Averbações** | {{averbacoes}} | {{fonte_averbacoes}} |

### Certidão de Habite-se

| Campo | Valor |
|-------|-------|
| **Nº Habite-se** | {{habite_se_numero}} |
| **Data de Expedição** | {{habite_se_data}} |
| **Órgão Expedidor** | {{habite_se_orgao}} |
| **Uso Autorizado** | {{habite_se_uso}} |

### Situação Fiscal

| Tributo | Situação | Valor/Observação |
|---------|----------|-----------------|
| **IPTU** | {{iptu_situacao}} | {{iptu_valor}} |
| **Dívida Ativa** | {{divida_ativa}} | {{divida_valor}} |

---

## 3. Análise Visual e Padrão Construtivo

### Observações da Vistoria Visual

| Aspecto | Observação | Grau de Confiança |
|---------|------------|-------------------|
| **Tipo de Construção** | {{tipo_construcao}} | {{confianca_tipo}} |
| **Nº de Pavimentos** | {{pavimentos}} | {{confianca_pavimentos}} |
| **Materiais Visíveis** | {{materiais}} | {{confianca_materiais}} |
| **Estado de Conservação** | {{estado_conservacao}} | {{confianca_estado}} |
| **Cobertura** | {{cobertura}} | {{confianca_cobertura}} |
| **Idade Aparente** | {{idade_aparente}} | {{confianca_idade}} |

### Geolocalização

| Dado | Valor | Verificação |
|------|-------|-------------|
| **Coordenadas** | {{coordenadas}} | {{verificacao_geo}} |
| **Correspondência Endereço/Satélite** | {{correspondencia_satelite}} | {{confianca_geo}} |

### Entorno

{{descricao_entorno}}

---

## 4. Legislação Aplicável

### Legislação Federal

| Dispositivo | Artigo/Parágrafo | Conteúdo Relevante |
|-------------|-----------------|-------------------|
| {{leg_fed_1_dispositivo}} | {{leg_fed_1_artigo}} | {{leg_fed_1_conteudo}} |

### Legislação Estadual

| Dispositivo | Artigo/Parágrafo | Conteúdo Relevante |
|-------------|-----------------|-------------------|
| {{leg_est_1_dispositivo}} | {{leg_est_1_artigo}} | {{leg_est_1_conteudo}} |

### Legislação Municipal

| Dispositivo | Artigo/Parágrafo | Conteúdo Relevante |
|-------------|-----------------|-------------------|
| {{leg_mun_1_dispositivo}} | {{leg_mun_1_artigo}} | {{leg_mun_1_conteudo}} |

### Restrições Identificadas

| Tipo | Dispositivo Legal | Descrição | Impacto |
|------|------------------|-----------|---------|
| {{restricao_1_tipo}} | {{restricao_1_dispositivo}} | {{restricao_1_descricao}} | {{restricao_1_impacto}} |

---

## 5. Análise Urbanística

| Aspecto | Dado | Fonte Legal |
|---------|------|-------------|
| **Zona** | {{zona_urbanistica}} | {{fonte_zona}} |
| **Uso Permitido** | {{uso_permitido}} | {{fonte_uso}} |
| **Taxa de Ocupação Máx.** | {{taxa_ocupacao}} | {{fonte_to}} |
| **Coeficiente de Aproveitamento** | {{coeficiente_aproveitamento}} | {{fonte_ca}} |
| **Gabarito Máximo** | {{gabarito}} | {{fonte_gabarito}} |
| **Afastamentos** | {{afastamentos}} | {{fonte_afastamentos}} |

### Atividades Permitidas/Proibidas

{{atividades_zona}}

---

## 6. Situação Ambiental

| Norma | Aplicabilidade | Restrição | Impacto |
|-------|---------------|-----------|---------|
| {{amb_1_norma}} | {{amb_1_aplicabilidade}} | {{amb_1_restricao}} | {{amb_1_impacto}} |

### Observações Ambientais

{{observacoes_ambientais}}

---

## 7. Documentação Condominial

<!-- Incluir quando aplicável (imóvel em condomínio ou conjunto residencial) -->

| Documento | Data | Principais Disposições |
|-----------|------|----------------------|
| **Convenção Condominial** | {{conv_data}} | {{conv_disposicoes}} |
| **Regulamento Interno** | {{reg_data}} | {{reg_disposicoes}} |
| **Ata Relevante** | {{ata_data}} | {{ata_disposicoes}} |
| **Aforamento** | {{afor_data}} | {{afor_disposicoes}} |

---

## 8. Revisão Jurídico-Administrativa

### Uso e Gozo do Imóvel

{{revisao_uso_gozo}}

### Normas Incidentes — Síntese

{{revisao_normas_sintese}}

### Pontos de Atenção

{{revisao_pontos_atencao}}

---

## 9. Conclusões e Recomendações

{{conclusoes}}

### Próximos Passos Recomendados

- [ ] {{proxima_acao_1}}
- [ ] {{proxima_acao_2}}
- [ ] {{proxima_acao_3}}

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
*Property Data Squad v1.0 | Gerado por relator-imobiliario*
