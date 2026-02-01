'use client';

import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  const { mode } = useTheme();

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Platypus icon */}
      <div className="relative">
        <svg
          viewBox="0 0 48 36"
          className={cn(
            'w-10 h-8 transition-colors duration-200',
            mode === 'local' ? 'text-local-accent' : 'text-api-accent'
          )}
          fill="currentColor"
        >
          {/* Body */}
          <ellipse cx="20" cy="18" rx="12" ry="9" opacity="0.9" />
          {/* Tail */}
          <path d="M4 20 Q8 16, 10 20 Q8 24, 4 20" opacity="0.7" />
          {/* Beak */}
          <ellipse cx="35" cy="18" rx="8" ry="3.5" opacity="0.6" />
          {/* Eye */}
          <circle cx="26" cy="15" r="2.5" fill="white" />
          <circle cx="26.5" cy="14.5" r="1.2" fill="#0a0f1a" />
          {/* Leg */}
          <ellipse cx="16" cy="26" rx="3" ry="2" opacity="0.5" />
          <ellipse cx="24" cy="26" rx="3" ry="2" opacity="0.5" />
        </svg>
        {/* Subtle glow effect */}
        <div
          className={cn(
            'absolute inset-0 blur-xl opacity-30 -z-10',
            mode === 'local' ? 'bg-local-accent' : 'bg-api-accent'
          )}
        />
      </div>

      {/* Text */}
      {showText && (
        <span
          className={cn(
            'text-xl font-bold tracking-tight transition-colors duration-200',
            mode === 'local' ? 'text-local-text' : 'text-api-text'
          )}
        >
          Lokia
        </span>
      )}
    </div>
  );
}
