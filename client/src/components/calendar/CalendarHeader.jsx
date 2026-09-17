import React from 'react';
import { Button } from '@/components/ui/Button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const CalendarHeader = ({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrev,
  onNext,
  onToday,
  onNewTask,
}) => {
  const formattedTitle = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  return (
    <div className="bg-surface p-3.5 rounded-xl border border-border shadow-card mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Date Navigation */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 tracking-tight">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <span>{formattedTitle}</span>
        </h2>

        <button
          type="button"
          onClick={onToday}
          className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
        >
          Today
        </button>
      </div>

      {/* View Mode Toggle & New Task */}
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-lg border border-border">
          {['Month', 'Week'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode.toLowerCase())}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer',
                viewMode === mode.toLowerCase()
                  ? 'bg-surface text-text-primary shadow-subtle font-semibold'
                  : 'text-text-muted hover:text-text-primary'
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onNewTask}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          New Task
        </Button>
      </div>
    </div>
  );
};
