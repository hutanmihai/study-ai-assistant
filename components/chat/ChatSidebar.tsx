"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// MessageSquare is used in the empty state below
import { ChatSummary } from "@/lib/types";

interface Props {
  chats: ChatSummary[];
  currentChatId: string | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, name: string) => void;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function groupChatsByDate(chats: ChatSummary[]) {
  const now = new Date();
  const today = startOfDay(now).getTime();
  const yesterday = today - 86400000;
  const last7 = today - 7 * 86400000;
  const last30 = today - 30 * 86400000;

  const groups: { label: string; chats: ChatSummary[] }[] = [
    { label: "Today", chats: [] },
    { label: "Yesterday", chats: [] },
    { label: "Last 7 Days", chats: [] },
    { label: "Last 30 Days", chats: [] },
    { label: "Older", chats: [] },
  ];

  for (const chat of chats) {
    const t = new Date(chat.updatedAt).getTime();
    if (t >= today) groups[0].chats.push(chat);
    else if (t >= yesterday) groups[1].chats.push(chat);
    else if (t >= last7) groups[2].chats.push(chat);
    else if (t >= last30) groups[3].chats.push(chat);
    else groups[4].chats.push(chat);
  }

  return groups.filter((g) => g.chats.length > 0);
}

export default function ChatSidebar({
  chats,
  currentChatId,
  collapsed,
  onToggleCollapse,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const startEditing = (chat: ChatSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(chat._id);
    setEditingName(chat.name);
  };

  const commitRename = (id: string) => {
    const original = chats.find((c) => c._id === id)?.name;
    if (editingName.trim() && editingName.trim() !== original) {
      onRenameChat(id, editingName.trim());
    }
    setEditingId(null);
  };

  const groups = groupChatsByDate(chats);

  // ── Collapsed state: thin strip ────────────────────────────────────────────
  if (collapsed) {
    return (
      <aside className="hidden lg:flex flex-col items-center w-14 border-r border-white/10 bg-[#1a1830]/50 shrink-0 py-3 gap-2">
        <button
          onClick={onToggleCollapse}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[#a8a4c4] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={onNewChat}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[#a8a4c4] hover:text-[#c4b5fd] hover:bg-[#7c3aed]/20 transition-colors"
          aria-label="New chat"
        >
          <Plus className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  // ── Expanded state ─────────────────────────────────────────────────────────
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-[#1a1830]/50 shrink-0 overflow-hidden transition-all duration-200">
      {/* Header row */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10">
        <Button
          onClick={onNewChat}
          className="flex-1 bg-[#7c3aed]/20 hover:bg-[#7c3aed]/30 text-[#c4b5fd] border border-[#7c3aed]/30 hover:border-[#7c3aed]/50 rounded-xl gap-2 h-9"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
        <button
          onClick={onToggleCollapse}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[#a8a4c4] hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto p-2">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <MessageSquare className="w-8 h-8 text-[#a8a4c4]/30 mb-2" />
            <p className="text-xs text-[#a8a4c4]">
              No chats yet. Start a conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="text-xs text-[#a8a4c4]/60 font-semibold uppercase tracking-wider px-2 mb-1">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.chats.map((chat) => (
                    <div
                      key={chat._id}
                      onMouseEnter={() => setHoveredId(chat._id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() =>
                        editingId !== chat._id && onSelectChat(chat._id)
                      }
                      className={`group relative flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer transition-all duration-150 ${
                        currentChatId === chat._id
                          ? "bg-[#7c3aed]/20 border border-[#7c3aed]/30"
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {editingId === chat._id ? (
                        <div
                          className="flex-1 flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            ref={editInputRef}
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitRename(chat._id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            onBlur={() => commitRename(chat._id)}
                            className="flex-1 bg-[#0f0e17] border border-[#7c3aed]/50 rounded-md px-2 py-0.5 text-xs text-white outline-none min-w-0"
                          />
                          <button
                            onClick={() => commitRename(chat._id)}
                            className="text-[#7c3aed] hover:text-[#a78bfa] shrink-0"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-[#a8a4c4] hover:text-white shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-xs text-[#fffffe] truncate leading-relaxed">
                            {chat.name}
                          </span>
                          {(hoveredId === chat._id ||
                            currentChatId === chat._id) && (
                            <div
                              className="flex items-center gap-0.5 shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => startEditing(chat, e)}
                                className="p-1 rounded text-[#a8a4c4] hover:text-white hover:bg-white/10 transition-colors"
                                aria-label="Rename"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onDeleteChat(chat._id)}
                                className="p-1 rounded text-[#a8a4c4] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                aria-label="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-xl p-3">
          <p className="text-xs text-[#c4b5fd] font-medium mb-0.5">
            Powered by Gemini
          </p>
          <p className="text-xs text-[#a8a4c4]">
            Answers grounded in your course materials.
          </p>
        </div>
      </div>
    </aside>
  );
}
