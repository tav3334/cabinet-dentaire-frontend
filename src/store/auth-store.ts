import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import api, { getCsrfCookie } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      login: async (email: string, password: string) => {
        // Obtenir le cookie CSRF avant la requête de login
        await getCsrfCookie();

        const response = await api.post('/login', { email, password });
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      register: async (name: string, email: string, password: string, passwordConfirmation: string) => {
        // Obtenir le cookie CSRF avant la requête de register
        await getCsrfCookie();

        const response = await api.post('/register', {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        });
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await api.post('/logout');
        } catch {
          // Ignore logout errors
        } finally {
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        try {
          const response = await api.get('/user');
          set({ user: response.data.data, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
      skipHydration: true,
    }
  )
);
