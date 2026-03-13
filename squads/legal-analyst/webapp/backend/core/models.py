"""Pydantic models for API requests and responses."""
from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    AGENT = "agent"


class AgentTier(str, Enum):
    ORCHESTRATOR = "orchestrator"
    TIER_0 = "tier_0"
    TIER_1 = "tier_1"
    TIER_2 = "tier_2"
    TIER_3 = "tier_3"


class SessionPhase(str, Enum):
    INTAKE = "intake"
    TRIAGEM = "triagem"
    PESQUISA = "pesquisa"
    ANALISE = "analise"
    FUNDAMENTACAO = "fundamentacao"
    VALIDACAO = "validacao"
    ENTREGA = "entrega"


class DocumentRefType(str, Enum):
    PAGE = "page"
    CLIP = "clip"
    IMAGE = "image"
    EXCERPT = "excerpt"


# ---------------------------------------------------------------------------
# Document & PDF Models
# ---------------------------------------------------------------------------

class DocumentPage(BaseModel):
    page_number: int
    text: str
    images: list[str] = Field(default_factory=list)
    word_count: int = 0


class DocumentMetadata(BaseModel):
    doc_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    filename: str
    title: str = ""
    total_pages: int = 0
    file_size_bytes: int = 0
    upload_timestamp: datetime = Field(default_factory=datetime.now)
    extracted_parties: list[str] = Field(default_factory=list)
    process_number: str = ""
    court: str = ""
    subject: str = ""


class DocumentClip(BaseModel):
    clip_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    doc_id: str
    page_start: int
    page_end: int
    x0: float = 0
    y0: float = 0
    x1: float = 0
    y1: float = 0
    clip_type: DocumentRefType = DocumentRefType.EXCERPT
    content_text: str = ""
    image_path: str | None = None
    label: str = ""


class DocumentReference(BaseModel):
    doc_id: str
    page: int | None = None
    page_range: str | None = None
    clip_id: str | None = None
    label: str = ""
    ref_type: DocumentRefType = DocumentRefType.PAGE


# ---------------------------------------------------------------------------
# Chat Models
# ---------------------------------------------------------------------------

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: MessageRole
    content: str
    agent_id: str | None = None
    agent_name: str | None = None
    timestamp: datetime = Field(default_factory=datetime.now)
    attachments: list[str] = Field(default_factory=list)
    references: list[DocumentReference] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ChatSession(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = "Nova Sessao"
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    phase: SessionPhase = SessionPhase.INTAKE
    messages: list[ChatMessage] = Field(default_factory=list)
    documents: list[DocumentMetadata] = Field(default_factory=list)
    clips: list[DocumentClip] = Field(default_factory=list)
    active_agents: list[str] = Field(default_factory=list)
    considerations: str = ""
    context_summary: str = ""


# ---------------------------------------------------------------------------
# Agent Models
# ---------------------------------------------------------------------------

class AgentInfo(BaseModel):
    agent_id: str
    name: str
    title: str = ""
    icon: str = ""
    tier: AgentTier = AgentTier.TIER_1
    squad: str = "legal-analyst"
    description: str = ""
    commands: list[dict[str, Any]] = Field(default_factory=list)
    expertise_domains: list[str] = Field(default_factory=list)
    status: str = "available"
    is_custom: bool = False


class AgentCreationRequest(BaseModel):
    name: str
    role: str
    expertise: str
    tier: AgentTier = AgentTier.TIER_2
    style: str = "tecnico e preciso"
    commands: list[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# API Request / Response
# ---------------------------------------------------------------------------

class SendMessageRequest(BaseModel):
    session_id: str
    content: str
    considerations: str = ""
    references: list[DocumentReference] = Field(default_factory=list)
    target_agent: str | None = None


class UploadResponse(BaseModel):
    doc_id: str
    filename: str
    total_pages: int
    metadata: DocumentMetadata


class ClipRequest(BaseModel):
    doc_id: str
    page_start: int
    page_end: int | None = None
    x0: float = 0
    y0: float = 0
    x1: float = 0
    y1: float = 0
    clip_type: DocumentRefType = DocumentRefType.EXCERPT
    label: str = ""


class DraftPieceRequest(BaseModel):
    session_id: str
    piece_type: str  # "contrarrazoes", "recurso", "peticao", "parecer", etc.
    considerations: str = ""
    references: list[DocumentReference] = Field(default_factory=list)
    clips: list[str] = Field(default_factory=list)  # clip_ids to include
    instructions: str = ""


class StrategicReportRequest(BaseModel):
    session_id: str
    focus_areas: list[str] = Field(default_factory=list)


class AgentSearchRequest(BaseModel):
    query: str
    domain: str = "legal"
    include_external: bool = False
