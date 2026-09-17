import React from 'react';
import { TaskCheckbox } from './TaskCheckbox';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { useTaskStore } from '@/store/taskStore';
import { Clock, CheckSquare, MoreVertical, Trash2, Bell } from 'lucide-react';
import { cn } from '@/utils/cn';

export const TaskRow = ({ task }) => {
  const { toggleTaskStatus, selectTask, deleteTask } = useTaskStore();

  const isCompleted = task.status === 'COMPLETED';
  const subtasksCount = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  const formatDue = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      return `Today ${timeStr}`;
    }

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const dueLabel = formatDue(task.dueDate);

  return (
    <div
      onClick={() => selectTask(task)}
      className={cn(
        'bg-surface p-3 sm:p-3.5 rounded-xl border border-border shadow-subtle flex items-center justify-between gap-3',
        'hover:border-slate-300 dark:hover:border-border/80 transition-all cursor-pointer group select-none',
        isCompleted && 'bg-surface-subtle/40'
      )}
    >
      {/* Checkbox and Content */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <TaskCheckbox
          checked={isCompleted}
          onChange={() => toggleTaskStatus(task._id)}
        />

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-xs font-medium text-text-primary truncate transition-all duration-150',
              isCompleted && 'line-through text-text-muted'
            )}
          >
            {task.title}
          </p>

          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-secondary flex-wrap">
            {/* Project Pill */}
            {task.project && (
              <span className="font-semibold text-primary flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: task.project.color || '#6366F1' }}
                />
                {task.project.name}
              </span>
            )}
            {task.projectName && !task.project && (
              <span className="font-medium text-primary">
                {task.projectName}
              </span>
            )}

            {/* Due Date & Time */}
            {dueLabel && (
              <span className="flex items-center gap-1 text-text-muted">
                <Clock className="w-3 h-3" />
                {dueLabel}
              </span>
            )}

            {/* Subtasks Progress Pill */}
            {subtasksCount > 0 && (
              <span className="flex items-center gap-1 text-text-muted bg-surface-subtle px-1.5 py-0.2 rounded border border-border/60 text-[10px]">
                <CheckSquare className="w-2.5 h-2.5" />
                {completedSubtasks}/{subtasksCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Badges & Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <PriorityBadge priority={task.priority} />

        {/* Action icons on hover */}
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task._id);
            }}
            className="p-1 rounded text-text-muted hover:text-status-danger hover:bg-status-dangerBg transition-colors"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
