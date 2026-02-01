"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, MessageSquare, Trash2, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useConversations } from "@/hooks/useConversations";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { conversations, isLoading, createConversation, deleteConversation } = useConversations();

  const handleNewChat = async () => {
    const conversation = await createConversation();
    window.location.href = `/chat/${conversation.id}`;
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-4">
        <Link href="/chat" className="text-xl font-bold">
          Lokia AI
        </Link>
      </div>

      <div className="px-4 mb-4">
        <Button
          onClick={handleNewChat}
          variant="secondary"
          className="w-full justify-start gap-2"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        {isLoading ? (
          <div className="text-gray-400 text-sm px-2">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="text-gray-400 text-sm px-2">No conversations yet</div>
        ) : (
          <ul className="space-y-1">
            {conversations.map((conv) => {
              const isActive = pathname === `/chat/${conv.id}`;
              return (
                <li key={conv.id} className="group">
                  <Link
                    href={`/chat/${conv.id}`}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    )}
                  >
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate flex-1">
                      {conv.title || "New Conversation"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteConversation(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
