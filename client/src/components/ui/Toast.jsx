import React from 'react';
import { create } from 'zustand';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: ({ title, description, type = 'info', duration = 4000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    set((state) => ({
      toasts: [...state.toasts, { id, title, description, type }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = {
  success: (title, description) =>
    useToastStore.getState().addToast({ title, description, type: 'success' }),
  error: (title, description) =>
    useToastStore.getState().addToast({ title, description, type: 'error' }),
  warning: (title, description) =>
    useToastStore.getState().addToast({ title, description, type: 'warning' }),
  info: (title, description) =>
    useToastStore.getState().addToast({ title, description, type: 'info' }),
};

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: 'border-status-successBorder bg-surface text-text-primary',
  error: 'border-status-dangerBorder bg-surface text-text-primary',
  warning: 'border-status-warningBorder bg-surface text-text-primary',
  info: 'border-border bg-surface text-text-primary',
};

const iconColors = {
  success: 'text-status-success',
  error: 'text-status-danger',
  warning: 'text-status-warning',
  info: 'text-primary',
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const Icon = icons[t.type] || icons.info;
        const iconColor = iconColors[t.type] || iconColors.info;

        return (
          <div
            key={t.id}
            role="alert"
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-dropdown animate-in slide-in-from-bottom-2 fade-in duration-200 transition-all',
              toastStyles[t.type] || toastStyles.info
            )}
          >
            <Icon className={cn('w-4 h-4 shrink-0 mt-0.5', iconColor)} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary">{t.title}</p>
              {t.description && (
                <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
