"""Chat session management and agent orchestration."""
from __future__ import annotations

import json
import uuid
from datetime import datetime
from typing import Any

from .document_store import document_store
from .models import (
    AgentInfo,
    ChatMessage,
    ChatSession,
    DocumentReference,
    MessageRole,
    SessionPhase,
)


class ChatManager:
    """Manages chat sessions with context windows and agent routing."""

    def __init__(self) -> None:
        self._sessions: dict[str, ChatSession] = {}

    def create_session(self, title: str = "Nova Analise") -> ChatSession:
        session = ChatSession(title=title)
        session.messages.append(ChatMessage(
            role=MessageRole.SYSTEM,
            content=self._system_prompt(),
            agent_name="sistema",
        ))
        session.messages.append(ChatMessage(
            role=MessageRole.ASSISTANT,
            content=self._welcome_message(),
            agent_id="legal-chief",
            agent_name="@legal-chief",
        ))
        self._sessions[session.session_id] = session
        return session

    def get_session(self, session_id: str) -> ChatSession | None:
        return self._sessions.get(session_id)

    def list_sessions(self) -> list[dict[str, Any]]:
        return [
            {
                "session_id": s.session_id,
                "title": s.title,
                "phase": s.phase,
                "created_at": s.created_at.isoformat(),
                "updated_at": s.updated_at.isoformat(),
                "message_count": len(s.messages),
                "document_count": len(s.documents),
            }
            for s in self._sessions.values()
        ]

    def add_user_message(
        self,
        session_id: str,
        content: str,
        considerations: str = "",
        references: list[DocumentReference] | None = None,
        attachments: list[str] | None = None,
    ) -> ChatMessage:
        session = self._sessions.get(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")

        if considerations:
            session.considerations = considerations

        msg = ChatMessage(
            role=MessageRole.USER,
            content=content,
            references=references or [],
            attachments=attachments or [],
        )
        session.messages.append(msg)
        session.updated_at = datetime.now()
        return msg

    def add_agent_response(
        self,
        session_id: str,
        content: str,
        agent_id: str,
        agent_name: str,
        references: list[DocumentReference] | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> ChatMessage:
        session = self._sessions.get(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")

        msg = ChatMessage(
            role=MessageRole.AGENT,
            content=content,
            agent_id=agent_id,
            agent_name=agent_name,
            references=references or [],
            metadata=metadata or {},
        )
        session.messages.append(msg)
        session.updated_at = datetime.now()
        return msg

    def build_context_window(self, session_id: str, max_messages: int = 50) -> list[dict]:
        """Build context window for AI model consumption."""
        session = self._sessions.get(session_id)
        if not session:
            return []

        context: list[dict] = []

        # System prompt always first
        context.append({
            "role": "system",
            "content": self._system_prompt_with_context(session),
        })

        # Recent messages within window
        recent = session.messages[-max_messages:]
        for msg in recent:
            if msg.role == MessageRole.SYSTEM:
                continue
            role = "assistant" if msg.role in (MessageRole.ASSISTANT, MessageRole.AGENT) else "user"
            content = msg.content

            # Enrich with resolved references
            if msg.references:
                ref_texts = []
                for ref in msg.references:
                    resolved = document_store.resolve_reference(ref)
                    if resolved.get("content"):
                        remissao = document_store.build_remissao_text(ref)
                        ref_texts.append(f"[REFERENCIA {remissao}]:\n{resolved['content'][:2000]}")
                if ref_texts:
                    content += "\n\n---\nREFERENCIAS DOCUMENTAIS:\n" + "\n\n".join(ref_texts)

            if msg.agent_name and role == "assistant":
                content = f"[{msg.agent_name}]: {content}"

            context.append({"role": role, "content": content})

        return context

    def update_phase(self, session_id: str, phase: SessionPhase) -> None:
        session = self._sessions.get(session_id)
        if session:
            session.phase = phase

    def _system_prompt(self) -> str:
        return """Voce e o Legal Analyst Squad, um sistema de inteligencia juridica composto por 15 agentes especializados.
Sua funcao e analisar processos judiciais, pesquisar jurisprudencia, elaborar relatorios estrategicos e minutar pecas processuais de alta qualidade tecnica.

CAPACIDADES:
- Analise processual completa (classificacao TPU/SGT, admissibilidade, compliance CNJ)
- Pesquisa jurisprudencial com consolidacao de precedentes
- Jurimetria e analise quantitativa
- Perfil de Relatores e tendencias decisorias
- Fundamentacao qualificada conforme CPC Art. 489
- Minutas de pecas processuais (peticoes, recursos, contrarrazoes, pareceres)

FORMATO DE REMISSAO:
- Sempre referencie documentos no formato: (Doc. ID XXX, fl. N) ou (Doc. ID XXX, fls. N-M)
- Ao inserir recortes ou imagens de documentos, use: [Recorte: Doc. ID XXX, fl. N - descricao]
- Identifique cada documento por seu ID unico e paginas

PRINCIPIOS:
- Jurisprudencia > Opiniao (sempre fundamentar com precedentes)
- Redacao juridica tecnica e precisa
- Conformidade CNJ obrigatoria
- Citacoes qualificadas (ratio decidendi identificada)"""

    def _system_prompt_with_context(self, session: ChatSession) -> str:
        base = self._system_prompt()

        if session.documents:
            docs_ctx = "\n\nDOCUMENTOS CARREGADOS:"
            for doc in session.documents:
                docs_ctx += f"\n- Doc. ID {doc.doc_id}: {doc.filename}"
                if doc.process_number:
                    docs_ctx += f" | Processo: {doc.process_number}"
                if doc.court:
                    docs_ctx += f" | Tribunal: {doc.court}"
                docs_ctx += f" | {doc.total_pages} paginas"
            base += docs_ctx

        if session.clips:
            clips_ctx = "\n\nRECORTES DISPONIVEIS:"
            for clip in session.clips:
                clips_ctx += f"\n- Clip {clip.clip_id}: {clip.label} (Doc. {clip.doc_id}, fl. {clip.page_start})"
            base += clips_ctx

        if session.considerations:
            base += f"\n\nCONSIDERACOES DO USUARIO:\n{session.considerations}"

        base += f"\n\nFASE ATUAL: {session.phase.value}"

        return base

    def _welcome_message(self) -> str:
        return """Bem-vindo ao **Legal Analyst Squad**.

Sou o **@legal-chief**, orquestrador do pipeline de analise juridica. Tenho a disposicao 15 agentes especializados para oferecer suporte completo na analise processual.

**Como posso ajudar:**

1. **Envie um PDF** de processo judicial para analise completa
2. **Descreva sua demanda** (ex: "elaborar contrarrazoes", "analisar jurisprudencia sobre tema X")
3. **Adicione consideracoes** relevantes sobre o caso

**Comandos disponiveis:**
- `*intake` - Iniciar analise de processo via PDF
- `*relatorio` - Gerar relatorio estrategico
- `*minutar` - Elaborar peca processual
- `*pesquisar` - Pesquisar jurisprudencia
- `*recortar` - Fazer recorte de documento
- `*agentes` - Ver agentes disponiveis

Qual e a sua demanda?"""


# Singleton
chat_manager = ChatManager()
