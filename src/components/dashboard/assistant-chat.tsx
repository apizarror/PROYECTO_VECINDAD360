"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  knowledgeBase,
  quickReplies,
  type KnowledgeEntry,
} from "@/lib/assistant-knowledge";
import { SYNONYMS, STOP_WORDS } from "@/lib/assistant-synonyms";
import type { Permission } from "@/hooks/use-auth";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SESSION_KEY_OPEN = "vecino360_open";
const SESSION_KEY_MESSAGES = "vecino360_messages";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/** Simple Spanish stemmer — strips common suffixes. */
function stem(word: string): string {
  if (word.length <= 3) return word;
  return (
    word.replace(
      /(amiento|imiento|acion|icion|mente|ando|iendo|arse|erse|irse|ado|ido|ar|er|ir|es|os|as|an|en)$/i,
      ""
    ) || word
  );
}

/** Remove stop words and very short tokens. */
function removeStopWords(tokens: string[]): string[] {
  return tokens.filter((t) => t.length >= 2 && !STOP_WORDS.has(t));
}

/** Expand query tokens with synonyms from the dictionary. */
function expandWithSynonyms(tokens: string[]): string[] {
  const expanded = new Set(tokens);

  for (const token of tokens) {
    for (const [canonical, syns] of Object.entries(SYNONYMS)) {
      const normCanonical = normalize(canonical);

      // If token matches a synonym → add the canonical keyword
      const matchesSynonym = syns.some((s) => {
        const ns = normalize(s);
        return ns.includes(token) || token.includes(ns);
      });

      if (matchesSynonym) {
        expanded.add(normCanonical);
        // Also add canonical's parts (for multi-word canonicals like "area comun")
        for (const part of normCanonical.split(/\s+/)) {
          if (part.length >= 2) expanded.add(part);
        }
      }

      // If token matches the canonical → add all synonym forms
      if (normCanonical.includes(token) || token.includes(normCanonical)) {
        for (const s of syns) {
          const ns = normalize(s);
          for (const part of ns.split(/\s+/)) {
            if (part.length >= 2) expanded.add(part);
          }
        }
      }
    }
  }

  return Array.from(expanded);
}

