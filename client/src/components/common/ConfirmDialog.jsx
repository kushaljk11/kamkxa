import React from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center">
        {isDestructive && (
          <div className="w-10 h-10 rounded-full bg-status-dangerBg text-status-danger flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
        )}

        <h3 className="text-sm font-semibold text-text-primary mb-1.5">{title}</h3>
        <p className="text-xs text-text-secondary mb-5 leading-relaxed">{description}</p>

        <div className="flex items-center gap-2.5 w-full">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
