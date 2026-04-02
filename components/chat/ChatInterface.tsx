"use client";

import { useState, useRef, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, X, Plus, Sparkles, Loader2 } from "lucide-react";
import FlashcardDisplay from "./FlashcardDisplay";
import QuizDisplay from "./QuizDisplay";
import Link from "next/link";

interface Flashcard {
  front: string;
  back: string;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

type MessageContent =
  | string
  | { flashcards: Flashcard[] }
  | { questions: Question[] };

interface Message {
  id: string;
  role: "user" | "assistant";
  content: MessageContent;
  type: "text" | "flashcards" | "quiz";
  pdfName?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are supported.");
        return;
      }
      setPdfFile(file);
      setPdfName(file.name);
      setError(null);
    }
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    setPdfName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setPdfFile(null);
    setPdfName(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !pdfFile) return;
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      type: "text",
      pdfName: pdfName ?? undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("message", input.trim());
      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || "Failed to get response");
      }

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        type: data.type,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
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
    if (msg.role === "user") {
      return (
        <div key={msg.id} className="flex justify-end gap-3 group">
          <div className="max-w-[80%] space-y-2">
            {msg.pdfName && (
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3 ml-auto w-fit">
                <div className="w-7 h-8 bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center shrink-0">
                  <span className="text-red-400 text-xs font-bold">PDF</span>
                </div>
                <span className="text-sm text-[#fffffe] font-medium">
                  {msg.pdfName}
                </span>
              </div>
            )}
            {typeof msg.content === "string" && msg.content && (
              <div className="bg-[#7c3aed] rounded-2xl rounded-tr-none px-4 py-3 text-sm text-white leading-relaxed ml-auto w-fit max-w-full">
                {msg.content}
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-xs text-white shrink-0 mt-1">
            U
          </div>
        </div>
      );
    }

    return (
      <div key={msg.id} className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0 mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="max-w-[85%]">
          {msg.type === "text" && typeof msg.content === "string" && (
            <div className="bg-[#1a1830] border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-[#fffffe] leading-relaxed whitespace-pre-wrap">
              {msg.content}
            </div>
          )}
          {msg.type === "flashcards" &&
            typeof msg.content === "object" &&
            "flashcards" in msg.content && (
              <div className="space-y-2">
                <div className="text-xs text-[#a8a4c4] ml-1">
                  Here are your flashcards:
                </div>
                <FlashcardDisplay
                  flashcards={(msg.content as { flashcards: Flashcard[] }).flashcards}
                />
              </div>
            )}
          {msg.type === "quiz" &&
            typeof msg.content === "object" &&
            "questions" in msg.content && (
              <div className="space-y-2">
                <div className="text-xs text-[#a8a4c4] ml-1">
                  Here&apos;s your quiz:
                </div>
                <QuizDisplay
                  questions={(msg.content as { questions: Question[] }).questions}
                />
              </div>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f0e17]">
      {/* Top navbar */}
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
            className="text-[#a8a4c4] hover:text-white hover:bg-white/10 gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
          <UserButton />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-[#1a1830]/50 p-4 shrink-0">
          <Button
            onClick={handleNewChat}
            className="w-full bg-[#7c3aed]/20 hover:bg-[#7c3aed]/30 text-[#c4b5fd] border border-[#7c3aed]/30 hover:border-[#7c3aed]/50 rounded-xl mb-6 gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>

          <div className="space-y-3">
            <p className="text-xs text-[#a8a4c4] font-semibold uppercase tracking-wider">
              How to use
            </p>
            <div className="space-y-2">
              {[
                { icon: "📎", text: "Attach a PDF" },
                { icon: "💬", text: "Ask a question" },
                { icon: "🃏", text: 'Say "flashcards" for cards' },
                { icon: "📝", text: 'Say "quiz me" for MCQs' },
              ].map((tip) => (
                <div
                  key={tip.text}
                  className="flex items-center gap-2 text-xs text-[#a8a4c4]"
                >
                  <span>{tip.icon}</span>
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-xl p-4">
              <p className="text-xs text-[#c4b5fd] font-medium mb-1">
                Powered by Gemini
              </p>
              <p className="text-xs text-[#a8a4c4]">
                AI answers grounded in your uploaded course materials.
              </p>
            </div>
          </div>
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-16 h-16 bg-[#7c3aed]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-[#7c3aed]" />
                </div>
                <h2
                  className="text-2xl font-bold text-white mb-3"
                  style={{
                    fontFamily: "var(--font-display, Fraunces, serif)",
                  }}
                >
                  What would you like to study?
                </h2>
                <p className="text-[#a8a4c4] text-sm max-w-sm mb-8">
                  Upload a PDF and ask me anything. I can explain concepts,
                  create flashcards, or quiz you on the material.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
                  {[
                    {
                      icon: "💬",
                      label: "Ask a question",
                      prompt: "Explain the key concepts from this PDF",
                    },
                    {
                      icon: "🃏",
                      label: "Make flashcards",
                      prompt: "Generate flashcards from this material",
                    },
                    {
                      icon: "📝",
                      label: "Quiz me",
                      prompt: "Quiz me on this PDF",
                    },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setInput(s.prompt)}
                      className="bg-[#1a1830] border border-white/10 rounded-xl p-4 text-left hover:border-[#7c3aed]/30 hover:bg-[#7c3aed]/5 transition-all duration-200 group"
                    >
                      <span className="text-xl mb-2 block">{s.icon}</span>
                      <span className="text-sm text-[#fffffe] font-medium">
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(renderMessage)}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs text-white shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-[#1a1830] border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#7c3aed] animate-spin" />
                  <span className="text-sm text-[#a8a4c4]">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error message */}
          {error && (
            <div className="mx-6 mb-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between">
              <span className="text-sm text-red-400">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input area */}
          <div className="px-6 pb-6 shrink-0">
            {/* PDF preview */}
            {pdfName && (
              <div className="mb-3 flex items-center gap-3 bg-[#1a1830] border border-white/10 rounded-xl px-4 py-2.5 w-fit max-w-xs">
                <div className="w-6 h-8 bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center shrink-0">
                  <span className="text-red-400 text-xs font-bold">PDF</span>
                </div>
                <span className="text-sm text-white truncate">{pdfName}</span>
                <button
                  onClick={handleRemovePdf}
                  className="text-[#a8a4c4] hover:text-white transition-colors ml-1"
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
              {/* PDF button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#a8a4c4] hover:text-[#c4b5fd] transition-colors p-1 shrink-0 self-end mb-0.5"
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
                aria-label="Upload PDF"
              />

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your PDF, request flashcards, or quiz me..."
                rows={1}
                className="flex-1 bg-transparent text-[#fffffe] placeholder:text-[#a8a4c4] text-sm resize-none outline-none leading-relaxed max-h-32 overflow-y-auto self-center"
                style={{
                  height: "auto",
                  minHeight: "24px",
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = el.scrollHeight + "px";
                }}
              />

              {/* Send button */}
              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !pdfFile)}
                className="w-8 h-8 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors shrink-0 self-end"
                aria-label="Send message"
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
    </div>
  );
}
