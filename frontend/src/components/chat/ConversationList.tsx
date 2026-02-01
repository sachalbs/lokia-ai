'use client';

import { useTheme } from '@/hooks/useTheme';
import { useConversations } from '@/hooks/useConversations';
import { cn, formatDate, truncateText } from '@/lib/utils';
import { MessageSquare, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Conversation } from '@/types';

interface ConversationListProps {
  className?: string;
  compact?: boolean;
}

export function ConversationList({ className, compact = false }: ConversationListProps) {
  const { mode } = useTheme();
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    deleteConversation,
  } = useConversations();

  const handleSelect = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteConversation(id);
  };

  return (
    <div className={cn('space-y-1', className)}>
      <AnimatePresence>
        {conversations.map((conversation, index) => (
          <motion.button
            key={conversation.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => handleSelect(conversation)}
            className={cn(
              'w-full group flex items-center gap-3 rounded-xl transition-all duration-200',
              compact ? 'p-2' : 'px-3 py-2.5',
              currentConversation?.id === conversation.id
                ? mode === 'local'
                  ? 'bg-local-card text-local-text border-l-2 border-local-accent'
                  : 'bg-white text-api-text border-l-2 border-api-accent shadow-soft'
                : mode === 'local'
                ? 'text-local-text-muted hover:text-local-text hover:bg-local-card'
                : 'text-api-text-muted hover:text-api-text hover:bg-white'
            )}
          >
            <MessageSquare
              className={cn(
                'w-4 h-4 flex-shrink-0',
                currentConversation?.id === conversation.id
                  ? mode === 'local'
                    ? 'text-local-accent'
                    : 'text-api-accent'
                  : ''
              )}
            />

            {!compact && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate">
                    {truncateText(conversation.title, 24)}
                  </p>
                  <p
                    className={cn(
                      'text-xs',
                      mode === 'local'
                        ? 'text-local-text-muted'
                        : 'text-api-text-muted'
                    )}
                  >
                    {formatDate(conversation.updatedAt)}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDelete(e, conversation.id)}
                  className={cn(
                    'p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200',
                    mode === 'local'
                      ? 'hover:bg-red-500/10 text-local-text-muted hover:text-red-400'
                      : 'hover:bg-red-500/10 text-api-text-muted hover:text-red-500'
                  )}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </motion.button>
        ))}
      </AnimatePresence>

      {conversations.length === 0 && (
        <div
          className={cn(
            'text-center py-8',
            mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
          )}
        >
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucune conversation</p>
        </div>
      )}
    </div>
  );
}
