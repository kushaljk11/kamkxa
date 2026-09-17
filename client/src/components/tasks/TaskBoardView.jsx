import React from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useUiStore } from '@/store/uiStore';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { TaskCheckbox } from '@/components/tasks/TaskCheckbox';
import {
  Clock,
  Plus,
  CheckCircle2,
  CircleDot,
  Check,
  ArrowRight,
  MoreVertical,
  CheckSquare,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const COLUMNS = [
  {
    id: 'TODO',
    title: 'To Do',
    color: 'bg-slate-400 dark:bg-slate-500',
    headerBg: 'bg-surface-subtle',
  },
  {
    id: 'IN_PROGRESS',
    title: 'In Progress',
    color: 'bg-primary',
    headerBg: 'bg-primary/5',
  },
  {
    id: 'COMPLETED',
    title: 'Completed',
    color: 'bg-status-success',
    headerBg: 'bg-status-successBg/30',
  },
];

export const TaskBoardView = ({ tasks }) => {
  const { setSelectedTask, updateTaskStatus, toggleTaskStatus } = useTaskStore();
  const { openAddTask } = useUiStore();

  const getTasksByStatus = (status) => {
    return tasks.filter((t) => t.status === status);
  };

  const handleAdvanceStatus = (e, task) => {
    e.stopPropagation();
    if (task.status === 'TODO') {
      updateTaskStatus(task._id, 'IN_PROGRESS');
    } else if (task.status === 'IN_PROGRESS') {
      updateTaskStatus(task._id, 'COMPLETED');
    } else if (task.status === 'COMPLETED') {
      updateTaskStatus(task._id, 'TODO');
    }
  };

  const formatDue = (dueDate) => {
    if (!dueDate) return null;
    const d = new Date(dueDate);
    const now = new Date();
    const isOverdue = d < now;
    const formatted = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return { formatted, isOverdue };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start overflow-x-auto pb-6">
      {COLUMNS.map((col) => {
        const colTasks = getTasksByStatus(col.id);

        return (
          <div
            key={col.id}
            className="bg-surface rounded-xl border border-border shadow-card flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div
              className={cn(
                'p-3.5 border-b border-border flex items-center justify-between rounded-t-xl',
                col.headerBg
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn('w-2.5 h-2.5 rounded-full', col.color)} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  {col.title}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface border border-border text-text-secondary">
                  {colTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => openAddTask({ status: col.id })}
                className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
                title={`Add task to ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Body */}
            <div className="p-3 space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
              {colTasks.length > 0 ? (
                colTasks.map((task) => {
                  const due = formatDue(task.dueDate);
                  const completedSubtasks =
                    task.subtasks?.filter((s) => s.completed).length || 0;
                  const totalSubtasks = task.subtasks?.length || 0;

                  return (
                    <div
                      key={task._id}
                      onClick={() => setSelectedTask(task)}
                      className={cn(
                        'bg-surface p-3.5 rounded-lg border border-border hover:border-primary/50 shadow-subtle hover:shadow-card transition-all cursor-pointer group flex flex-col justify-between gap-3',
                        task.status === 'COMPLETED' && 'opacity-75 bg-surface-subtle/50'
                      )}
                    >
                      {/* Top row: Checkbox, Title, Advance button */}
                      <div className="flex items-start gap-2.5">
                        <TaskCheckbox
                          checked={task.status === 'COMPLETED'}
                          onChange={() => toggleTaskStatus(task._id)}
                          size="sm"
                          className="mt-0.5"
                        />

                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              'text-xs font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug break-words',
                              task.status === 'COMPLETED' &&
                                'line-through text-text-muted'
                            )}
                          >
                            {task.title}
                          </p>

                          {task.description && (
                            <p className="text-[11px] text-text-secondary line-clamp-2 mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Middle: Subtask indicator if any */}
                      {totalSubtasks > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-text-secondary bg-surface-subtle px-2 py-1 rounded border border-border/60 w-fit">
                          <CheckSquare className="w-3 h-3 text-text-muted" />
                          <span>
                            {completedSubtasks}/{totalSubtasks} subtasks
                          </span>
                        </div>
                      )}

                      {/* Bottom row: Badges, Due Date, Advance Action */}
                      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <PriorityBadge priority={task.priority} />

                          {task.project?.name && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-subtle border border-border text-text-secondary truncate max-w-[100px]">
                              {task.project.name}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {due && (
                            <span
                              className={cn(
                                'flex items-center gap-1 text-[10px]',
                                due.isOverdue && task.status !== 'COMPLETED'
                                  ? 'text-status-danger font-semibold'
                                  : 'text-text-muted'
                              )}
                            >
                              <Clock className="w-3 h-3" />
                              <span>{due.formatted}</span>
                            </span>
                          )}

                          {/* Quick advance button */}
                          <button
                            type="button"
                            onClick={(e) => handleAdvanceStatus(e, task)}
                            className="p-1 rounded text-text-muted hover:text-primary hover:bg-surface-subtle transition-colors"
                            title={
                              col.id === 'TODO'
                                ? 'Move to In Progress'
                                : col.id === 'IN_PROGRESS'
                                ? 'Mark Completed'
                                : 'Move back to To Do'
                            }
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-text-muted text-xs border border-dashed border-border rounded-lg p-4">
                  <p>No tasks in {col.title.toLowerCase()}</p>
                  <button
                    type="button"
                    onClick={() => openAddTask({ status: col.id })}
                    className="text-primary hover:underline text-[11px] font-medium mt-1 inline-block cursor-pointer"
                  >
                    + Add task
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
