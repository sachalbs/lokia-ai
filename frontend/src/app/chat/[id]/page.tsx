"use client";

import { useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useConversation } from "@/hooks/useConversations";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { Loader2 } from "lucide-react";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = Number(params.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { conversation, isLoading, isSending, error, sendMessage } =
    useConversation(conversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error || "Conversation not found"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="px-6 py-4 border-b bg-white">
        <h1 className="font-semibold text-lg">
          {conversation.title || "New Conversation"}
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {conversation.messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          conversation.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={sendMessage} isDisabled={isSending} />
    </div>
  );
}
