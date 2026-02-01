'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export default function Home() {
  const { mode } = useTheme();

  return (
    <MainLayout>
      <div
        className={cn(
          'flex-1 flex flex-col overflow-hidden',
          mode === 'local' ? 'bg-local-bg' : 'bg-api-bg'
        )}
      >
        <ChatArea className="flex-1" />
        <ChatInput />
      </div>
    </MainLayout>
  );
}
