"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, Paperclip, Mic, StopCircle } from "lucide-react";
import clsx from "clsx";

interface ChatInputProps {
  onSend: (message: string) => void;
  onAttach?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  onAttach,
  isLoading = false,
  placeholder = "Posez votre question...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <div
          className={clsx(
            "relative flex items-end gap-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-2xl px-4 py-3 transition-all duration-200",
            "focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:border-transparent",
            isLoading && "opacity-75"
          )}
        >
          {/* Attach button */}
          {onAttach && (
            <button
              onClick={onAttach}
              disabled={isLoading}
              className="flex-shrink-0 p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors disabled:opacity-50"
              title="Joindre un document"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] resize-none focus:outline-none disabled:cursor-not-allowed"
            style={{ minHeight: "24px", maxHeight: "200px" }}
          />

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className={clsx(
              "flex-shrink-0 p-2 rounded-xl transition-all duration-200",
              message.trim() && !isLoading
                ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-md hover:shadow-lg"
                : "bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <StopCircle className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Helper text */}
        <p className="mt-2 text-xs text-center text-[var(--color-text-muted)]">
          Lokia peut faire des erreurs. Verifiez les informations importantes.
        </p>
      </div>
    </div>
  );
}
