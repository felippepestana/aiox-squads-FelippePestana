import { useCallback, useState } from "react";
import * as api from "../services/api";
import type { DocumentClip, DocumentMetadata, DocumentPage } from "../types";

export function usePDF() {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [activeDoc, setActiveDoc] = useState<DocumentMetadata | null>(null);
  const [pages, setPages] = useState<DocumentPage[]>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [clips, setClips] = useState<DocumentClip[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const upload = useCallback(async (file: File, sessionId: string) => {
    setUploading(true);
    try {
      const result = await api.uploadDocument(file, sessionId);
      const doc = result.metadata;
      setDocuments((prev) => [...prev, doc]);
      setActiveDoc(doc);
      return result;
    } finally {
      setUploading(false);
    }
  }, []);

  const loadPage = useCallback(async (docId: string, pageNum: number) => {
    const page = await api.getPage(docId, pageNum);
    setPages((prev) => {
      const exists = prev.find((p) => p.page_number === pageNum);
      if (exists) return prev;
      return [...prev, page];
    });
    setActivePage(pageNum);
    return page;
  }, []);

  const loadThumbnail = useCallback(async (docId: string, pageNum: number) => {
    const key = `${docId}-${pageNum}`;
    if (thumbnails[key]) return thumbnails[key];
    try {
      const data = await api.getPageThumbnail(docId, pageNum);
      setThumbnails((prev) => ({ ...prev, [key]: data.thumbnail }));
      return data.thumbnail;
    } catch {
      return null;
    }
  }, [thumbnails]);

  const clipRegion = useCallback(async (data: {
    doc_id: string;
    page_start: number;
    page_end?: number;
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    clip_type?: string;
    label?: string;
  }) => {
    const clip = await api.createClip(data);
    setClips((prev) => [...prev, clip]);
    return clip;
  }, []);

  const searchInDoc = useCallback(async (docId: string, query: string) => {
    const data = await api.searchDocument(docId, query);
    setSearchResults(data.results);
    return data.results;
  }, []);

  return {
    documents,
    activeDoc,
    setActiveDoc,
    pages,
    activePage,
    setActivePage,
    clips,
    thumbnails,
    uploading,
    searchResults,
    upload,
    loadPage,
    loadThumbnail,
    clipRegion,
    searchInDoc,
  };
}
