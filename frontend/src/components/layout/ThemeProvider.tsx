'use client';

import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { mode } = useTheme();

  useEffect(() => {
    const root = document.documentElement;

    // Remove previous theme classes
    root.classList.remove('theme-local', 'theme-api');

    // Add current theme class
    root.classList.add(`theme-${mode}`);

    // Update background color based on theme
    if (mode === 'local') {
      document.body.style.backgroundColor = '#0a0f1a';
      document.body.style.color = '#e2e8f0';
    } else {
      document.body.style.backgroundColor = '#f0f9ff';
      document.body.style.color = '#0f172a';
    }
  }, [mode]);

  return (
    <div className={`theme-${mode}`}>
      {children}
    </div>
  );
}
