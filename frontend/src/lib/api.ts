/**
 * Lokia API Client
 * Configures the base URL and provides API helper functions
 */

// API base URL - uses /api/v1 prefix to match backend routes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

/**
 * Build full API URL
 */
export function getApiUrl(endpoint: string): string {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${API_PREFIX}${normalizedEndpoint}`;
}

/**
 * API request helper with authentication
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(endpoint);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP error ${response.status}`);
  }

  return response.json();
}

/**
 * Auth API
 */
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    apiRequest<{ access_token: string; user: { id: string; email: string; name: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify(data) }
    ),

  login: (data: { email: string; password: string }) =>
    apiRequest<{ access_token: string; user: { id: string; email: string; name: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(data) }
    ),

  googleAuth: (token: string) =>
    apiRequest<{ access_token: string; user: { id: string; email: string; name: string } }>(
      '/auth/google',
      { method: 'POST', body: JSON.stringify({ token }) }
    ),

  forgotPassword: (email: string) =>
    apiRequest<{ message: string }>(
      '/auth/forgot-password',
      { method: 'POST', body: JSON.stringify({ email }) }
    ),

  resetPassword: (token: string, newPassword: string) =>
    apiRequest<{ message: string }>(
      '/auth/reset-password',
      { method: 'POST', body: JSON.stringify({ token, new_password: newPassword }) }
    ),

  me: () =>
    apiRequest<{ id: string; email: string; name: string; role: string; tenant_id: string }>(
      '/auth/me'
    ),
};

/**
 * Documents API
 */
export const documentsApi = {
  upload: async (file: File, isShared: boolean = false) => {
    const url = getApiUrl('/documents/upload');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_shared', String(isShared));

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail);
    }

    return response.json();
  },

  list: () =>
    apiRequest<Array<{ id: string; filename: string; status: string }>>('/documents'),

  get: (id: string) =>
    apiRequest<{ id: string; filename: string; status: string }>(`/documents/${id}`),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/documents/${id}`, { method: 'DELETE' }),

  status: (id: string) =>
    apiRequest<{ id: string; status: string; chunk_count: number }>(`/documents/${id}/status`),
};

/**
 * Chat API
 */
export const chatApi = {
  sendMessage: async (message: string, conversationId?: string, llmMode: string = 'local') => {
    const url = getApiUrl('/chat');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, conversation_id: conversationId, llm_mode: llmMode }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Chat failed' }));
      throw new Error(error.detail);
    }

    return response;
  },

  listConversations: () =>
    apiRequest<Array<{ id: string; title: string; created_at: string }>>('/chat/conversations'),

  getConversation: (id: string) =>
    apiRequest<{ id: string; title: string; messages: Array<{ role: string; content: string }> }>(
      `/chat/conversations/${id}`
    ),

  updateConversation: (id: string, title: string) =>
    apiRequest<{ message: string }>(`/chat/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
    }),

  deleteConversation: (id: string) =>
    apiRequest<{ message: string }>(`/chat/conversations/${id}`, { method: 'DELETE' }),
};

/**
 * Admin API
 */
export const adminApi = {
  stats: () =>
    apiRequest<{
      total_users: number;
      total_documents: number;
      total_conversations: number;
      storage_used_mb: number;
    }>('/admin/stats'),

  listUsers: () =>
    apiRequest<Array<{ id: string; email: string; name: string; role: string }>>('/admin/users'),

  createUser: (data: { email: string; password: string; name: string; role?: string }) =>
    apiRequest<{ id: string; email: string; name: string; role: string }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateUser: (id: string, data: { name?: string; role?: string; is_active?: boolean }) =>
    apiRequest<{ id: string; email: string; name: string; role: string }>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteUser: (id: string) =>
    apiRequest<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' }),
};

export default {
  auth: authApi,
  documents: documentsApi,
  chat: chatApi,
  admin: adminApi,
  getApiUrl,
};
