import { useCallback, useRef, useState } from "react";
import * as api from "../services/api";
import type { ChatMessage, ChatSession, DocumentReference } from "../types";

export function useChat() {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  }, []);

  const initSession = useCallback(async (title?: string) => {
    try {
      setIsLoading(true);
      const data = await api.createSession(title);
      setSession(data);
      setMessages(data.messages || []);
      scrollToBottom();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [scrollToBottom]);

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      const data = await api.getSession(sessionId);
      setSession(data);
      setMessages(data.messages || []);
      scrollToBottom();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [scrollToBottom]);

  const sendMessage = useCallback(
    async (
      content: string,
      considerations?: string,
      references?: DocumentReference[],
      targetAgent?: string,
    ) => {
      if (!session) return;
      setError(null);

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
        attachments: [],
        references: references || [],
        metadata: {},
      };
      setMessages((prev) => [...prev, userMsg]);
      scrollToBottom();

      setIsLoading(true);
      try {
        const response = await api.sendMessage({
          session_id: session.session_id,
          content,
          considerations,
          references,
          target_agent: targetAgent,
        });
        setMessages((prev) => [...prev, response]);
        scrollToBottom();
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [session, scrollToBottom],
  );

  return {
    session,
    messages,
    isLoading,
    error,
    scrollRef,
    initSession,
    loadSession,
    sendMessage,
    setError,
  };
}
