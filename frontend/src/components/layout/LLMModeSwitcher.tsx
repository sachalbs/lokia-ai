'use client';

import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Server, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

interface LLMModeSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function LLMModeSwitcher({ className, compact = false }: LLMModeSwitcherProps) {
  const { mode, toggleMode } = useTheme();

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {!compact && (
        <span
          className={cn(
            'text-xs font-medium uppercase tracking-wider px-1',
            mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
          )}
        >
          Mode LLM
        </span>
      )}

      <button
        onClick={toggleMode}
        className={cn(
          'relative flex items-center gap-2 p-1 rounded-xl transition-all duration-200',
          mode === 'local'
            ? 'bg-local-card border border-local-border'
            : 'bg-white border border-api-border shadow-soft'
        )}
      >
        {/* Background slider */}
        <motion.div
          className={cn(
            'absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg',
            mode === 'local' ? 'bg-local-accent' : 'bg-api-accent'
          )}
          initial={false}
          animate={{
            x: mode === 'local' ? 4 : 'calc(100% + 4px)',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />

        {/* Local option */}
        <div
          className={cn(
            'relative z-10 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200',
            compact ? 'px-2' : 'px-3',
            mode === 'local' ? 'text-white' : 'text-local-text-muted'
          )}
        >
          <Server className="w-4 h-4" />
          {!compact && <span className="text-sm font-medium">Local</span>}
        </div>

        {/* API option */}
        <div
          className={cn(
            'relative z-10 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200',
            compact ? 'px-2' : 'px-3',
            mode === 'api' ? 'text-white' : 'text-api-text-muted'
          )}
        >
          <Cloud className="w-4 h-4" />
          {!compact && <span className="text-sm font-medium">Cloud</span>}
        </div>
      </button>

      {/* Description */}
      {!compact && (
        <p
          className={cn(
            'text-xs px-1',
            mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
          )}
        >
          {mode === 'local'
            ? 'Mistral Nemo - 100% confidentiel'
            : 'Mistral Large - Plus rapide'}
        </p>
      )}
    </div>
  );
}
