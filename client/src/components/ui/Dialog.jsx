import React, { useEffect } from 'react';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

export const Dialog = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = 'max-w-md',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog box */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-description' : undefined}
        className={cn(
          'relative w-full bg-surface rounded-xl border border-border shadow-drawer z-10 overflow-hidden',
          'transform transition-all duration-200 animate-in fade-in zoom-in-95',
          maxWidth,
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div>
            {title && (
              <h2
                id="dialog-title"
                className="text-base font-semibold text-text-primary tracking-tight"
              >
                {title}
              </h2>
            )}
            {description && (
              <p id="dialog-description" className="text-xs text-text-secondary mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
