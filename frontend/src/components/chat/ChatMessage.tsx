'use client';

import { useTheme } from '@/hooks/useTheme';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import { User, Bot, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatSources } from './ChatSources';
import type { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const { mode } = useTheme();
  const { isStreaming, streamingMessageId } = useChat();
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const isCurrentlyStreaming = isStreaming && streamingMessageId === message.id;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'flex gap-4 py-6',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Avatar for assistant */}
      {!isUser && (
        <div
          className={cn(
            'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center',
            mode === 'local'
              ? 'bg-local-accent/10 text-local-accent'
              : 'bg-api-accent/10 text-api-accent'
          )}
        >
          <Bot className="w-5 h-5" />
        </div>
      )}

      {/* Message content */}
      <div
        className={cn(
          'flex flex-col max-w-[75%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'message-bubble group relative',
            isUser
              ? mode === 'local'
                ? 'bg-local-accent text-white rounded-2xl rounded-tr-md'
                : 'bg-api-accent text-white rounded-2xl rounded-tr-md'
              : mode === 'local'
              ? 'bg-local-card text-local-text border border-local-border rounded-2xl rounded-tl-md shadow-soft'
              : 'bg-white text-api-text border border-api-border rounded-2xl rounded-tl-md shadow-soft'
          )}
        >
          {/* Message text with markdown support for assistant */}
          {isUser ? (
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div
              className={cn(
                'prose prose-sm max-w-none',
                mode === 'local' ? 'prose-invert' : '',
                '[&>p]:mb-3 [&>p:last-child]:mb-0',
                '[&>ul]:mb-3 [&>ol]:mb-3',
                '[&>h1]:text-lg [&>h2]:text-base [&>h3]:text-sm',
                '[&>h1]:font-semibold [&>h2]:font-semibold [&>h3]:font-medium',
                '[&>h1]:mb-2 [&>h2]:mb-2 [&>h3]:mb-2',
                '[&>pre]:rounded-lg [&>pre]:p-3',
                mode === 'local'
                  ? '[&>pre]:bg-local-bg [&>code]:text-local-accent'
                  : '[&>pre]:bg-api-bg [&>code]:text-api-accent',
                isCurrentlyStreaming && 'streaming-cursor'
              )}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}

          {/* Copy button - only for assistant messages */}
          {!isUser && !isCurrentlyStreaming && (
            <button
              onClick={handleCopy}
              className={cn(
                'absolute -bottom-8 left-0 flex items-center gap-1.5 px-2 py-1 rounded-lg',
                'text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200',
                mode === 'local'
                  ? 'text-local-text-muted hover:text-local-text hover:bg-local-card'
                  : 'text-api-text-muted hover:text-api-text hover:bg-api-sidebar'
              )}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copie
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copier
                </>
              )}
            </button>
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <ChatSources sources={message.sources} />
        )}
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div
          className={cn(
            'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center',
            mode === 'local'
              ? 'bg-local-card border border-local-border text-local-text'
              : 'bg-api-sidebar border border-api-border text-api-text'
          )}
        >
          <User className="w-5 h-5" />
        </div>
      )}
    </motion.div>
  );
}
