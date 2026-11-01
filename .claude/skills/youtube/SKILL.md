---
name: youtube
description: Analisa um vídeo do YouTube extraindo transcrição (legendas ou Whisper) e, opcionalmente, frames. Use quando o usuário enviar um link do YouTube e pedir resumo, extração de informações ou análise do conteúdo.
---

# YouTube

Claude não assiste vídeo: ele lê a transcrição e, se necessário, frames. Esta skill extrai ambos.

## Passos

1. Rode `bash .claude/skills/youtube/extract.sh "<URL>" --out /tmp/yt` (adicione `--frames 10` se o visual importar: slides, telas, gráficos).
2. Leia os arquivos `.srt` gerados em `--out` com a ferramenta Read.
3. Se houver frames, leia só os relevantes (cada imagem consome contexto).
4. Responda ao pedido do usuário citando os trechos/minutos usados.

## Requisitos

- `yt-dlp` (`pip install yt-dlp`)
- Fallback sem legenda: `whisper` (`pip install openai-whisper`) e `ffmpeg`
- Em sessões na nuvem, `youtube.com` precisa estar liberado nas configurações de rede.
- Se o YouTube bloquear, tente `--cookies-from-browser chrome` no `yt-dlp`.

## Observações

- Respeite os termos de uso e os direitos autorais do conteúdo.
- Se a extração falhar, diga o motivo ao usuário em vez de inventar o conteúdo do vídeo.
