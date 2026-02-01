'use client';

import { useState, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTheme } from '@/hooks/useTheme';
import { cn, formatFileSize, formatDate } from '@/lib/utils';
import {
  FileText,
  Upload,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  FolderOpen,
  Users,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import type { Document } from '@/types';

// Mock documents
const mockDocuments: Document[] = [
  {
    id: '1',
    filename: 'contrat_fournisseur_abc.pdf',
    originalFilename: 'Contrat Fournisseur ABC.pdf',
    fileSize: 2456789,
    fileType: 'application/pdf',
    status: 'ready',
    isShared: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    processedAt: new Date(Date.now() - 86000000).toISOString(),
  },
  {
    id: '2',
    filename: 'politique_rh_2024.pdf',
    originalFilename: 'Politique RH 2024.pdf',
    fileSize: 1234567,
    fileType: 'application/pdf',
    status: 'ready',
    isShared: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    processedAt: new Date(Date.now() - 172400000).toISOString(),
  },
  {
    id: '3',
    filename: 'procedure_facturation.docx',
    originalFilename: 'Procedure Facturation.docx',
    fileSize: 567890,
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'processing',
    isShared: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '4',
    filename: 'normes_iso_9001.pdf',
    originalFilename: 'Normes ISO 9001.pdf',
    fileSize: 3456789,
    fileType: 'application/pdf',
    status: 'ready',
    isShared: true,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    processedAt: new Date(Date.now() - 604000000).toISOString(),
  },
];

export default function DocumentsPage() {
  const { mode } = useTheme();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'shared' | 'personal'>('all');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      const newDocs = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        filename: file.name.toLowerCase().replace(/\s/g, '_'),
        originalFilename: file.name,
        fileSize: file.size,
        fileType: file.type,
        status: 'processing' as const,
        isShared: false,
        createdAt: new Date().toISOString(),
      }));
      setDocuments((prev) => [...newDocs, ...prev]);
      setIsUploading(false);
    }, 1500);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 30 * 1024 * 1024,
  });

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.originalFilename
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'shared' && doc.isShared) ||
      (filter === 'personal' && !doc.isShared);
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-amber-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: Document['status']) => {
    switch (status) {
      case 'ready':
        return 'Indexe';
      case 'processing':
        return 'En cours...';
      case 'error':
        return 'Erreur';
      default:
        return 'En attente';
    }
  };

  return (
    <MainLayout>
      <div
        className={cn(
          'flex-1 overflow-y-auto p-6',
          mode === 'local' ? 'bg-local-bg' : 'bg-api-bg'
        )}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className={cn(
                  'text-2xl font-semibold',
                  mode === 'local' ? 'text-local-text' : 'text-api-text'
                )}
              >
                Documents
              </h1>
              <p
                className={cn(
                  'mt-1',
                  mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
                )}
              >
                Gerez vos documents pour enrichir les reponses de Lokia
              </p>
            </div>
          </div>

          {/* Upload zone */}
          <div
            {...getRootProps()}
            className={cn(
              'relative border-2 border-dashed rounded-2xl p-8 mb-8 text-center transition-all duration-200 cursor-pointer',
              isDragActive
                ? mode === 'local'
                  ? 'border-local-accent bg-local-accent/5'
                  : 'border-api-accent bg-api-accent/5'
                : mode === 'local'
                ? 'border-local-border hover:border-local-accent/50 bg-local-card/50'
                : 'border-api-border hover:border-api-accent/50 bg-white/50'
            )}
          >
            <input {...getInputProps()} />
            <div
              className={cn(
                'mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4',
                mode === 'local'
                  ? 'bg-local-accent/10 text-local-accent'
                  : 'bg-api-accent/10 text-api-accent'
              )}
            >
              <Upload className="w-7 h-7" />
            </div>
            <p
              className={cn(
                'font-medium mb-1',
                mode === 'local' ? 'text-local-text' : 'text-api-text'
              )}
            >
              {isDragActive
                ? 'Deposez vos fichiers ici'
                : 'Glissez-deposez vos documents'}
            </p>
            <p
              className={cn(
                'text-sm',
                mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
              )}
            >
              ou cliquez pour selectionner (PDF, DOCX - max 30 Mo)
            </p>
            {isUploading && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-local-accent border-t-transparent rounded-full animate-spin" />
                <span
                  className={cn(
                    'text-sm',
                    mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
                  )}
                >
                  Upload en cours...
                </span>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div
              className={cn(
                'flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl',
                mode === 'local'
                  ? 'bg-local-card border border-local-border'
                  : 'bg-white border border-api-border shadow-soft'
              )}
            >
              <Search
                className={cn(
                  'w-5 h-5',
                  mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
                )}
              />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'flex-1 bg-transparent outline-none text-sm',
                  mode === 'local'
                    ? 'text-local-text placeholder:text-local-text-muted'
                    : 'text-api-text placeholder:text-api-text-muted'
                )}
              />
            </div>

            {/* Filter tabs */}
            <div
              className={cn(
                'flex rounded-xl p-1',
                mode === 'local'
                  ? 'bg-local-card border border-local-border'
                  : 'bg-white border border-api-border shadow-soft'
              )}
            >
              {[
                { key: 'all', label: 'Tous', icon: FolderOpen },
                { key: 'shared', label: 'Partages', icon: Users },
                { key: 'personal', label: 'Personnels', icon: User },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as typeof filter)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    filter === key
                      ? mode === 'local'
                        ? 'bg-local-accent text-white'
                        : 'bg-api-accent text-white'
                      : mode === 'local'
                      ? 'text-local-text-muted hover:text-local-text'
                      : 'text-api-text-muted hover:text-api-text'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Documents list */}
          <div className="space-y-2">
            <AnimatePresence>
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl transition-all duration-200',
                    mode === 'local'
                      ? 'bg-local-card border border-local-border hover:border-local-accent/50'
                      : 'bg-white border border-api-border hover:border-api-accent/50 shadow-soft'
                  )}
                >
                  {/* File icon */}
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      mode === 'local'
                        ? 'bg-local-bg text-local-accent'
                        : 'bg-api-bg text-api-accent'
                    )}
                  >
                    <FileText className="w-6 h-6" />
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'font-medium truncate',
                        mode === 'local' ? 'text-local-text' : 'text-api-text'
                      )}
                    >
                      {doc.originalFilename}
                    </p>
                    <div
                      className={cn(
                        'flex items-center gap-3 mt-1 text-sm',
                        mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
                      )}
                    >
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>•</span>
                      <span>{formatDate(doc.createdAt)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {doc.isShared ? (
                          <>
                            <Users className="w-3 h-3" />
                            Partage
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3" />
                            Personnel
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {getStatusIcon(doc.status)}
                    <span
                      className={cn(
                        'text-sm',
                        mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
                      )}
                    >
                      {getStatusText(doc.status)}
                    </span>
                  </div>

                  {/* Actions */}
                  <button
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      mode === 'local'
                        ? 'hover:bg-local-bg text-local-text-muted hover:text-local-text'
                        : 'hover:bg-api-bg text-api-text-muted hover:text-api-text'
                    )}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen
                  className={cn(
                    'w-12 h-12 mx-auto mb-4',
                    mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
                  )}
                />
                <p
                  className={cn(
                    'font-medium',
                    mode === 'local' ? 'text-local-text' : 'text-api-text'
                  )}
                >
                  Aucun document trouve
                </p>
                <p
                  className={cn(
                    'text-sm mt-1',
                    mode === 'local' ? 'text-local-text-muted' : 'text-api-text-muted'
                  )}
                >
                  Uploadez vos premiers documents pour commencer
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
