import { create } from 'zustand';
import api from '@/services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,
  authError: null,

  setAuth: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: !!user,
      authError: null,
    });
  },

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      authError: null,
    });
  },

  setAuthError: (error) => set({ authError: error }),

  // Verify and refresh session on initial app load
  checkAuth: async () => {
    if (get().isAuthenticated) {
      set({ isCheckingAuth: false });
      return true;
    }

    set({ isCheckingAuth: true });
    try {
      // First try refreshing via the HTTP-only cookie
      const res = await api.post('/auth/refresh');
      if (res.data.success && res.data.user) {
        set({
          user: res.data.user,
          accessToken: res.data.accessToken,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
        return true;
      }
    } catch (error) {
      // Not logged in or expired refresh token
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
      return false;
    }
    set({ isCheckingAuth: false });
    return false;
  },

  login: async (email, password) => {
    set({ isLoading: true, authError: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, accessToken } = res.data;
      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
        authError: null,
      });
      return { success: true, user };
    } catch (error) {
      const message = error.message || 'Login failed. Please check your credentials.';
      set({
        isLoading: false,
        authError: message,
      });
      return { success: false, error: message };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, authError: null });
    try {
      const res = await api.post('/auth/register', userData);
      const { user, accessToken } = res.data;
      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
        authError: null,
      });
      return { success: true, user };
    } catch (error) {
      const message = error.message || 'Registration failed. Please check your details.';
      set({
        isLoading: false,
        authError: message,
      });
      return { success: false, error: message };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore network failures on logout
    } finally {
      get().clearAuth();
    }
  },

  updateUser: (updatedData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedData } : null,
    }));
  },
}));
