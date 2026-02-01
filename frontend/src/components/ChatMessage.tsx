"use client";

import { User, Bot, Copy, Check, FileText } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface Source {
  filename: string;
  page?: number;
}

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
  timestamp?: Date;
}

export default function ChatMessage({
  role,
  content,
  sources,
  isStreaming = false,
  timestamp,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={clsx(
        "group flex gap-4 px-4 py-6 animate-in",
        isUser ? "bg-transparent" : "bg-[var(--color-card)]/50"
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
          isUser
            ? "bg-gradient-to-br from-accent-400 to-accent-600"
            : "bg-gradient-to-br from-emerald-400 to-teal-600"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-[var(--color-text-primary)]">
            {isUser ? "Vous" : "Lokia"}
          </span>
          {timestamp && (
            <span className="text-xs text-[var(--color-text-muted)]">
              {timestamp.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        {/* Message content */}
        <div
          className={clsx(
            "message-content text-[var(--color-text-primary)]",
            isStreaming && "animate-pulse-slow"
          )}
        >
          {content.split("\n").map((paragraph, idx) => (
            <p key={idx} className="mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-[var(--color-accent)] animate-typing ml-0.5" />
          )}
        </div>

        {/* Sources */}
        {sources && sources.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">
              Sources
            </p>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-border)]/50 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] transition-colors cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>{source.filename}</span>
                  {source.page && (
                    <span className="text-[var(--color-text-muted)]">
                      p.{source.page}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {!isUser && !isStreaming && (
          <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span>Copie</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
