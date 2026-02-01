import axios from "axios";
import type {
  User,
  Conversation,
  ConversationWithMessages,
  Message,
  AuthTokens,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const { data } = await axios.post<AuthTokens>(
            `${API_URL}/auth/refresh`,
            null,
            { params: { refresh_token: refreshToken } }
          );

          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);

          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: async (email: string, password: string, fullName?: string): Promise<User> => {
    const { data } = await api.post<User>("/auth/register", {
      email,
      password,
      full_name: fullName,
    });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthTokens> => {
    const { data } = await api.post<AuthTokens>("/auth/login", {
      email,
      password,
    });
    return data;
  },
};

// Conversations
export const conversationsApi = {
  list: async (): Promise<Conversation[]> => {
    const { data } = await api.get<Conversation[]>("/conversations");
    return data;
  },

  get: async (id: number): Promise<ConversationWithMessages> => {
    const { data } = await api.get<ConversationWithMessages>(`/conversations/${id}`);
    return data;
  },

  create: async (title?: string): Promise<Conversation> => {
    const { data } = await api.post<Conversation>("/conversations", { title });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/conversations/${id}`);
  },

  sendMessage: async (conversationId: number, content: string): Promise<Message> => {
    const { data } = await api.post<Message>(
      `/conversations/${conversationId}/messages`,
      { content }
    );
    return data;
  },
};

export default api;
