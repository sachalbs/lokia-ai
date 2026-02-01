"use client";

import { useState, useEffect, useCallback } from "react";
import { conversationsApi } from "@/lib/api";
import type { Conversation, ConversationWithMessages, Message } from "@/types";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await conversationsApi.list();
      setConversations(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch conversations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const createConversation = async (title?: string): Promise<Conversation> => {
    const conversation = await conversationsApi.create(title);
    setConversations((prev) => [conversation, ...prev]);
    return conversation;
  };

  const deleteConversation = async (id: number) => {
    await conversationsApi.delete(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    conversations,
    isLoading,
    error,
    createConversation,
    deleteConversation,
    refetch: fetchConversations,
  };
}

export function useConversation(id: number) {
  const [conversation, setConversation] = useState<ConversationWithMessages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        const data = await conversationsApi.get(id);
        setConversation(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch conversation");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [id]);

  const sendMessage = async (content: string): Promise<Message | null> => {
    if (!conversation) return null;

    try {
      setIsSending(true);

      // Optimistically add user message
      const tempUserMessage: Message = {
        id: Date.now(),
        conversation_id: id,
        role: "user",
        content,
        model: null,
        created_at: new Date().toISOString(),
      };

      setConversation((prev) =>
        prev ? { ...prev, messages: [...prev.messages, tempUserMessage] } : null
      );

      // Send message and get AI response
      const aiMessage = await conversationsApi.sendMessage(id, content);

      // Update with actual messages
      setConversation((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages.slice(0, -1), { ...tempUserMessage, id: aiMessage.id - 1 }, aiMessage],
            }
          : null
      );

      return aiMessage;
    } catch (err) {
      setError("Failed to send message");
      return null;
    } finally {
      setIsSending(false);
    }
  };

  return {
    conversation,
    isLoading,
    isSending,
    error,
    sendMessage,
  };
}
