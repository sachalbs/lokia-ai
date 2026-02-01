'use client';

import { forwardRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const { mode } = useTheme();

    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    );

    const variants = {
      primary: cn(
        mode === 'local'
          ? 'bg-local-accent hover:bg-local-accent-hover text-white focus:ring-local-accent/50'
          : 'bg-api-accent hover:bg-api-accent-hover text-white focus:ring-api-accent/50',
        mode === 'local' ? 'focus:ring-offset-local-bg' : 'focus:ring-offset-api-bg'
      ),
      secondary: cn(
        mode === 'local'
          ? 'bg-local-card border border-local-border text-local-text hover:bg-local-bg'
          : 'bg-white border border-api-border text-api-text hover:bg-api-sidebar shadow-soft',
        mode === 'local' ? 'focus:ring-local-accent/50' : 'focus:ring-api-accent/50'
      ),
      ghost: cn(
        mode === 'local'
          ? 'text-local-text-muted hover:text-local-text hover:bg-local-card'
          : 'text-api-text-muted hover:text-api-text hover:bg-api-sidebar',
        'focus:ring-transparent'
      ),
      danger: cn(
        'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50',
        mode === 'local' ? 'focus:ring-offset-local-bg' : 'focus:ring-offset-api-bg'
      ),
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
