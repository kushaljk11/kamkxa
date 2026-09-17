import React from 'react';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { TaskCheckbox } from '@/components/tasks/TaskCheckbox';
import { useTaskStore } from '@/store/taskStore';
import { Clock, Plus, CheckSquare } from 'lucide-react';
import { cn } from '@/utils/cn';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const WeekCalendarView = ({
  currentDate,
  tasks,
  onSelectTask,
  onSelectDay,
}) => {
  const { toggleTaskStatus } = useTaskStore();

  // Find Sunday of the current week
  const curr = new Date(currentDate);
  const sunday = new Date(curr.setDate(curr.getDate() - curr.getDay()));

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });

  const today = new Date();
  const isToday = (d) =>
    today.getDate() === d.getDate() &&
    today.getMonth() === d.getMonth() &&
    today.getFullYear() === d.getFullYear();

  const getTasksForDay = (dayDate) => {
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return (
        d.getDate() === dayDate.getDate() &&
        d.getMonth() === dayDate.getMonth() &&
        d.getFullYear() === dayDate.getFullYear()
      );
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3.5 items-start">
      {weekDays.map((dayDate, idx) => {
        const dayTasks = getTasksForDay(dayDate);
        const isCurrentDay = isToday(dayDate);

        return (
          <div
            key={idx}
            className={cn(
              'bg-surface rounded-xl border border-border shadow-card flex flex-col min-h-[480px]',
              isCurrentDay && 'border-primary/40 shadow-md ring-1 ring-primary/20'
            )}
          >
            {/* Day Column Header */}
            <div
              className={cn(
                'p-3 border-b border-border flex items-center justify-between rounded-t-xl',
                isCurrentDay ? 'bg-primary/5' : 'bg-surface-subtle/50'
              )}
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block">
                  {WEEKDAYS[dayDate.getDay()].slice(0, 3)}
                </span>
                <span
                  className={cn(
                    'text-base font-bold',
                    isCurrentDay ? 'text-primary' : 'text-text-primary'
                  )}
                >
                  {dayDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface border border-border text-text-secondary">
                {dayTasks.length}
              </span>
            </div>

            {/* Tasks in Day */}
            <div className="p-2.5 space-y-2 flex-1 overflow-y-auto max-h-[500px]">
              {dayTasks.length > 0 ? (
                dayTasks.map((task) => {
                  const timeStr = task.dueDate
                    ? new Date(task.dueDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : null;

                  return (
                    <div
                      key={task._id}
                      onClick={() => onSelectTask(task)}
                      className={cn(
                        'bg-surface p-2.5 rounded-lg border border-border hover:border-primary/40 shadow-subtle hover:shadow-card transition-all cursor-pointer group',
                        task.status === 'COMPLETED' && 'opacity-70 bg-surface-subtle/50'
                      )}
                    >
                      <div className="flex items-start gap-2 mb-1.5">
                        <TaskCheckbox
                          checked={task.status === 'COMPLETED'}
                          onChange={() => toggleTaskStatus(task._id)}
                          size="sm"
                          className="mt-0.5"
                        />
                        <p
                          className={cn(
                            'text-xs font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug line-clamp-2',
                            task.status === 'COMPLETED' && 'line-through text-text-muted'
                          )}
                        >
                          {task.title}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-border/50 text-[10px] text-text-muted">
                        <PriorityBadge priority={task.priority} />
                        {timeStr && (
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {timeStr}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-text-muted text-xs">
                  <p className="text-[11px]">No tasks</p>
                </div>
              )}
            </div>

            {/* Quick Add Button at bottom of column */}
            <div className="p-2 border-t border-border bg-surface-subtle/30 rounded-b-xl">
              <button
                type="button"
                onClick={() => onSelectDay(dayDate)}
                className="w-full py-1 text-xs text-text-muted hover:text-primary hover:bg-surface rounded transition-colors flex items-center justify-center gap-1 cursor-pointer font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
