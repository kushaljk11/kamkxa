import { create } from 'zustand';

const THEME_STORAGE_KEY = 'gotaskmanager_theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved && ['light', 'dark', 'system'].includes(saved)) {
    return saved;
  }
  return 'system';
};

const applyThemeToDOM = (theme) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  root.classList.remove('light', 'dark');

  if (theme === 'dark' || (theme === 'system' && systemDark)) {
    root.classList.add('dark');
  } else {
    root.classList.add('light');
  }
};

export const useThemeStore = create((set) => {
  const initialTheme = getInitialTheme();
  applyThemeToDOM(initialTheme);

  // Listen to OS theme changes when on 'system'
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const current = useThemeStore.getState().theme;
      if (current === 'system') {
        applyThemeToDOM('system');
      }
    });
  }

  return {
    theme: initialTheme,
    setTheme: (newTheme) => {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      applyThemeToDOM(newTheme);
      set({ theme: newTheme });
    },
    toggleTheme: () => {
      set((state) => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        applyThemeToDOM(nextTheme);
        return { theme: nextTheme };
      });
    },
  };
});
