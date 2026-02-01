"use client";

import { MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";
import { useConversations } from "@/hooks/useConversations";

export default function ChatPage() {
  const { createConversation } = useConversations();

  const handleNewChat = async () => {
    const conversation = await createConversation();
    window.location.href = `/chat/${conversation.id}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome to Lokia AI
        </h1>
        <p className="text-gray-600 mb-6">
          Start a new conversation to begin chatting with AI
        </p>
        <Button onClick={handleNewChat}>Start New Chat</Button>
      </div>
    </div>
  );
}
