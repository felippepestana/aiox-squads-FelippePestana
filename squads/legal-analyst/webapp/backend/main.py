"""Legal Analyst Squad - Web Application Backend."""
from __future__ import annotations

import shutil
import uuid
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from core.agent_engine import process_message
from core.chat_manager import chat_manager
from core.config import ALLOWED_EXTENSIONS, CLIPS_DIR, CORS_ORIGINS, MAX_UPLOAD_SIZE_MB, UPLOAD_DIR
from core.document_store import document_store
from core.models import (
    AgentCreationRequest,
    AgentSearchRequest,
    ClipRequest,
    DocumentRefType,
    DraftPieceRequest,
    SendMessageRequest,
    StrategicReportRequest,
    UploadResponse,
)
from core.stripe_service import (
    CheckoutRequest,
    create_checkout_session,
    create_one_time_checkout,
    get_subscription_status,
    cancel_subscription,
    process_webhook,
    validate_access,
    get_plans,
    STRIPE_PUBLISHABLE_KEY,
)
from agents.loader import load_all_agents, load_agent, search_agents, get_agent_full_prompt

app = FastAPI(
    title="Legal Analyst Squad",
    description="Sistema de Inteligencia Juridica com 15 Agentes Especializados",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve clips as static files
if CLIPS_DIR.exists():
    app.mount("/clips", StaticFiles(directory=str(CLIPS_DIR)), name="clips")


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.get("/api/health")
async def health():
    return {"status": "ok", "squad": "legal-analyst", "version": "1.0.0"}


# ---------------------------------------------------------------------------
# Chat Sessions
# ---------------------------------------------------------------------------

@app.post("/api/sessions")
async def create_session(title: str = "Nova Analise"):
    session = chat_manager.create_session(title=title)
    return session.model_dump()


@app.get("/api/sessions")
async def list_sessions():
    return chat_manager.list_sessions()


@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str):
    session = chat_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sessao nao encontrada")
    return session.model_dump()


@app.post("/api/chat")
async def send_message(req: SendMessageRequest):
    session = chat_manager.get_session(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sessao nao encontrada")

    response = await process_message(
        session_id=req.session_id,
        content=req.content,
        considerations=req.considerations,
        references=req.references,
        target_agent=req.target_agent,
    )
    return response.model_dump()


# ---------------------------------------------------------------------------
# Document Upload & Management
# ---------------------------------------------------------------------------

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...), session_id: str = ""):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Arquivo sem nome")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Extensao {ext} nao permitida. Use: {ALLOWED_EXTENSIONS}")

    content = await file.read()
    if len(content) > MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"Arquivo excede {MAX_UPLOAD_SIZE_MB}MB")

    safe_name = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    filepath = UPLOAD_DIR / safe_name
    filepath.write_bytes(content)

    metadata, pages = document_store.add_document(filepath)

    # Associate with session
    if session_id:
        session = chat_manager.get_session(session_id)
        if session:
            session.documents.append(metadata)

    return UploadResponse(
        doc_id=metadata.doc_id,
        filename=file.filename,
        total_pages=metadata.total_pages,
        metadata=metadata,
    ).model_dump()


@app.get("/api/documents")
async def list_documents():
    return [d.model_dump() for d in document_store.list_documents()]


@app.get("/api/documents/{doc_id}")
async def get_document(doc_id: str):
    doc = document_store.get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Documento nao encontrado")
    return doc.model_dump()


@app.get("/api/documents/{doc_id}/pages/{page_number}")
async def get_page(doc_id: str, page_number: int):
    page = document_store.get_page(doc_id, page_number)
    if not page:
        raise HTTPException(status_code=404, detail="Pagina nao encontrada")
    return page.model_dump()


@app.get("/api/documents/{doc_id}/pages/{page_number}/thumbnail")
async def get_page_thumbnail(doc_id: str, page_number: int):
    thumbnail = document_store.get_page_thumbnail(doc_id, page_number)
    if not thumbnail:
        raise HTTPException(status_code=404, detail="Thumbnail nao disponivel")
    return {"thumbnail": thumbnail, "page": page_number}


@app.get("/api/documents/{doc_id}/search")
async def search_document(doc_id: str, q: str = ""):
    if not q:
        raise HTTPException(status_code=400, detail="Query vazia")
    results = document_store.search(doc_id, q)
    return {"results": results, "total": len(results)}


# ---------------------------------------------------------------------------
# Document Clipping
# ---------------------------------------------------------------------------

@app.post("/api/clips")
async def create_clip(req: ClipRequest):
    clip = document_store.create_clip(
        doc_id=req.doc_id,
        page_start=req.page_start,
        page_end=req.page_end,
        x0=req.x0, y0=req.y0, x1=req.x1, y1=req.y1,
        clip_type=req.clip_type,
        label=req.label,
    )
    if not clip:
        raise HTTPException(status_code=404, detail="Documento nao encontrado")
    return clip.model_dump()


@app.get("/api/clips")
async def list_clips(doc_id: str | None = None):
    clips = document_store.list_clips(doc_id)
    return [c.model_dump() for c in clips]


