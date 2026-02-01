// Types pour Lokia

export type LLMMode = 'local' | 'api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  tenantId: string;
}

export interface Conversation {
  id: string;
  title: string;
  llmMode: LLMMode;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  createdAt: string;
  isStreaming?: boolean;
}

export interface Source {
  documentId: string;
  filename: string;
  pageNumber?: number;
  excerpt?: string;
}

export interface Document {
  id: string;
  filename: string;
  originalFilename: string;
  fileSize: number;
  fileType: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  isShared: boolean;
  createdAt: string;
  processedAt?: string;
}

export interface ChatInputState {
  message: string;
  files: File[];
  isLoading: boolean;
}

export interface ThemeState {
  mode: LLMMode;
  setMode: (mode: LLMMode) => void;
  toggleMode: () => void;
}

export interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
}
