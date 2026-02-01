"use client";

import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Server,
  Cloud,
  Trash2,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import clsx from "clsx";

interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isLocalMode: boolean;
  onToggleLLMMode: () => void;
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isLocalMode,
  onToggleLLMMode,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside className="flex flex-col h-full w-64 bg-[var(--color-sidebar)] border-r border-[var(--color-border)] transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--color-border)]">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-glow">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-white"
              fill="currentColor"
            >
              {/* Ornithorynque simplified icon */}
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--color-sidebar)]" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-[var(--color-text-primary)]">
            Lokia
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">
            {isLocalMode ? "Mode local" : "Mode cloud"}
          </p>
        </div>
      </div>

      {/* New conversation button */}
      <div className="p-3">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 btn-primary py-2.5"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle conversation</span>
        </button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
        <div className="py-2">
          <p className="px-3 py-2 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
            Conversations
          </p>
          <div className="space-y-1">
            {conversations.length === 0 ? (
              <p className="px-3 py-4 text-sm text-[var(--color-text-muted)] text-center">
                Aucune conversation
              </p>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={clsx(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                    activeConversationId === conversation.id
                      ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card)]"
                  )}
                  onClick={() => onSelectConversation(conversation.id)}
                  onMouseEnter={() => setHoveredId(conversation.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 truncate text-sm">
                    {conversation.title}
                  </span>
                  {hoveredId === conversation.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                      className="p-1 rounded hover:bg-red-500/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-[var(--color-border)] p-3 space-y-1">
        {/* Navigation items */}
        <button className="sidebar-item w-full">
          <FileText className="w-4 h-4" />
          <span className="text-sm">Documents</span>
        </button>
        <button className="sidebar-item w-full">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Parametres</span>
        </button>

        {/* LLM Mode toggle */}
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm text-[var(--color-text-secondary)]">
            Mode LLM
          </span>
          <button
            onClick={onToggleLLMMode}
            className={clsx(
              "relative w-14 h-7 rounded-full transition-colors duration-300",
              isLocalMode ? "bg-emerald-600" : "bg-sky-500"
            )}
          >
            <div
              className={clsx(
                "absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center",
                isLocalMode ? "left-1" : "left-8"
              )}
            >
              {isLocalMode ? (
                <Server className="w-3 h-3 text-emerald-600" />
              ) : (
                <Cloud className="w-3 h-3 text-sky-500" />
              )}
            </div>
          </button>
        </div>

        {/* User section */}
        <div className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg bg-[var(--color-card)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              Utilisateur
            </p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">
              user@entreprise.fr
            </p>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-[var(--color-border)] transition-colors">
            <LogOut className="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
