import React, { useState } from 'react';
import { TaskCheckbox } from './TaskCheckbox';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export const SubtaskEditor = ({
  subtasks = [],
  onChange,
  onAddSubtask,
  onToggleSubtask,
  readOnly = false,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (onAddSubtask) {
      onAddSubtask(newTitle.trim());
    } else if (onChange) {
      const newSubtask = {
        _id: 'sub-' + Date.now(),
        title: newTitle.trim(),
        completed: false,
        completedAt: null,
      };
      onChange([...subtasks, newSubtask]);
    }
    setNewTitle('');
  };

  const handleToggle = (subtaskId, completed) => {
    if (onToggleSubtask) {
      onToggleSubtask(subtaskId, completed);
    } else if (onChange) {
      onChange(
        subtasks.map((s) =>
          s._id === subtaskId
            ? { ...s, completed, completedAt: completed ? new Date().toISOString() : null }
            : s
        )
      );
    }
  };

  const handleDelete = (subtaskId) => {
    if (onChange) {
      onChange(subtasks.filter((s) => s._id !== subtaskId));
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Progress header if subtasks exist */}
      {totalCount > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-primary">Subtasks</span>
            <span className="text-[11px] text-text-secondary font-medium">
              {completedCount} / {totalCount} complete ({progressPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtask list */}
      <div className="space-y-1.5">
        {subtasks.map((subtask) => (
          <div
            key={subtask._id}
            className="flex items-center justify-between gap-2.5 p-2 rounded-lg bg-surface border border-border/60 hover:border-slate-300 dark:hover:border-border transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <TaskCheckbox
                checked={subtask.completed}
                onChange={(checked) => handleToggle(subtask._id, checked)}
                disabled={readOnly}
                size="sm"
              />
              <span
                className={cn(
                  'text-xs text-text-primary truncate',
                  subtask.completed && 'line-through text-text-muted'
                )}
              >
                {subtask.title}
              </span>
            </div>

            {!readOnly && (
              <button
                type="button"
                onClick={() => handleDelete(subtask._id)}
                className="p-1 rounded text-text-muted hover:text-status-danger hover:bg-status-dangerBg opacity-0 group-hover:opacity-100 transition-all"
                aria-label="Delete subtask"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Quick Add Subtask Input */}
      {!readOnly && (
        <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add subtask (press Enter)..."
            className="flex-1 bg-surface text-xs rounded-lg border border-border px-3 py-1.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="p-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-primary hover:border-primary disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Add subtask"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};
