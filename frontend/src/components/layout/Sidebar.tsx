'use client';

import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useConversations } from '@/hooks/useConversations';
import { cn, formatDate, truncateText } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { LLMModeSwitcher } from './LLMModeSwitcher';
import {
  Plus,
  MessageSquare,
  Search,
  MoreHorizontal,
  Trash2,
  Edit3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Conversation } from '@/types';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { mode } = useTheme();
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    deleteConversation,
  } = useConversations();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    setCurrentConversation(null);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  return (
    <motion.aside
      className={cn(
        'h-screen flex flex-col transition-all duration-300',
        mode === 'local'
          ? 'bg-local-sidebar/95 backdrop-blur-xl border-r border-local-border/50'
          : 'bg-api-sidebar/95 backdrop-blur-xl border-r border-api-border/50',
        isCollapsed ? 'w-20' : 'w-72',
        className
      )}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 288 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <Logo showText={!isCollapsed} />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'p-2 rounded-lg transition-all duration-200',
            mode === 'local'
              ? 'hover:bg-local-card text-local-text-muted hover:text-local-text'
              : 'hover:bg-white text-api-text-muted hover:text-api-text'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* New Chat Button */}
      <div className={cn('px-3 py-2', isCollapsed && 'px-2')}>
        <button
          onClick={handleNewChat}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl transition-all duration-200',
            isCollapsed ? 'p-3 justify-center' : 'px-4 py-3',
            mode === 'local'
              ? 'bg-local-accent hover:bg-local-accent-hover text-white shadow-glow/20'
              : 'bg-api-accent hover:bg-api-accent-hover text-white shadow-glow-light/20'
          )}
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Nouvelle conversation</span>}
        </button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-3 py-2">
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200',
              mode === 'local'
                ? 'bg-local-card border border-local-border'
                : 'bg-white border border-api-border'
            )}
          >
            <Search
              className={cn(
                'w-4 h-4',
                mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
              )}
            />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'flex-1 bg-transparent text-sm outline-none placeholder:opacity-60',
                mode === 'local'
                  ? 'text-local-text placeholder:text-local-text-muted'
                  : 'text-api-text placeholder:text-api-text-muted'
              )}
            />
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {!isCollapsed && (
          <p
            className={cn(
              'text-xs font-medium uppercase tracking-wider px-2 mb-2',
              mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
            )}
          >
            Conversations
          </p>
        )}

        <div className="space-y-1">
          <AnimatePresence>
            {filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: index * 0.03 }}
                onMouseEnter={() => setHoveredId(conversation.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <button
                  onClick={() => handleSelectConversation(conversation)}
                  className={cn(
                    'w-full group relative',
                    mode === 'local'
                      ? 'conversation-item-local'
                      : 'conversation-item-api',
                    'conversation-item',
                    currentConversation?.id === conversation.id && 'active'
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

                  {!isCollapsed && (
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

                      {/* Actions on hover */}
                      <AnimatePresence>
                        {hoveredId === conversation.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-1"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conversation.id);
                              }}
                              className={cn(
                                'p-1.5 rounded-lg transition-colors duration-200',
                                mode === 'local'
                                  ? 'hover:bg-red-500/10 text-local-text-muted hover:text-red-400'
                                  : 'hover:bg-red-500/10 text-api-text-muted hover:text-red-500'
                              )}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        className={cn(
          'border-t p-3 space-y-3',
          mode === 'local' ? 'border-local-border/50' : 'border-api-border/50'
        )}
      >
        {/* LLM Mode Switcher */}
        <LLMModeSwitcher compact={isCollapsed} />

        {/* Bottom links */}
        {!isCollapsed && (
          <div className="space-y-1">
            <button
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200',
                mode === 'local'
                  ? 'hover:bg-local-card text-local-text-muted hover:text-local-text'
                  : 'hover:bg-white text-api-text-muted hover:text-api-text'
              )}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Documents</span>
            </button>
            <button
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200',
                mode === 'local'
                  ? 'hover:bg-local-card text-local-text-muted hover:text-local-text'
                  : 'hover:bg-white text-api-text-muted hover:text-api-text'
              )}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Parametres</span>
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
