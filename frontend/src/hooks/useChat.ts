'use client';

import { create } from 'zustand';
import type { Message } from '@/types';
import { generateId } from '@/lib/utils';

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  streamingMessageId: string | null;
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => string;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  appendToMessage: (id: string, content: string) => void;
  setStreaming: (isStreaming: boolean, messageId?: string | null) => void;
  clearMessages: () => void;
}

// Messages de démo
const mockMessages: Message[] = [
  {
    id: '1',
    conversationId: '1',
    role: 'user',
    content: 'Peux-tu me résumer les points clés du contrat fournisseur ABC ?',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    conversationId: '1',
    role: 'assistant',
    content: `D'après l'analyse du contrat fournisseur ABC, voici les points clés :

**Durée et renouvellement**
Le contrat est établi pour une durée de 3 ans, renouvelable tacitement par périodes de 12 mois, sauf dénonciation par l'une des parties avec un préavis de 3 mois.

**Conditions tarifaires**
Les tarifs sont fixés selon la grille annexée au contrat, avec une clause de révision annuelle indexée sur l'indice des prix à la consommation. Une remise de 5% est applicable pour les commandes supérieures à 50 000 euros.

**Garanties et responsabilités**
Le fournisseur s'engage à une garantie de conformité de 24 mois sur l'ensemble des produits livrés. La responsabilité est plafonnée au montant des commandes de l'année en cours.

**Délais de livraison**
Les délais standards sont de 15 jours ouvrés, avec possibilité de livraison express sous 5 jours moyennant un supplément de 15%.`,
    sources: [
      { documentId: 'doc1', filename: 'Contrat_ABC_2024.pdf', pageNumber: 3 },
      { documentId: 'doc1', filename: 'Contrat_ABC_2024.pdf', pageNumber: 7 },
    ],
    createdAt: new Date(Date.now() - 3550000).toISOString(),
  },
];

export const useChat = create<ChatState>((set) => ({
  messages: mockMessages,
  isStreaming: false,
  streamingMessageId: null,

  addMessage: (message) => {
    const id = generateId();
    const newMessage: Message = {
      ...message,
      id,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    return id;
  },

  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === id ? { ...msg, ...updates } : msg
    ),
  })),

  appendToMessage: (id, content) => set((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === id ? { ...msg, content: msg.content + content } : msg
    ),
  })),

  setStreaming: (isStreaming, messageId = null) => set({
    isStreaming,
    streamingMessageId: messageId,
  }),

  clearMessages: () => set({ messages: [] }),
}));
