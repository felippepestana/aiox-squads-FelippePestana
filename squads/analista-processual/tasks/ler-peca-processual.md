# Task: Ler Peça Processual

**ID:** `ap-ler-peca`
**Executor:** `leitor-de-pecas`
**Tier:** Tier 1
**Use Cases:** UC-AP-002

## Overview

Extrai informações estruturadas de peças processuais (petições, sentenças, acórdãos, despachos, recursos) nas 7 categorias padronizadas.

## Input

- Caminhos de arquivo(s) de peças processuais
- Ou conteúdo textual da peça

## Output

Por documento: tabela com as 7 categorias de extração (tipo, partes, datas, pedidos, fundamentos, decisões, provas).

## Action Items

1. Use Glob para localizar documentos no workspace (se não fornecidos diretamente)
2. Use Read para ler cada documento
3. Use Grep para localizar trechos específicos em documentos extensos
4. Para cada documento, extraia as 7 categorias:
   - Tipo de peça
   - Partes (autor, réu, advogados, intervenientes)
   - Datas (da peça, de protocolo, de eventos relevantes)
   - Pedidos (principal e subsidiário)
   - Fundamentos jurídicos (artigos, legislação, jurisprudência citada)
   - Decisões/ordens
   - Provas e documentos referenciados
5. Sinalize categorias não encontradas com `[NÃO IDENTIFICADO]`

## Acceptance Criteria

- [ ] Todas as 7 categorias preenchidas por documento
- [ ] Itens não encontrados sinalizados (não deixados em branco)
- [ ] Múltiplos documentos tratados separadamente
- [ ] Pedidos transcritos fielmente (sem parafraseamento)
