# Padrões de Qualidade de Conteúdo

Referência para `content-forge` e `learning-gate`. Garante que o conteúdo gerado seja eficaz, correto e acessível.

---

## 1. Verificação de SME (Subject Matter Expert)

Conteúdo gerado por IA é rápido, **mas não é autoritativo por si só**. Domínios críticos exigem revisão humana especializada antes de publicar.

**Domínios que sempre exigem SME:**
- Jurídico / trabalhista / compliance (risco legal)
- Técnico especializado (engenharia, segurança, TI crítica)
- Médico / saúde ocupacional
- Financeiro / fiscal / contábil

**Processo:**
1. O `content-forge` marca cada afirmação crítica com `requer_SME: true`
2. Um especialista verifica e aprova/corrige
3. O `learning-gate` VETA a publicação se houver flag não resolvida em domínio crítico

> Disseminar uma afirmação legal errada em escala é dano real, não detalhe editorial.

## 2. Microlearning

- **Blocos de 5–10 minutos**, um conceito por bloco
- **Exemplo concreto antes da abstração** (o cérebro ancora no concreto)
- **Progressão** do simples ao complexo
- Evitar **muro de texto** — chunking e espaçamento visual

## 3. Carga Cognitiva (Cognitive Load Theory)

- **Carga intrínseca:** dividir conteúdo complexo em partes gerenciáveis
- **Carga estranha:** remover distração (jargão, ornamentação irrelevante)
- **Carga pertinente:** usar exemplos e prática que constroem esquemas mentais
- Sobrecarga → retenção despenca

## 4. Quizzes válidos

- Testam **entendimento e aplicação**, não memorização literal
- Sem pegadinha de redação (mede leitura, não aprendizado)
- Feedback explicativo (por que a resposta está certa/errada)
- Alinhados ao nível de Bloom do objetivo

## 5. Acessibilidade (WCAG básico)

Aprendizagem é para **todos**. Conteúdo essencial não pode depender de um único canal:

| Mídia | Alternativa obrigatória |
|-------|-------------------------|
| Vídeo | Transcrição + legendas |
| Imagem informativa | Texto alternativo (alt) |
| Áudio | Transcrição |
| Cor como informação | Rótulo/textura redundante |

- Legibilidade: linguagem clara, estrutura navegável, contraste adequado
- O `learning-gate` VETA se um canal único essencial não tem alternativa

## 6. Honestidade sobre incerteza

- Conteúdo gerado nunca se apresenta como verdade absoluta em domínio crítico
- Quando há debate/variação, sinalizar ("práticas variam; verifique a política interna")
- Citar a necessidade de contexto local (ex: política da empresa, legislação aplicável)

---

## Resumo para o gate

| Padrão | Falha → |
|--------|---------|
| Conteúdo crítico verificado por SME | VETO |
| Microlearning (blocos curtos, 1 conceito) | revisar |
| Quiz de aplicação (não decoreba) | revisar |
| Canal alternativo para mídia essencial | VETO |
