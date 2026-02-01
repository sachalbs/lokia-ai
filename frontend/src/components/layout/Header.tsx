'use client';

import { useTheme } from '@/hooks/useTheme';
import { useConversations } from '@/hooks/useConversations';
import { cn } from '@/lib/utils';
import { Server, Cloud, Shield, Zap, Menu, MoreHorizontal, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  className?: string;
  onMenuClick?: () => void;
}

export function Header({ className, onMenuClick }: HeaderProps) {
  const { mode } = useTheme();
  const { currentConversation } = useConversations();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center justify-between px-6 py-4',
        mode === 'local'
          ? 'bg-local-bg/80 backdrop-blur-xl border-b border-local-border/50'
          : 'bg-api-bg/80 backdrop-blur-xl border-b border-api-border/50',
        className
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className={cn(
            'lg:hidden p-2 rounded-lg transition-all duration-200',
            mode === 'local'
              ? 'hover:bg-local-card text-local-text-muted hover:text-local-text'
              : 'hover:bg-white text-api-text-muted hover:text-api-text'
          )}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Conversation title */}
        <div className="flex items-center gap-3">
          {currentConversation ? (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <h1
                className={cn(
                  'text-lg font-semibold',
                  mode === 'local' ? 'text-local-text' : 'text-api-text'
                )}
              >
                {currentConversation.title}
              </h1>
              <button
                className={cn(
                  'p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100',
                  mode === 'local'
                    ? 'hover:bg-local-card text-local-text-muted'
                    : 'hover:bg-white text-api-text-muted'
                )}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ) : (
            <h1
              className={cn(
                'text-lg font-semibold',
                mode === 'local' ? 'text-local-text' : 'text-api-text'
              )}
            >
              Nouvelle conversation
            </h1>
          )}
        </div>
      </div>

      {/* Right side - Mode indicator */}
      <div className="flex items-center gap-3">
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full',
            mode === 'local'
              ? 'bg-local-accent/10 border border-local-accent/20'
              : 'bg-api-accent/10 border border-api-accent/20'
          )}
        >
          {mode === 'local' ? (
            <>
              <div className="relative">
                <Server
                  className={cn(
                    'w-4 h-4',
                    mode === 'local' ? 'text-local-accent' : 'text-api-accent'
                  )}
                />
                {/* Pulse indicator */}
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full">
                  <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                </span>
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  mode === 'local' ? 'text-local-accent' : 'text-api-accent'
                )}
              >
                100% Local
              </span>
              <Shield className="w-4 h-4 text-green-500" />
            </>
          ) : (
            <>
              <div className="relative">
                <Cloud
                  className={cn(
                    'w-4 h-4',
                    mode === 'api' ? 'text-api-accent' : 'text-local-accent'
                  )}
                />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-api-accent rounded-full">
                  <span className="absolute inset-0 bg-api-accent rounded-full animate-ping opacity-75" />
                </span>
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  mode === 'api' ? 'text-api-accent' : 'text-local-accent'
                )}
              >
                Cloud securise
              </span>
              <Zap className="w-4 h-4 text-amber-500" />
            </>
          )}
        </motion.div>

        {/* More options */}
        <button
          className={cn(
            'p-2 rounded-lg transition-all duration-200',
            mode === 'local'
              ? 'hover:bg-local-card text-local-text-muted hover:text-local-text'
              : 'hover:bg-white text-api-text-muted hover:text-api-text'
          )}
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
