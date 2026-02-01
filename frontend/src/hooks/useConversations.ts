'use client';

import { create } from 'zustand';
import type { Conversation, ConversationState } from '@/types';

// Données mock pour la démo
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Analyse du contrat fournisseur',
    llmMode: 'local',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    messageCount: 8,
  },
  {
    id: '2',
    title: 'Questions sur la politique RH',
    llmMode: 'api',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messageCount: 12,
  },
  {
    id: '3',
    title: 'Procédure de facturation',
    llmMode: 'local',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    messageCount: 5,
  },
  {
    id: '4',
    title: 'Normes ISO et conformité',
    llmMode: 'api',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
    messageCount: 15,
  },
];

export const useConversations = create<ConversationState>((set) => ({
  conversations: mockConversations,
  currentConversation: null,
  isLoading: false,

  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),

  addConversation: (conversation) => set((state) => ({
    conversations: [conversation, ...state.conversations],
  })),

  updateConversation: (id, updates) => set((state) => ({
    conversations: state.conversations.map((conv) =>
      conv.id === id ? { ...conv, ...updates } : conv
    ),
  })),

  deleteConversation: (id) => set((state) => ({
    conversations: state.conversations.filter((conv) => conv.id !== id),
    currentConversation: state.currentConversation?.id === id ? null : state.currentConversation,
  })),
}));
