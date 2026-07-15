# Radar de Teses — Motor Contínuo de Oportunidades Jurídicas (STF/STJ)

Squad multiagente que funciona como **motor de busca contínuo de oportunidades para a advocacia**: monitora teses fixadas nos tribunais superiores (súmulas, repercussão geral, recursos repetitivos, IRDR e IAC), identifica **sinais precoces** (cases de sucesso ainda não vinculantes), executa **due diligence de segurança jurídica** e entrega o pacote comercial completo — matriz de resultados, oferta de alta conversão, contrato + procuração ad judicia, plano de marketing e conteúdo para redes sociais.

## Para quem o radar busca oportunidades

- **Empresas e empresários** de qualquer porte e ramo, inclusive **indústria** e **produtor rural**;
- **Pessoas físicas**, empreendedores, empreendedores individuais (MEI);
- **Trabalhadores celetistas**, públicos ou privados;
- **Servidores públicos** ativos e aposentados de qualquer âmbito: administração direta, indireta, autárquica, fundacional, **agências reguladoras** e autarquias em regime especial.

## Cadeia de comando

| Tier | Papel | Agentes |
|------|-------|---------|
| 0 | Chief | `radar-chief` |
| 1 | Masters — inteligência | `superior-courts-monitor`, `early-signal-scout`, `audience-mapper` |
| 2 | Specialists — segurança e comercial | `due-diligence-analyst`, `outcome-projector`, `offer-architect`, `contract-drafter` |
| 3 | Support — marketing e compliance | `marketing-planner`, `social-content-writer`, `oab-compliance-gate` |

## Fluxos

1. **`wf-thesis-to-offer`** — varredura → sinais precoces → públicos → due diligence (VERDE/AMARELO/VERMELHO) → matriz de resultados → oferta (HTML/PDF + form) → contrato e procuração → gate OAB → validação humana.
2. **`wf-content-engine`** — plano de marketing por segmento → kits de conteúdo (escritório e sócios) → gate OAB/LGPD → aprovação → publicação e medição.

## Princípios inegociáveis

- Fonte oficial citada e verificada em toda tese (STF/STJ, DJe);
- Sinal precoce **sempre** rotulado como não vinculante;
- Resultados classificados: **certo, possível, viável, variável, de risco** — em linguagem técnica e acessível;
- Sem promessa de resultado; publicidade conforme **Provimento OAB 205/2021**; dados conforme **LGPD**;
- **Nenhuma entrega externa sem validação humana** do advogado responsável.

## Página de apresentação

O squad possui uma página web independente (Artifact) que apresenta a arquitetura e demonstra o painel do radar com teses exemplificativas, matriz de resultados, modelo de oferta, minutas e plano de marketing.

> ⚠️ Conteúdo do squad e da página tem caráter metodológico/exemplificativo e não substitui a verificação nas fontes oficiais nem o juízo profissional do advogado responsável.
