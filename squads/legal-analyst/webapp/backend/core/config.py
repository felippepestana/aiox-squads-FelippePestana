"""Application configuration."""
import os
from pathlib import Path

SQUAD_ROOT = Path(__file__).resolve().parents[3]
AGENTS_DIR = SQUAD_ROOT / "agents"
DATA_DIR = SQUAD_ROOT / "data"
TEMPLATES_DIR = SQUAD_ROOT / "templates"
WORKFLOWS_DIR = SQUAD_ROOT / "workflows"
CHECKLISTS_DIR = SQUAD_ROOT / "checklists"

UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

CLIPS_DIR = Path(__file__).resolve().parents[1] / "clips"
CLIPS_DIR.mkdir(exist_ok=True)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")

MAX_UPLOAD_SIZE_MB = 50
ALLOWED_EXTENSIONS = {".pdf"}

APP_URL = os.getenv("APP_URL", "http://localhost:3000")

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    APP_URL,
]
