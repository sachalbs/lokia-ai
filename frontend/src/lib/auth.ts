/**
 * Lokia Auth utilities
 */
import { authApi } from './api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenant_id?: string;
}

/**
 * Store authentication token
 */
export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Get stored authentication token
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Remove authentication token
 */
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

/**
 * Store user data
 */
export function setUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

/**
 * Get stored user data
 */
export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Register a new user
 */
export async function register(email: string, password: string, name: string): Promise<User> {
  const response = await authApi.register({ email, password, name });
  setToken(response.access_token);
  setUser(response.user as User);
  return response.user as User;
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<User> {
  const response = await authApi.login({ email, password });
  setToken(response.access_token);
  setUser(response.user as User);
  return response.user as User;
}

/**
 * Logout user
 */
export function logout(): void {
  removeToken();
}

/**
 * Get current user from API
 */
export async function getCurrentUser(): Promise<User> {
  const user = await authApi.me();
  setUser(user);
  return user;
}

export default {
  setToken,
  getToken,
  removeToken,
  setUser,
  getUser,
  isAuthenticated,
  register,
  login,
  logout,
  getCurrentUser,
};
