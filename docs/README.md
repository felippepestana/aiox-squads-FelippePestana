# Property Data — Demo iPhone (GitHub Pages)

Demo standalone da vistoria mobile, servida via GitHub Pages — **otimizado para iPhone 17 / iOS 18+**.

## Novidades v2

- ✅ **Guia técnico de foto** pré-captura (distância, posição, ângulo, iluminação, enquadramento)
- ✅ **Detecção de 8 patologias** prediais com 3 níveis de severidade
- ✅ **PWA instalável** via "Adicionar à Tela de Início"
- ✅ **Service Worker** para funcionamento offline
- ✅ **iPhone 17 / iOS 18+** com Dynamic Island e safe-area
- ✅ **Manifest.json** com ícones SVG e atalhos

## Como Publicar (30 segundos)

1. Acesse as **configurações do repositório no GitHub:**
   https://github.com/felippepestana/aiox-squads-FelippePestana/settings/pages

2. Em **Source**, selecione:
   - **Branch:** `claude/property-data-skill-mIW9q`
   - **Folder:** `/docs`

3. Clique **Save**

4. Aguarde 30-60 segundos. A URL aparecerá no topo da página:
   ```
   https://felippepestana.github.io/aiox-squads-FelippePestana/
   ```

## URLs Disponíveis

Após publicação:

| Página | URL |
|--------|-----|
| **Dashboard** | `https://felippepestana.github.io/aiox-squads-FelippePestana/` |
| **Vistoria** | `https://felippepestana.github.io/aiox-squads-FelippePestana/vistoria.html` |

## Como Testar no iPhone

1. Abra a URL no **Safari**
2. Toque em **"Iniciar Vistoria"**
3. Para cada item com foto, toque em **"📸 Tirar Foto"**
4. O iPhone pedirá permissão à câmera → **Permitir**
5. A câmera traseira abre automaticamente
6. Tire a foto → ela aparece como preview na lista
7. Complete as perguntas qualificadoras
8. Toque em **"✅ Concluir"** → baixa JSON com todos os dados

## Funcionalidades

- ✅ Câmera traseira do iPhone (`capture="environment"`)
- ✅ 5 fotos obrigatórias + 5 opcionais
- ✅ 8 perguntas qualificadoras (rádio/multi-select)
- ✅ Salvamento automático (localStorage)
- ✅ Compressão de imagens (1200px, 70% JPEG)
- ✅ Funciona 100% offline após primeiro acesso
- ✅ Totalmente responsivo
- ✅ Touch targets de 44-56px (WCAG AAA)
- ✅ Safe area para iPhones com notch
- ✅ Exportação JSON ao concluir

## Dados do Exemplo

**Imóvel:** Rua Ramos Ferreira, 1000
**Bairro:** Centro, Manaus/AM
**Tipo:** Comercial · 450 m²
**Matrícula:** M-12.345 (demo)

## Arquitetura

Arquivo único `vistoria.html` sem dependências externas:
- HTML5 + CSS3 + JavaScript vanilla
- Sem framework
- Sem build
- Carrega instantaneamente
- ~25 KB total

## Ativar no Celular como "App"

No iPhone/Safari:
1. Abra a URL
2. Toque em **Compartilhar** (ícone quadrado com seta)
3. Role para baixo e toque em **"Adicionar à Tela de Início"**
4. Nome: "Vistoria"
5. Toque em **Adicionar**

Agora você tem um ícone na home screen que abre o app em tela cheia (sem barra do Safari).

---

*Demo GitHub Pages · Property Data Squad v1.0*