function search(
  query: string,
  entries: KnowledgeEntry[],
  userRol: string,
  userPermissions: Permission[]
): string | null {
  const normalizedQuery = normalize(query);
  const rawTokens = normalizedQuery.split(/\s+/).filter((t) => t.length >= 2);
  const meaningfulTokens = removeStopWords(rawTokens);
  const expandedTokens = expandWithSynonyms(
    meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens
  );
  const stemmedTokens = expandedTokens.map(stem);

  const filtered = entries.filter((e) => {
    if (e.rol !== "todos" && e.rol !== userRol) return false;
    if (e.modulo && userRol !== "SUPER_ADMIN") {
      const hasPerm = userPermissions.some(
        (p) => p.modulo === e.modulo && p.leer
      );
      if (!hasPerm) return false;
    }
    return true;
  });

  let best = { score: 0, answer: "" };

  for (const entry of filtered) {
    let score = 0;

    for (const keyword of entry.keywords) {
      const nk = normalize(keyword);

      // 1. Full phrase match in query
      if (normalizedQuery.includes(nk)) {
        score += 15;
        continue;
      }

      // 2. Keyword appears in expanded query as full phrase
      const expandedStr = expandedTokens.join(" ");
      if (expandedStr.includes(nk)) {
        score += 12;
        continue;
      }

      const kwParts = nk.split(/\s+/).filter((p) => p.length >= 2);

      for (const token of expandedTokens) {
        // 3. Token matches keyword part exactly
        for (const kp of kwParts) {
          if (token === kp) score += 5;
          else if (kp.includes(token) || token.includes(kp)) score += 4;
        }
      }

      // 4. Stemmed matching
      const stemmedKwParts = kwParts.map(stem);
      for (const st of stemmedTokens) {
        for (const skp of stemmedKwParts) {
          if (st === skp && st.length >= 3) score += 4;
        }
      }

      // 5. Fuzzy (Levenshtein) on longer tokens
      for (const token of expandedTokens) {
        if (token.length < 4) continue;
        for (const kp of kwParts) {
          if (kp.length < 4) continue;
          if (levenshtein(token, kp) <= 2) score += 3;
        }
      }
    }

    // 6. Fallback: search in answer text
    if (score < 5) {
      const normalizedAnswer = normalize(entry.answer);
      for (const token of expandedTokens) {
        if (token.length >= 3 && normalizedAnswer.includes(token)) {
          score += 1;
        }
      }
    }

    if (score > best.score) best = { score, answer: entry.answer };
  }

  return best.score >= 5 ? best.answer : null;
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AssistantChat() {
  const { user, permissions } = useAuth();
  const rol = user?.rol ?? "RESIDENTE";

  // State
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore session state
  useEffect(() => {
    try {
      const savedOpen = sessionStorage.getItem(SESSION_KEY_OPEN);
      if (savedOpen === "true") setOpen(true);
      const savedMessages = sessionStorage.getItem(SESSION_KEY_MESSAGES);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages) as ChatMessage[];
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist state
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY_OPEN, String(open));
    } catch {
      // ignore
    }
  }, [open]);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY_MESSAGES, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Filtered quick replies
  const visibleQuickReplies = quickReplies.filter((qr) => {
    if (qr.rol !== rol) return false;
    if (qr.modulo && rol !== "SUPER_ADMIN") {
      return permissions.some((p) => p.modulo === qr.modulo && p.leer);
    }
    return true;
  });

  // Send message handler
  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = {
        id: uid(),
        sender: "user",
        text: trimmed,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setTyping(true);

      const answer =
        search(trimmed, knowledgeBase, rol, permissions) ??
        "No encontré información sobre eso. Prueba con otras palabras o contacta al administrador.";

      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: uid(),
          sender: "bot",
          text: answer,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setTyping(false);
      }, 600);
    },
    [rol, permissions]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const clearHistory = () => {
    setMessages([]);
    try {
      sessionStorage.removeItem(SESSION_KEY_MESSAGES);
    } catch {
      // ignore
    }
  };

  // Don't render until we know the user
  if (!user) return null;

  return (
    <>
      {/* Chat panel */}
      <div
        className={`fixed bottom-[88px] right-6 z-50 flex flex-col w-[370px] max-h-[480px] rounded-2xl shadow-2xl overflow-hidden bg-white transition-all duration-200 origin-bottom-right ${
          open
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white font-extrabold text-sm">
            V3
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold leading-tight">
              Vecino360 - Tu asistente
            </p>
            <p className="text-white/70 text-[11px] flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
              En línea
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white transition-colors p-1"
            aria-label="Cerrar chat"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-50"
          style={{ minHeight: 200, maxHeight: 320 }}
        >
          {/* Welcome message if empty */}
          {messages.length === 0 && !typing && (
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-extrabold text-lg mb-3">
                V3
              </div>
              <p className="text-sm text-surface-600 font-medium">
                ¡Hola! Soy Vecino360
              </p>
              <p className="text-xs text-surface-400 mt-1">
                Pregúntame sobre cualquier función del sistema
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary-600 text-white rounded-br-md"
                    : "bg-white text-surface-700 shadow-sm border border-surface-100 rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-surface-100 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-surface-300 animate-bounce [animation-delay:0ms]" />
                <span className="h-2 w-2 rounded-full bg-surface-300 animate-bounce [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-surface-300 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {/* Quick replies — show only when no messages */}
          {messages.length === 0 && !typing && visibleQuickReplies.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {visibleQuickReplies.map((qr) => (
                <button
                  key={qr.text}
                  onClick={() => send(qr.text)}
                  className="text-xs bg-primary-50 text-primary-700 border border-primary-200 rounded-full px-3 py-1.5 hover:bg-primary-100 transition-colors"
                >
                  {qr.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-surface-200 bg-white px-3 py-2.5 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={clearHistory}
            className="text-surface-400 hover:text-surface-600 transition-colors p-1.5 rounded-lg hover:bg-surface-50 flex-shrink-0"
            title="Limpiar historial"
            aria-label="Limpiar historial"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 text-sm bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-surface-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl p-2 transition-colors flex-shrink-0"
            aria-label="Enviar mensaje"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Abrir asistente Vecino360"
      >
        {/* Pulsing dot */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white" />
        </span>
        {/* Icon: V3 or close */}
        {open ? (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <span className="font-extrabold text-base">V3</span>
        )}
      </button>
    </>
  );
}
