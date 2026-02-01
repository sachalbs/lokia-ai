'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LLMMode, ThemeState } from '@/types';

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'local' as LLMMode,
      setMode: (mode: LLMMode) => set({ mode }),
      toggleMode: () => set((state) => ({
        mode: state.mode === 'local' ? 'api' : 'local'
      })),
    }),
    {
      name: 'lokia-theme',
    }
  )
);
