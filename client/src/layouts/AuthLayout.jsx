import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { CheckCircle2, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { ToastContainer } from '@/components/ui/Toast';

export const AuthLayout = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans transition-colors selection:bg-primary/20 selection:text-primary">
      {/* Top Bar with Brand & Theme Switcher */}
      <header className="flex items-center justify-between max-w-4xl w-full mx-auto">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="font-semibold text-base text-text-primary tracking-tight">
            GoTaskManager
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </header>

      {/* Centered Auth Card Container */}
      <main className="w-full max-w-sm mx-auto my-8">
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="text-center text-[11px] text-text-muted">
        <p>&copy; {new Date().getFullYear()} GoTaskManager. All rights reserved.</p>
      </footer>

      <ToastContainer />
    </div>
  );
};
