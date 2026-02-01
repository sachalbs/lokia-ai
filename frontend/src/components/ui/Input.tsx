'use client';

import { forwardRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const { mode } = useTheme();
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-2',
              mode === 'local' ? 'text-local-text' : 'text-api-text'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2',
                mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
              )}
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl border-2 py-2.5 transition-all duration-200',
              'focus:outline-none focus:ring-0',
              leftIcon ? 'pl-10' : 'pl-4',
              rightIcon ? 'pr-10' : 'pr-4',
              error
                ? 'border-red-500 focus:border-red-500'
                : mode === 'local'
                ? 'bg-local-card border-local-border text-local-text placeholder:text-local-text-muted focus:border-local-accent'
                : 'bg-white border-api-border text-api-text placeholder:text-api-text-muted focus:border-api-accent',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
