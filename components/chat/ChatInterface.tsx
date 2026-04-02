"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Paperclip,
  Send,
  X,
  Plus,
  Sparkles,
  Loader2,
  BookOpen,
  ClipboardList,
  ExternalLink,
} from "lucide-react";
import FlashcardDisplay from "./FlashcardDisplay";
import QuizDisplay from "./QuizDisplay";
import ChatSidebar from "./ChatSidebar";
import MarkdownRenderer from "./MarkdownRenderer";
import StudyMaterialSheet, {
  Flashcard,
  Question,
} from "./StudyMaterialSheet";
import Link from "next/link";
import { ChatSummary, StoredMessage } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content:
    | string
    | { flashcards: Flashcard[] }
    | { questions: Question[] };
  type: "text" | "flashcards" | "quiz";
  pdfName?: string;
  streaming?: boolean;
}

function fromStored(m: StoredMessage): Message {
  return {
    id: m.id,
    role: m.role,
    content: m.content as Message["content"],
    type: m.type,
    pdfName: m.pdfName,
  };
}

interface SheetState {
  flashcards?: Flashcard[];
  questions?: Question[];
  defaultTab?: "flashcards" | "quiz";
}

export default function ChatInterface() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Study material sheet
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetState, setSheetState] = useState<SheetState>({});

  // Loading indicators for parallel structured calls
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const { user } = useUser();
  const userInitial = (
    user?.firstName?.[0] ??
    user?.username?.[0] ??
    user?.emailAddresses?.[0]?.emailAddress?.[0] ??
    "U"
  ).toUpperCase();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChats = useCallback(async () => {
    try {
      const res = await fetch("/api/chats");
      if (res.ok) setChats(await res.json());
    } finally {
      setChatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const loadChat = useCallback(async (id: string) => {
    setIsLoading(true);
    setMessages([]);
    setSheetOpen(false);
    setSheetState({});
    try {
      const res = await fetch(`/api/chats/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages((data.messages ?? []).map(fromStored));
        setChatId(id);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNewChat = () => {
    setChatId(null);
    setMessages([]);
    setInput("");
    setPdfFile(null);
    setPdfName(null);
    setError(null);
    setSheetOpen(false);
    setSheetState({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSelectChat = (id: string) => {
    if (id === chatId) return;
    loadChat(id);
  };

  const handleDeleteChat = async (id: string) => {
    await fetch(`/api/chats/${id}`, { method: "DELETE" });
    if (id === chatId) handleNewChat();
    setChats((prev) => prev.filter((c) => c._id !== id));
  };

  const handleRenameChat = async (id: string, name: string) => {
    await fetch(`/api/chats/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setChats((prev) => prev.map((c) => (c._id === id ? { ...c, name } : c)));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    setPdfFile(file);
    setPdfName(file.name);
    setError(null);
  };

  const openSheetFor = (msg: Message) => {
    if (msg.type === "flashcards" && typeof msg.content === "object" && "flashcards" in msg.content) {
      setSheetState({ flashcards: (msg.content as { flashcards: Flashcard[] }).flashcards, defaultTab: "flashcards" });
      setSheetOpen(true);
    } else if (msg.type === "quiz" && typeof msg.content === "object" && "questions" in msg.content) {
      setSheetState({ questions: (msg.content as { questions: Question[] }).questions, defaultTab: "quiz" });
      setSheetOpen(true);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !pdfFile) return;
    if (isLoading) return;

    setError(null);

    let activeChatId = chatId;
    if (!activeChatId) {
      try {
        const res = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "New Chat" }),
        });
        const data = await res.json();
        activeChatId = data._id;
        setChatId(activeChatId);
        setChats((prev) => [data, ...prev]);
      } catch {
        setError("Failed to create chat. Please try again.");
        return;
      }
    }

    const capturedPdfName = pdfName;
    const capturedPdfFile = pdfFile;
    const sentInput = input.trim();

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: sentInput, type: "text", pdfName: capturedPdfName ?? undefined },
    ]);
    setInput("");
    setPdfFile(null);
    setPdfName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", sentInput);
      formData.append("chatId", activeChatId!);
      if (capturedPdfFile) formData.append("pdf", capturedPdfFile);

      const res = await fetch("/api/chat", { method: "POST", body: formData });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || "Failed to get response");
      }

      // Read routing flags before consuming stream
      const generateFlashcards = res.headers.get("X-Generate-Flashcards") === "true";
      const generateQuiz = res.headers.get("X-Generate-Quiz") === "true";

      // Stream the generalist response
      const streamMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: streamMsgId, role: "assistant", content: "", type: "text", streaming: true },
      ]);
      setIsLoading(false);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => m.id === streamMsgId ? { ...m, content: accumulated } : m)
        );
      }
      setMessages((prev) =>
        prev.map((m) => m.id === streamMsgId ? { ...m, streaming: false } : m)
      );
      loadChats();

      // Fire structured calls in parallel if flagged
      const pending: Promise<void>[] = [];

      if (generateFlashcards) {
        setLoadingFlashcards(true);
        pending.push(
          fetch("/api/chat/flashcards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId: activeChatId, message: sentInput }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.content?.flashcards) {
                const msg: Message = {
                  id: data.messageId ?? Date.now().toString(),
                  role: "assistant",
                  content: data.content,
                  type: "flashcards",
                };
                setMessages((prev) => [...prev, msg]);
                setSheetState((prev) => ({ ...prev, flashcards: data.content.flashcards, defaultTab: "flashcards" }));
                setSheetOpen(true);
              }
            })
            .finally(() => setLoadingFlashcards(false))
        );
      }

      if (generateQuiz) {
        setLoadingQuiz(true);
        pending.push(
          fetch("/api/chat/quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId: activeChatId, message: sentInput }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.content?.questions) {
                const msg: Message = {
                  id: data.messageId ?? Date.now().toString(),
                  role: "assistant",
                  content: data.content,
                  type: "quiz",
                };
                setMessages((prev) => [...prev, msg]);
                setSheetState((prev) => ({ ...prev, questions: data.content.questions, defaultTab: prev.flashcards ? prev.defaultTab : "quiz" }));
                setSheetOpen(true);
              }
            })
            .finally(() => setLoadingQuiz(false))
        );
      }

      await Promise.allSettled(pending);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderMessage = (msg: Message) => {
    // ── User (LEFT) ──────────────────────────────────────────────────────────
    if (msg.role === "user") {
      return (
        <div key={msg.id} className="flex justify-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#374151] flex items-center justify-center text-xs text-white shrink-0 mt-1 font-bold">
            {userInitial}
          </div>
          <div className="max-w-[80%] space-y-2">
            {msg.pdfName && (
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3 w-fit">
                <div className="w-7 h-8 bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center shrink-0">
                  <span className="text-red-400 text-xs font-bold">PDF</span>
                </div>
                <span className="text-sm text-[#fffffe] font-medium truncate max-w-[180px]">
                  {msg.pdfName}
                </span>
              </div>
            )}
            {typeof msg.content === "string" && msg.content && (
              <div className="bg-[#1a1830] border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-white leading-relaxed w-fit">
                {msg.content}
              </div>
            )}
          </div>
        </div>
      );
    }

    // ── Assistant: flashcards / quiz → clickable card (RIGHT) ───────────────
    if (msg.type === "flashcards" && typeof msg.content === "object" && "flashcards" in msg.content) {
      const count = (msg.content as { flashcards: Flashcard[] }).flashcards.length;
      return (
        <div key={msg.id} className="flex flex-row-reverse gap-3">
          <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0 mt-1">
            <Sparkles className="w-4 h-4" />
          </div>
          <button
            onClick={() => openSheetFor(msg)}
            className="bg-[#7c3aed]/10 border border-[#7c3aed]/30 hover:border-[#7c3aed]/60 hover:bg-[#7c3aed]/20 rounded-2xl rounded-tr-none px-4 py-3 flex items-center gap-3 transition-all duration-200 cursor-pointer text-left"
          >
            <BookOpen className="w-5 h-5 text-[#7c3aed] shrink-0" />
            <div>
              <p className="text-white font-medium text-sm">Flashcards ready</p>
              <p className="text-[#a8a4c4] text-xs">{count} cards · Click to study</p>
            </div>
            <ExternalLink className="w-4 h-4 text-[#7c3aed] ml-2 shrink-0" />
          </button>
        </div>
      );
    }

    if (msg.type === "quiz" && typeof msg.content === "object" && "questions" in msg.content) {
      const count = (msg.content as { questions: Question[] }).questions.length;
      return (
        <div key={msg.id} className="flex flex-row-reverse gap-3">
          <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0 mt-1">
            <Sparkles className="w-4 h-4" />
          </div>
          <button
            onClick={() => openSheetFor(msg)}
            className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 hover:border-[#f59e0b]/60 hover:bg-[#f59e0b]/20 rounded-2xl rounded-tr-none px-4 py-3 flex items-center gap-3 transition-all duration-200 cursor-pointer text-left"
          >
            <ClipboardList className="w-5 h-5 text-[#f59e0b] shrink-0" />
            <div>
              <p className="text-white font-medium text-sm">Quiz ready</p>
              <p className="text-[#a8a4c4] text-xs">{count} questions · Click to take</p>
            </div>
            <ExternalLink className="w-4 h-4 text-[#f59e0b] ml-2 shrink-0" />
          </button>
        </div>
      );
    }

    // ── Assistant: text (RIGHT) ──────────────────────────────────────────────
    return (
      <div key={msg.id} className="flex flex-row-reverse gap-3">
        <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0 mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="max-w-[85%] min-w-0">
          <div className="bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-2xl rounded-tr-none px-4 py-3">
            <MarkdownRenderer content={msg.content as string} streaming={msg.streaming} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f0e17]">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0f0e17]/80 backdrop-blur-xl shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#7c3aed] rounded-lg flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span
            className="text-lg font-bold text-white hidden sm:block"
            style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
          >
            StudyMind AI
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleNewChat}
            variant="ghost"
            size="sm"
            className="text-[#a8a4c4] hover:text-white hover:bg-white/10 gap-2 lg:hidden cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
          <UserButton />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!chatsLoading && (
          <ChatSidebar
            chats={chats}
            currentChatId={chatId}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
          />
        )}

        {/* Main chat */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-16 h-16 bg-[#7c3aed]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-[#7c3aed]" />
                </div>
                <h2
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-display, Fraunces, serif)" }}
                >
                  What would you like to study?
                </h2>
                <p className="text-[#a8a4c4] text-sm max-w-sm mb-8">
                  Upload a PDF and ask me anything. I can explain concepts,
                  create flashcards, or quiz you on the material.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl w-full">
                  {[
                    { icon: "💬", label: "Ask a question", prompt: "Explain the key concepts from this PDF" },
                    { icon: "🃏", label: "Make flashcards", prompt: "Generate flashcards from this material" },
                    { icon: "📝", label: "Quiz me", prompt: "Quiz me on this PDF" },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setInput(s.prompt)}
                      className="bg-[#1a1830] border border-white/10 rounded-xl p-4 text-left hover:border-[#7c3aed]/30 hover:bg-[#7c3aed]/5 transition-all duration-200 cursor-pointer"
                    >
                      <span className="text-xl mb-2 block">{s.icon}</span>
                      <span className="text-sm text-[#fffffe] font-medium">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.length === 0 && isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-[#7c3aed] animate-spin" />
              </div>
            )}

            {messages.map(renderMessage)}

            {/* Thinking spinner (generalist waiting) */}
            {isLoading && (
              <div className="flex flex-row-reverse gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-2xl rounded-tr-none px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#7c3aed] animate-spin" />
                  <span className="text-sm text-[#a8a4c4]">Thinking…</span>
                </div>
              </div>
            )}

            {/* Flashcards / quiz loading indicators */}
            {loadingFlashcards && (
              <div className="flex flex-row-reverse gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-2xl rounded-tr-none px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#7c3aed] animate-spin" />
                  <BookOpen className="w-4 h-4 text-[#7c3aed]" />
                  <span className="text-sm text-[#a8a4c4]">Generating flashcards…</span>
                </div>
              </div>
            )}

            {loadingQuiz && (
              <div className="flex flex-row-reverse gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-2xl rounded-tr-none px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#f59e0b] animate-spin" />
                  <ClipboardList className="w-4 h-4 text-[#f59e0b]" />
                  <span className="text-sm text-[#a8a4c4]">Generating quiz…</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mb-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between">
              <span className="text-sm text-red-400">{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input */}
          <div className="px-4 sm:px-6 pb-6 shrink-0">
            {pdfName && (
              <div className="mb-3 flex items-center gap-3 bg-[#1a1830] border border-white/10 rounded-xl px-4 py-2.5 w-fit max-w-xs">
                <div className="w-6 h-8 bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center shrink-0">
                  <span className="text-red-400 text-xs font-bold">PDF</span>
                </div>
                <span className="text-sm text-white truncate">{pdfName}</span>
                <button
                  onClick={() => { setPdfFile(null); setPdfName(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="text-[#a8a4c4] hover:text-white transition-colors ml-1 cursor-pointer"
                  aria-label="Remove PDF"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-3 bg-[#1a1830] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#7c3aed]/50 transition-colors"
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#a8a4c4] hover:text-[#c4b5fd] transition-colors p-1 shrink-0 self-end mb-0.5 cursor-pointer"
                aria-label="Attach PDF"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your PDF, request flashcards, or quiz me…"
                rows={1}
                className="flex-1 bg-transparent text-[#fffffe] placeholder:text-[#a8a4c4] text-sm resize-none outline-none leading-relaxed max-h-32 overflow-y-auto self-center"
                style={{ height: "auto", minHeight: "24px" }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = el.scrollHeight + "px";
                }}
              />

              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !pdfFile)}
                className="w-8 h-8 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors shrink-0 self-end cursor-pointer"
                aria-label="Send"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>

            <p className="text-xs text-[#a8a4c4] text-center mt-2">
              Press Enter to send &bull; Shift+Enter for new line
            </p>
          </div>
        </main>
      </div>

      {/* Study material sheet */}
      <StudyMaterialSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        flashcards={sheetState.flashcards}
        questions={sheetState.questions}
        defaultTab={sheetState.defaultTab}
      />
    </div>
  );
}
