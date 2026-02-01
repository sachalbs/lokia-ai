'use client';

import { useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useChat } from '@/hooks/useChat';
import { useConversations } from '@/hooks/useConversations';
import { cn } from '@/lib/utils';
import { ChatMessage } from './ChatMessage';
import { MessageSquare, Sparkles, Server, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatAreaProps {
  className?: string;
}

export function ChatArea({ className }: ChatAreaProps) {
  const { mode } = useTheme();
  const { messages, isStreaming } = useChat();
  const { currentConversation } = useConversations();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  // Empty state
  if (messages.length === 0) {
    return (
      <div
        className={cn(
          'flex-1 flex flex-col items-center justify-center px-6',
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          {/* Icon */}
          <div
            className={cn(
              'mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6',
              mode === 'local'
                ? 'bg-local-accent/10 text-local-accent'
                : 'bg-api-accent/10 text-api-accent'
            )}
          >
            <Sparkles className="w-8 h-8" />
          </div>

          {/* Title */}
          <h2
            className={cn(
              'text-2xl font-semibold mb-3',
              mode === 'local' ? 'text-local-text' : 'text-api-text'
            )}
          >
            Comment puis-je vous aider ?
          </h2>

          {/* Description */}
          <p
            className={cn(
              'text-base mb-8',
              mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
            )}
          >
            Posez vos questions sur vos documents. Je peux analyser, resumer et
            repondre a partir de vos fichiers.
          </p>

          {/* Mode indicator */}
          <div
            className={cn(
              'inline-flex items-center gap-3 px-4 py-2 rounded-full',
              mode === 'local'
                ? 'bg-local-card border border-local-border'
                : 'bg-white border border-api-border shadow-soft'
            )}
          >
            {mode === 'local' ? (
              <>
                <Server className="w-4 h-4 text-green-500" />
                <span
                  className={cn(
                    'text-sm',
                    mode === 'local' ? 'text-local-text' : 'text-api-text'
                  )}
                >
                  Mode local actif - Donnees 100% confidentielles
                </span>
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4 text-api-accent" />
                <span
                  className={cn(
                    'text-sm',
                    mode === 'local' ? 'text-local-text' : 'text-api-text'
                  )}
                >
                  Mode cloud - Reponses plus rapides
                </span>
              </>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="mt-8 space-y-2">
            <p
              className={cn(
                'text-sm font-medium mb-3',
                mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
              )}
            >
              Suggestions
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'Resume ce document',
                'Quelles sont les conditions du contrat ?',
                'Trouve les informations sur...',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm transition-all duration-200',
                    mode === 'local'
                      ? 'bg-local-card border border-local-border text-local-text-muted hover:text-local-text hover:border-local-accent'
                      : 'bg-white border border-api-border text-api-text-muted hover:text-api-text hover:border-api-accent shadow-soft'
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex-1 overflow-y-auto px-6',
        className
      )}
    >
      <div className="max-w-4xl mx-auto py-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <ChatMessage key={message.id} message={message} index={index} />
          ))}
        </AnimatePresence>

        {/* Streaming indicator */}
        <AnimatePresence>
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 py-4"
            >
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl',
                  mode === 'local'
                    ? 'bg-local-card text-local-text-muted'
                    : 'bg-white text-api-text-muted shadow-soft'
                )}
              >
                <div className="flex gap-1">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full animate-pulse',
                      mode === 'local' ? 'bg-local-accent' : 'bg-api-accent'
                    )}
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full animate-pulse',
                      mode === 'local' ? 'bg-local-accent' : 'bg-api-accent'
                    )}
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full animate-pulse',
                      mode === 'local' ? 'bg-local-accent' : 'bg-api-accent'
                    )}
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
                <span className="text-sm">Lokia reflechit...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
