'use client';

import { useState, useRef, useCallback } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useChat } from '@/hooks/useChat';
import { cn, formatFileSize } from '@/lib/utils';
import { Send, Paperclip, X, FileText, Image, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

interface ChatInputProps {
  className?: string;
}

interface AttachedFile {
  file: File;
  id: string;
  preview?: string;
}

export function ChatInput({ className }: ChatInputProps) {
  const { mode } = useTheme();
  const { addMessage, setStreaming, appendToMessage, isStreaming } = useChat();
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxSize: 30 * 1024 * 1024, // 30MB
  });

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleSubmit = async () => {
    if ((!message.trim() && attachedFiles.length === 0) || isStreaming) return;

    const userMessage = message.trim();
    setMessage('');
    setAttachedFiles([]);

    // Add user message
    addMessage({
      conversationId: '1',
      role: 'user',
      content: userMessage,
    });

    // Simulate streaming response
    setStreaming(true);
    const assistantId = addMessage({
      conversationId: '1',
      role: 'assistant',
      content: '',
    });
    setStreaming(true, assistantId);

    // Simulated streaming response
    const response = `Je comprends votre question. Voici ce que j'ai trouve dans vos documents :

**Analyse en cours**

D'apres les informations disponibles, je peux vous indiquer que ce sujet est traite dans plusieurs de vos documents. Les points essentiels sont :

1. **Premier point important** - Les donnees indiquent une tendance claire dans cette direction
2. **Deuxieme element** - La documentation mentionne specifiquement ces aspects
3. **Conclusion** - En synthese, voici ce qu'il faut retenir

N'hesitez pas si vous avez d'autres questions.`;

    // Simulate streaming
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 20));
      appendToMessage(assistantId, (i === 0 ? '' : ' ') + words[i]);
    }

    setStreaming(false, null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'sticky bottom-0 px-6 py-4',
        mode === 'local'
          ? 'bg-gradient-to-t from-local-bg via-local-bg to-transparent'
          : 'bg-gradient-to-t from-api-bg via-api-bg to-transparent',
        className
      )}
    >
      <div className="max-w-4xl mx-auto">
        {/* Drag overlay */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                'absolute inset-4 rounded-2xl border-2 border-dashed flex items-center justify-center z-10',
                mode === 'local'
                  ? 'bg-local-bg/90 border-local-accent text-local-accent'
                  : 'bg-api-bg/90 border-api-accent text-api-accent'
              )}
            >
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium">Deposez vos fichiers ici</p>
                <p className="text-sm opacity-70">PDF, DOCX, Images</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attached files */}
        <AnimatePresence>
          {attachedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-wrap gap-2 mb-3"
            >
              {attachedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl',
                    mode === 'local'
                      ? 'bg-local-card border border-local-border'
                      : 'bg-white border border-api-border shadow-soft'
                  )}
                >
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <FileText
                      className={cn(
                        'w-5 h-5',
                        mode === 'local' ? 'text-local-accent' : 'text-api-accent'
                      )}
                    />
                  )}
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        'text-sm font-medium truncate max-w-[150px]',
                        mode === 'local' ? 'text-local-text' : 'text-api-text'
                      )}
                    >
                      {file.file.name}
                    </span>
                    <span
                      className={cn(
                        'text-xs',
                        mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
                      )}
                    >
                      {formatFileSize(file.file.size)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className={cn(
                      'p-1 rounded-lg transition-colors',
                      mode === 'local'
                        ? 'hover:bg-local-bg text-local-text-muted hover:text-local-text'
                        : 'hover:bg-api-bg text-api-text-muted hover:text-api-text'
                    )}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input container */}
        <div
          className={cn(
            'relative flex items-end gap-2 rounded-2xl border-2 transition-all duration-200',
            isFocused
              ? mode === 'local'
                ? 'border-local-accent shadow-glow/10'
                : 'border-api-accent shadow-glow-light/10'
              : mode === 'local'
              ? 'border-local-border'
              : 'border-api-border',
            mode === 'local' ? 'bg-local-card' : 'bg-white shadow-soft'
          )}
        >
          {/* Hidden file input */}
          <input
            {...getInputProps()}
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.docx,.png,.jpg,.jpeg"
          />

          {/* Attach button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isStreaming}
            className={cn(
              'flex-shrink-0 p-3 rounded-xl transition-all duration-200',
              mode === 'local'
                ? 'text-local-text-muted hover:text-local-accent hover:bg-local-bg'
                : 'text-api-text-muted hover:text-api-accent hover:bg-api-bg',
              isStreaming && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onInput={handleInput}
            disabled={isStreaming}
            placeholder="Posez votre question..."
            rows={1}
            className={cn(
              'flex-1 py-3.5 bg-transparent resize-none outline-none',
              'text-[15px] leading-relaxed',
              mode === 'local'
                ? 'text-local-text placeholder:text-local-text-muted'
                : 'text-api-text placeholder:text-api-text-muted',
              isStreaming && 'opacity-50'
            )}
            style={{ maxHeight: '200px' }}
          />

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={(!message.trim() && attachedFiles.length === 0) || isStreaming}
            className={cn(
              'flex-shrink-0 p-3 m-1 rounded-xl transition-all duration-200',
              message.trim() || attachedFiles.length > 0
                ? mode === 'local'
                  ? 'bg-local-accent hover:bg-local-accent-hover text-white'
                  : 'bg-api-accent hover:bg-api-accent-hover text-white'
                : mode === 'local'
                ? 'bg-local-border text-local-text-muted'
                : 'bg-api-border text-api-text-muted',
              isStreaming && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Helper text */}
        <p
          className={cn(
            'text-xs text-center mt-3',
            mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
          )}
        >
          Lokia peut faire des erreurs. Verifiez les informations importantes.
        </p>
      </div>
    </div>
  );
}
