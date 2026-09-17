import React from 'react';
import { cn } from '@/utils/cn';
import { Plus } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MonthCalendarView = ({
  currentDate,
  tasks,
  onSelectTask,
  onSelectDay,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startingDayIndex = firstDay.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const isCurrentDay = (d, m, y) =>
    today.getDate() === d &&
    today.getMonth() === m &&
    today.getFullYear() === y;

  // Build grid cells
  const cells = [];

  // Trailing days from previous month
  for (let i = startingDayIndex - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const cellDate = new Date(year, month - 1, day);
    cells.push({
      date: cellDate,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: isCurrentDay(day, month - 1, year),
    });
  }

  // Days in current month
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    cells.push({
      date: cellDate,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: isCurrentDay(day, month, year),
    });
  }

  // Leading days from next month to complete 35 or 42 grid
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= remainingCells; day++) {
    const cellDate = new Date(year, month + 1, day);
    cells.push({
      date: cellDate,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: isCurrentDay(day, month + 1, year),
    });
  }

  // Helper to get tasks for a date
  const getTasksForDate = (date) => {
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    });
  };

  const getPriorityStyle = (priority, isCompleted) => {
    if (isCompleted) {
      return 'bg-surface-subtle text-text-muted border-l-2 border-l-status-success';
    }
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-l-2 border-l-rose-500';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-l-2 border-l-amber-500';
      case 'LOW':
        return 'bg-slate-50 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300 border-l-2 border-l-slate-400';
      default:
        return 'bg-primary/10 text-primary dark:text-primary-light border-l-2 border-l-primary';
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-border bg-surface-subtle/60 text-center">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2.5 text-xs font-bold text-text-secondary uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-border">
        {cells.map((cell, idx) => {
          const dayTasks = getTasksForDate(cell.date);
          const visibleTasks = dayTasks.slice(0, 3);
          const overflowCount = dayTasks.length - 3;

          return (
            <div
              key={idx}
              onClick={() => onSelectDay(cell.date)}
              className={cn(
                'min-h-[110px] p-2 flex flex-col justify-between transition-colors group cursor-pointer relative',
                cell.isCurrentMonth
                  ? 'bg-surface hover:bg-surface-subtle/40'
                  : 'bg-surface-subtle/30 text-text-muted hover:bg-surface-subtle/50'
              )}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                    cell.isToday
                      ? 'bg-primary text-white shadow-sm font-bold'
                      : cell.isCurrentMonth
                      ? 'text-text-primary'
                      : 'text-text-muted'
                  )}
                >
                  {cell.dayNumber}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDay(cell.date);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-surface-subtle text-text-muted hover:text-primary transition-opacity"
                  title="Add task on this day"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Task Pills */}
              <div className="space-y-1 flex-1 overflow-hidden">
                {visibleTasks.map((task) => (
                  <div
                    key={task._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTask(task);
                    }}
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[11px] font-medium truncate transition-transform hover:scale-[1.02]',
                      getPriorityStyle(task.priority, task.status === 'COMPLETED'),
                      task.status === 'COMPLETED' && 'line-through opacity-70'
                    )}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}

                {overflowCount > 0 && (
                  <span className="text-[10px] font-semibold text-text-muted pl-1 block">
                    +{overflowCount} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
