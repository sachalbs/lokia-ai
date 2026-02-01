"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isDisabled?: boolean;
}

export default function ChatInput({ onSend, isDisabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4 border-t bg-white">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
        className={cn(
          "flex-1 resize-none px-4 py-3 border border-gray-300 rounded-xl",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "min-h-[48px] max-h-[200px]"
        )}
        disabled={isDisabled}
      />
      <Button
        type="submit"
        disabled={!message.trim() || isDisabled}
        className="self-end"
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
}
