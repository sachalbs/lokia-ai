"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { MessageSquarePlus } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { filename: string; page?: number }[];
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}

// Demo conversations
const demoConversations: Conversation[] = [
  {
    id: "1",
    title: "Questions sur le contrat client",
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    title: "Analyse des documents RH",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "3",
    title: "Recherche procedure comptable",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

// Demo messages
const demoMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Quels sont les principaux points du contrat avec le client ABC ?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Voici les points principaux du contrat avec le client ABC :\n\n1. Duree du contrat : 24 mois renouvelables\n2. Montant mensuel : 15 000 EUR HT\n3. Conditions de resiliation : preavis de 3 mois\n4. Penalites de retard : 1,5% par mois de retard\n5. Clause de confidentialite : engagement mutuel sur 5 ans\n\nLe contrat prevoit egalement une clause de revision annuelle des tarifs indexee sur l'inflation.",
    sources: [
      { filename: "Contrat_ABC_2024.pdf", page: 3 },
      { filename: "Annexe_conditions_generales.pdf", page: 1 },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
];

export default function ChatPage() {
  const [isLocalMode, setIsLocalMode] = useState(true);
  const [conversations, setConversations] =
    useState<Conversation[]>(demoConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>("1");
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Apply theme class based on LLM mode (local = dark, API = light)
  useEffect(() => {
    if (isLocalMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isLocalMode]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggleLLMMode = () => {
    setIsLocalMode(!isLocalMode);
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "Nouvelle conversation",
      updatedAt: new Date(),
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
    setMessages([]);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    // In a real app, fetch messages for this conversation
    if (id === "1") {
      setMessages(demoMessages);
    } else {
      setMessages([]);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(conversations[0]?.id || "");
      setMessages([]);
    }
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Je suis Lokia, votre assistant IA. Cette reponse est une demonstration. Dans la version complete, je rechercherais dans vos documents pour vous fournir une reponse precise et sourcee.",
        sources: [{ filename: "Document_exemple.pdf", page: 1 }],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isLocalMode={isLocalMode}
        onToggleLLMMode={handleToggleLLMMode}
      />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                isLocalMode ? "bg-emerald-500" : "bg-sky-500"
              }`}
            />
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              {isLocalMode ? "Mode local - 100% prive" : "Mode cloud - Plus rapide"}
            </span>
          </div>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {messages.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="max-w-md text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow">
                  <MessageSquarePlus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                    Comment puis-je vous aider ?
                  </h2>
                  <p className="text-[var(--color-text-secondary)]">
                    Posez une question sur vos documents ou demandez une analyse.
                    Lokia recherchera dans votre base documentaire pour vous
                    fournir une reponse precise.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  {[
                    "Resumez le dernier rapport financier",
                    "Quels sont les termes du contrat X ?",
                    "Trouvez les procedures RH",
                    "Analysez les KPIs du trimestre",
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(suggestion)}
                      className="p-3 text-left text-sm text-[var(--color-text-secondary)] bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/5 transition-all duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Messages list */
            <div className="max-w-3xl mx-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  sources={message.sources}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <ChatMessage
                  role="assistant"
                  content="Recherche en cours dans vos documents..."
                  isStreaming
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <ChatInput
          onSend={handleSendMessage}
          onAttach={() => console.log("Attach document")}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
