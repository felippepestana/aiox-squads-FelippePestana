"""In-memory document store with ID-based cross-referencing."""
from __future__ import annotations

from pathlib import Path
from typing import Any

from .config import UPLOAD_DIR
from .models import (
    DocumentClip,
    DocumentMetadata,
    DocumentPage,
    DocumentReference,
    DocumentRefType,
)
from .pdf_processor import clip_region, extract_pdf, get_page_thumbnail, search_in_document


class DocumentStore:
    """Manages uploaded documents, pages, clips, and cross-references."""

    def __init__(self) -> None:
        self._documents: dict[str, DocumentMetadata] = {}
        self._pages: dict[str, list[DocumentPage]] = {}
        self._clips: dict[str, DocumentClip] = {}
        self._filepaths: dict[str, Path] = {}

    def add_document(self, filepath: Path) -> tuple[DocumentMetadata, list[DocumentPage]]:
        metadata, pages = extract_pdf(filepath)
        self._documents[metadata.doc_id] = metadata
        self._pages[metadata.doc_id] = pages
        self._filepaths[metadata.doc_id] = filepath
        return metadata, pages

    def get_document(self, doc_id: str) -> DocumentMetadata | None:
        return self._documents.get(doc_id)

    def get_pages(self, doc_id: str) -> list[DocumentPage]:
        return self._pages.get(doc_id, [])

    def get_page(self, doc_id: str, page_number: int) -> DocumentPage | None:
        pages = self._pages.get(doc_id, [])
        for p in pages:
            if p.page_number == page_number:
                return p
        return None

    def get_page_thumbnail(self, doc_id: str, page_number: int) -> str:
        filepath = self._filepaths.get(doc_id)
        if not filepath:
            return ""
        return get_page_thumbnail(filepath, page_number)

    def create_clip(
        self,
        doc_id: str,
        page_start: int,
        page_end: int | None = None,
        x0: float = 0, y0: float = 0, x1: float = 0, y1: float = 0,
        clip_type: DocumentRefType = DocumentRefType.EXCERPT,
        label: str = "",
    ) -> DocumentClip | None:
        filepath = self._filepaths.get(doc_id)
        if not filepath:
            return None
        clip = clip_region(filepath, page_start, page_end, x0, y0, x1, y1, clip_type, label)
        clip.doc_id = doc_id
        self._clips[clip.clip_id] = clip
        return clip

    def get_clip(self, clip_id: str) -> DocumentClip | None:
        return self._clips.get(clip_id)

    def list_clips(self, doc_id: str | None = None) -> list[DocumentClip]:
        if doc_id:
            return [c for c in self._clips.values() if c.doc_id == doc_id]
        return list(self._clips.values())

    def search(self, doc_id: str, query: str) -> list[dict]:
        filepath = self._filepaths.get(doc_id)
        if not filepath:
            return []
        return search_in_document(filepath, query)

    def resolve_reference(self, ref: DocumentReference) -> dict[str, Any]:
        """Resolve a document reference to its content."""
        result: dict[str, Any] = {"ref": ref.model_dump(), "content": ""}

        if ref.clip_id:
            clip = self.get_clip(ref.clip_id)
            if clip:
                result["content"] = clip.content_text
                result["image_path"] = clip.image_path
                result["label"] = clip.label
            return result

        if ref.page is not None:
            page = self.get_page(ref.doc_id, ref.page)
            if page:
                result["content"] = page.text
            return result

        if ref.page_range:
            parts = ref.page_range.split("-")
            if len(parts) == 2:
                start, end = int(parts[0]), int(parts[1])
                texts = []
                for pn in range(start, end + 1):
                    page = self.get_page(ref.doc_id, pn)
                    if page:
                        texts.append(f"--- Pagina {pn} ---\n{page.text}")
                result["content"] = "\n\n".join(texts)

        return result

    def list_documents(self) -> list[DocumentMetadata]:
        return list(self._documents.values())

    def build_remissao_text(self, ref: DocumentReference) -> str:
        """Build formatted remissao (cross-reference) text for legal pieces."""
        doc = self.get_document(ref.doc_id)
        if not doc:
            return ""

        doc_label = ref.label or doc.filename
        if ref.clip_id:
            clip = self.get_clip(ref.clip_id)
            if clip:
                return f"(Doc. ID {doc.doc_id} - {clip.label}, fls. {clip.page_start}" + \
                       (f"-{clip.page_end}" if clip.page_end != clip.page_start else "") + ")"
        if ref.page is not None:
            return f"(Doc. ID {doc.doc_id} - {doc_label}, fl. {ref.page})"
        if ref.page_range:
            return f"(Doc. ID {doc.doc_id} - {doc_label}, fls. {ref.page_range})"
        return f"(Doc. ID {doc.doc_id} - {doc_label})"


# Singleton
document_store = DocumentStore()
