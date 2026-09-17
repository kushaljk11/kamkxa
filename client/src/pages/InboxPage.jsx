import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { TaskCheckbox } from '@/components/tasks/TaskCheckbox';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { TaskSkeleton } from '@/components/ui/Skeleton';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { useUiStore } from '@/store/uiStore';
import { toast } from '@/components/ui/Toast';
import {
  Inbox,
  Plus,
  FolderKanban,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Tag,
  CalendarDays,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const InboxPage = () => {
  const { openAddTask } = useUiStore();
  const {
    tasks,
    isLoading,
    fetchTasks,
    createTask,
    updateTask,
    toggleTaskStatus,
    setSelectedTask,
  } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();

  const [quickTitle, setQuickTitle] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  // Tasks in inbox: either explicitly marked isInbox or has no project, and not completed
  const inboxTasks = tasks.filter(
    (t) => t.status !== 'COMPLETED' && (t.isInbox || !t.project)
  );

  const handleQuickCapture = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim() || isCapturing) return;

    try {
      setIsCapturing(true);
      await createTask({
        title: quickTitle.trim(),
        isInbox: true,
        priority: 'MEDIUM',
      });
      setQuickTitle('');
      toast.success('Task captured to Inbox', 'Organize or schedule it whenever ready.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleAssignProject = async (taskId, projectId) => {
    if (!projectId) return;
    try {
      const selectedProj = projects.find((p) => p._id === projectId);
      await updateTask(taskId, {
        project: projectId,
        isInbox: false,
      });
      toast.success(
        `Moved to ${selectedProj?.name || 'Project'}`,
        'Task organized out of Inbox.'
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleDate = async (taskId, daysOffset) => {
    try {
      const d = new Date();
      d.setDate(d.getDate() + daysOffset);
      d.setHours(16, 0, 0, 0); // Default to 4:00 PM

      await updateTask(taskId, {
        dueDate: d.toISOString(),
      });
      toast.success(
        daysOffset === 0 ? 'Scheduled for Today' : 'Scheduled for Tomorrow',
        'Visible in My Day & Calendar.'
      );
    } catch (err) {
      console.error(err);
    }
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <PageContainer>
      <PageHeader
        title="Inbox"
        subtitle="Quickly capture tasks and unorganized thoughts without worrying about projects or deadlines yet"
        actions={
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-subtle border border-border text-text-secondary">
            {inboxTasks.length} unorganized
          </span>
        }
      />

      {/* Quick Capture Card */}
      <form
        onSubmit={handleQuickCapture}
        className="bg-surface p-3.5 rounded-xl border border-border shadow-card mb-6 flex items-center gap-3 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Plus className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Capture an unorganized thought or errand and press Enter..."
          className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
          autoFocus
        />
        <Button
          type="submit"
          size="sm"
          variant="primary"
          disabled={!quickTitle.trim() || isCapturing}
        >
          Capture
        </Button>
      </form>

      {/* Inbox Task List / Loading / Zero State */}
      {isLoading && inboxTasks.length === 0 ? (
        <div className="space-y-2">
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
        </div>
      ) : inboxTasks.length === 0 ? (
        /* Inbox Zero State */
        <div className="bg-surface rounded-xl border border-border p-12 text-center shadow-card">
          <div className="w-12 h-12 rounded-full bg-status-successBg text-status-success flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-text-primary mb-1">
            Inbox Zero Achieved
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4 leading-relaxed">
            All your captured thoughts and tasks have been organized into projects or scheduled.
            Use the capture bar above whenever inspiration strikes.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openAddTask({ isInbox: true })}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Capture Next Idea
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {inboxTasks.map((task) => (
            <div
              key={task._id}
              className="bg-surface p-3.5 rounded-xl border border-border shadow-subtle hover:shadow-card hover:border-slate-300 dark:hover:border-border-subtle transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Left: Checkbox & Title */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <TaskCheckbox
                  checked={task.status === 'COMPLETED'}
                  onChange={() => toggleTaskStatus(task._id)}
                  size="md"
                />

                <div
                  className="min-w-0 flex-1 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <p className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-muted">
                    <span>{formatRelativeTime(task.createdAt)}</span>
                    <PriorityBadge priority={task.priority} />
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-text-secondary">
                        <CalendarDays className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Inline Triage Actions */}
              <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
                {/* Quick Project Assignment Dropdown */}
                <select
                  value=""
                  onChange={(e) => handleAssignProject(task._id, e.target.value)}
                  className="text-[11px] font-medium bg-surface-subtle border border-border text-text-secondary hover:text-text-primary rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  title="Assign to project"
                >
                  <option value="" disabled>
                    + Assign Project
                  </option>
                  {projects
                    .filter((p) => !p.isArchived)
                    .map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                </select>

                {/* Quick Schedule Shortcuts */}
                {!task.dueDate && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleScheduleDate(task._id, 0)}
                      className="px-2 py-1 text-[10px] font-medium rounded-md bg-surface-subtle hover:bg-primary/10 hover:text-primary border border-border text-text-secondary transition-colors cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScheduleDate(task._id, 1)}
                      className="px-2 py-1 text-[10px] font-medium rounded-md bg-surface-subtle hover:bg-primary/10 hover:text-primary border border-border text-text-secondary transition-colors cursor-pointer"
                    >
                      Tomorrow
                    </button>
                  </div>
                )}

                {/* Inspect Drawer trigger */}
                <button
                  type="button"
                  onClick={() => setSelectedTask(task)}
                  className="p-1 rounded text-text-muted hover:text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
                  title="Open details"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};
