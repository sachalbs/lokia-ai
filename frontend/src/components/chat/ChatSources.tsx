'use client';

import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Source } from '@/types';

interface ChatSourcesProps {
  sources: Source[];
  className?: string;
}

export function ChatSources({ sources, className }: ChatSourcesProps) {
  const { mode } = useTheme();

  if (!sources || sources.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={cn('flex flex-wrap gap-2 mt-3', className)}
    >
      <span
        className={cn(
          'text-xs font-medium',
          mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
        )}
      >
        Sources :
      </span>
      {sources.map((source, index) => (
        <motion.button
          key={`${source.documentId}-${source.pageNumber}-${index}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * (index + 1) }}
          className={cn(
            'source-badge group',
            mode === 'local' ? 'source-badge-local' : 'source-badge-api'
          )}
        >
          <FileText className="w-3 h-3" />
          <span className="max-w-[150px] truncate">{source.filename}</span>
          {source.pageNumber && (
            <span
              className={cn(
                'opacity-60',
                mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
              )}
            >
              p.{source.pageNumber}
            </span>
          )}
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      ))}
    </motion.div>
  );
}
