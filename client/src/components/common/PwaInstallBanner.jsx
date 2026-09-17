import React from 'react';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { Button } from '@/components/ui/Button';
import { Download, X } from 'lucide-react';

export const PwaInstallBanner = () => {
  const { canInstall, promptInstall, dismissPrompt } = usePwaInstall();

  if (!canInstall) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-auto bg-surface p-4 rounded-xl border border-primary/30 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary">Install GoTaskManager</h4>
            <p className="text-[11px] text-text-secondary">
              Instant startup, offline access & standalone desktop/mobile app
            </p>
          </div>
        </div>

        <button
          onClick={dismissPrompt}
          className="p-1 rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          aria-label="Dismiss install prompt"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-border/60">
        <Button variant="ghost" size="sm" onClick={dismissPrompt}>
          Later
        </Button>
        <Button variant="primary" size="sm" onClick={promptInstall}>
          Install App
        </Button>
      </div>
    </div>
  );
};
