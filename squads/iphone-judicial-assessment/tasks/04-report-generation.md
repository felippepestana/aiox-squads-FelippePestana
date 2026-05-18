# Task 04 — Report Generation (Geração do Laudo Pericial)

## Agent: Report Writer + Chief Coordinator (supervisão)

## Objetivo

Consolidar todos os dados técnicos e jurídico-normativos em laudo pericial técnico formal, pronto para peticionamento eletrônico judicial, conforme estrutura exigida pelo **CPC/2015, Art. 473** e **ABNT NBR ISO/IEC 17025:2017, Seção 7.8**.

## Passos de Execução

### Passo 4.1 — Coleta de Insumos

Verificar disponibilidade de todos os outputs anteriores:
- [ ] Output da Task 01: ata de recebimento, identificação do dispositivo
- [ ] Output da Task 02: relatório de diagnóstico, fotos, medições
- [ ] Output da Task 03: enquadramento jurídico, análise de nexo causal

### Passo 4.2 — Preenchimento do Template

Utilizar `templates/laudo-tecnico.md` como base.

Regras de preenchimento:
- Substituir todos os campos `[CAMPO]` pelos dados reais
- Numerar todos os parágrafos sequencialmente
- Referenciar todas as fotos no texto (ex: "conforme Foto 03")
- Inserir tabelas de medições em substituição aos placeholders
- Numerar as páginas no rodapé

### Passo 4.3 — Resposta aos Quesitos

Para cada quesito:
1. Transcrever o quesito literalmente como recebido
2. Responder de forma direta, clara e fundamentada
3. Citar a norma ou base técnica que embasou a resposta
4. Usar linguagem acessível (CPC, Art. 473, §2º)

**Formato padrão de resposta:**
```
QUESITO N: "[texto literal do quesito]"

RESPOSTA: [resposta direta na primeira frase]. [Fundamentação técnica].
[Referência à norma ou evidência]. [Conclusão].
```

### Passo 4.4 — Revisão de Consistência

Antes de finalizar, verificar:
- [ ] Número do processo correto em todas as páginas
- [ ] Nome das partes correto e consistente
- [ ] IMEI/número de série do dispositivo conferem com o documentado
- [ ] Todas as fotos referenciadas no texto existem nos anexos
- [ ] Todas as medições têm unidades indicadas
- [ ] Conclusão é consistente com os achados
- [ ] Todos os quesitos foram respondidos
- [ ] Não há contradições internas no documento

### Passo 4.5 — Formatação para Peticionamento

- [ ] Converter para PDF/A (padrão de arquivo para processos judiciais)
- [ ] Aplicar assinatura digital ICP-Brasil (certificado A1 ou A3 do perito)
- [ ] Verificar tamanho do arquivo (sistemas judiciais geralmente limitam a 10-25 MB)
- [ ] Verificar se as fotos estão em resolução adequada (legíveis, mas não excessivas)
- [ ] Numerar páginas do laudo
- [ ] Gerar versão de resumo executivo (1-2 páginas) se solicitado

## Outputs

```yaml
- laudo_tecnico_pericial_[processo].pdf    # Laudo completo assinado digitalmente
- resumo_executivo_[processo].pdf          # Síntese (1-2 páginas)
- fotos_pericia_[processo].pdf             # Compêndio fotográfico separado
- medicoes_[processo].xlsx                 # Planilha de dados brutos
```

## Critério de Conclusão

Task concluída quando:
- Laudo completo preenchido sem campos em branco
- Todos os quesitos respondidos
- Assinatura digital aplicada
- Arquivo dentro dos limites do sistema judicial
- Chief Coordinator aprovou o documento final

## Prazo Típico

1-2 dias úteis para redação + 1 dia para revisão e assinatura
