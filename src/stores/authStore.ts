import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/auth'

interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setAuth: (token: string, user: AuthState['user']) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },

      login: async (email: string, password: string) => {
        try {
          const response = await authService.login({ email, password });
          set({ 
            token: response.token, 
            user: response.user, 
            isAuthenticated: true 
          });
          return true;
        } catch (error) {
          return false;
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          const response = await authService.register({ email, password, name });
          set({ 
            token: response.token, 
            user: response.user, 
            isAuthenticated: true 
          });
          return true;
        } catch (error) {
          return false;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({ token: null, user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage'
    }
  )
) 