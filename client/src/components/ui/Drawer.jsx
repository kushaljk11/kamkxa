import React, { useEffect } from 'react';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  width = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'w-screen bg-surface border-l border-border shadow-drawer flex flex-col',
            'transform transition-transform duration-300 ease-out',
            // On mobile: fixed bottom sheet styling if needed, or full drawer
            'h-full',
            width,
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
            <div>
              {title && (
                <h2 className="text-sm font-semibold text-text-primary tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-xs text-text-secondary">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5">{children}</div>

          {/* Optional Footer */}
          {footer && (
            <div className="p-4 border-t border-border bg-surface-subtle/50 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
