# Task: Ler Peças Cíveis

**ID:** `aepc-ler-pecas-civeis`  
**Agent:** `leitor-pecas-civel`  
**Tier:** Tier 1  
**UC:** UC-AEPC-001, 003, 004, 005

## Objetivo

Extrair informações estruturadas de peças processuais civis em 8 categorias obrigatórias.

## Input

- Documentos processuais no workspace (PDF ou TXT)
- Ficha de Classificação do `classificador-civel` para contexto

## Output

Tabela de extração Markdown para cada peça processual com:
1. Tipo de peça
2. Partes (polo ativo, passivo, advogados, intervenientes)
3. Datas (peça, protocolo, eventos relevantes)
4. Pedidos (principal(is) e subsidiário(s) com valores)
5. Fundamentos jurídicos (artigos CPC/CC/especiais, jurisprudência citada)
6. Decisões ou ordens do juízo
7. Preliminares CPC arguidas
8. Provas e documentos referenciados

## Acceptance Criteria

- [ ] Todas as 8 categorias presentes para cada peça
- [ ] Itens não encontrados marcados como [NÃO IDENTIFICADO]
- [ ] Artigos CPC/CC citados preservados fielmente
- [ ] Valores monétários preservados sem arredondamento
- [ ] Sem opinião sobre mérito ou chances do processo

**Depends On:** `aepc-auditar-compliance-cpc`  
**Executa em paralelo com:** `aepc-pesquisar-cpc-stj`  
**Feeds Into:** `aepc-analisar-estrategia-civel`, `aepc-analisar-recurso`