@app.get("/api/clips/{clip_id}")
async def get_clip(clip_id: str):
    clip = document_store.get_clip(clip_id)
    if not clip:
        raise HTTPException(status_code=404, detail="Recorte nao encontrado")
    return clip.model_dump()


@app.get("/api/clips/{clip_id}/image")
async def get_clip_image(clip_id: str):
    clip = document_store.get_clip(clip_id)
    if not clip or not clip.image_path:
        raise HTTPException(status_code=404, detail="Imagem nao encontrada")
    return FileResponse(clip.image_path)


# ---------------------------------------------------------------------------
# Agents
# ---------------------------------------------------------------------------

@app.get("/api/agents")
async def list_agents():
    agents = load_all_agents()
    return [a.model_dump() for a in agents]


@app.get("/api/agents/{agent_id}")
async def get_agent(agent_id: str):
    agent = load_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agente nao encontrado")
    return agent.model_dump()


@app.get("/api/agents/{agent_id}/prompt")
async def get_agent_prompt(agent_id: str):
    prompt = get_agent_full_prompt(agent_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Agente nao encontrado")
    return {"agent_id": agent_id, "prompt": prompt}


@app.post("/api/agents/search")
async def search_agents_endpoint(req: AgentSearchRequest):
    agents = load_all_agents()
    results = search_agents(req.query, agents)
    return [a.model_dump() for a in results]


@app.post("/api/agents/create")
async def create_agent(req: AgentCreationRequest):
    """Create a new agent via skill-based generation."""
    agent_template = f"""# {req.name}

## COMPLETE AGENT DEFINITION

```yaml
agent:
  name: {req.name}
  id: {req.name.lower().replace(' ', '-')}
  title: {req.role}
  icon: "⚖️"
  tier: {req.tier.value}
  squad: legal-analyst
  whenToUse: |
    {req.expertise}
  customization: |
    Agente criado via skill para compor o squad legal-analyst.

persona:
  role: {req.role}
  style: {req.style}
  identity: |
    Especialista em {req.expertise}
  focus: |
    {req.expertise}

commands:
{chr(10).join(f'  - name: {cmd}{chr(10)}    description: "Comando {cmd}"' for cmd in req.commands) if req.commands else '  - name: analisar' + chr(10) + '    description: "Analise especializada"'}
```
"""
    from core.config import AGENTS_DIR
    agent_file = AGENTS_DIR / f"{req.name.lower().replace(' ', '-')}.md"
    agent_file.write_text(agent_template, encoding="utf-8")

    return {
        "status": "created",
        "agent_id": req.name.lower().replace(" ", "-"),
        "filepath": str(agent_file),
        "message": f"Agente {req.name} criado com sucesso via skill.",
    }


# ---------------------------------------------------------------------------
# Legal Drafting
# ---------------------------------------------------------------------------

@app.post("/api/draft")
async def draft_piece(req: DraftPieceRequest):
    """Generate a legal piece draft with document references and clips."""
    session = chat_manager.get_session(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sessao nao encontrada")

    response = await process_message(
        session_id=req.session_id,
        content=f"*minutar {req.piece_type} {req.instructions}",
        considerations=req.considerations,
        references=req.references,
    )
    return response.model_dump()


@app.post("/api/report")
async def strategic_report(req: StrategicReportRequest):
    """Generate a strategic legal report."""
    session = chat_manager.get_session(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sessao nao encontrada")

    focus = ", ".join(req.focus_areas) if req.focus_areas else "analise completa"
    response = await process_message(
        session_id=req.session_id,
        content=f"*relatorio {focus}",
    )
    return response.model_dump()


# ---------------------------------------------------------------------------
# Stripe Payments & VSL
# ---------------------------------------------------------------------------

@app.get("/api/stripe/config")
async def stripe_config():
    return {"publishable_key": STRIPE_PUBLISHABLE_KEY}


@app.get("/api/stripe/plans")
async def stripe_plans():
    return get_plans()


@app.post("/api/stripe/checkout")
async def stripe_checkout(req: CheckoutRequest):
    try:
        result = create_checkout_session(req)
        return result.model_dump()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stripe error: {str(e)}")


@app.post("/api/stripe/checkout-once")
async def stripe_checkout_once(amount: int = 19700, description: str = "Legal Analyst Pro", email: str = ""):
    try:
        result = create_one_time_checkout(amount, description, email)
        return result.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stripe error: {str(e)}")


@app.post("/api/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    try:
        result = process_webhook(payload, sig)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/stripe/subscription/{email}")
async def stripe_subscription(email: str):
    return get_subscription_status(email).model_dump()


@app.post("/api/stripe/cancel/{email}")
async def stripe_cancel(email: str):
    return cancel_subscription(email)


@app.get("/api/stripe/validate/{token}")
async def stripe_validate(token: str):
    access = validate_access(token)
    if not access:
        raise HTTPException(status_code=401, detail="Token invalido ou expirado")
    return access.model_dump()


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
