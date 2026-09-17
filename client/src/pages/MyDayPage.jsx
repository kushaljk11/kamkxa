import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { Button } from '@/components/ui/Button';
import { TaskRow } from '@/components/tasks/TaskRow';
import { TaskSkeleton } from '@/components/ui/Skeleton';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import {
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Flame,
  Check,
  Calendar,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const MyDayPage = () => {
  const { openAddTask } = useUiStore();
  const { user } = useAuthStore();
  const { tasks, isLoading, fetchTasks, createTask, setSelectedTask } = useTaskStore();

  const [quickTitle, setQuickTitle] = useState('');
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const firstName = user?.firstName || 'Kushal';

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  // Date classification helpers
  const isDateToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const isDateOverdue = (dateStr, status) => {
    if (!dateStr || status === 'COMPLETED') return false;
    const d = new Date(dateStr);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return d < todayStart;
  };

  const isDateUpcoming = (dateStr, status) => {
    if (!dateStr || status === 'COMPLETED') return false;
    const d = new Date(dateStr);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    weekEnd.setHours(23, 59, 59, 999);
    return d > todayEnd && d <= weekEnd;
  };

  const isTaskCompletedToday = (task) => {
    if (task.status !== 'COMPLETED') return false;
    const d = task.completedAt ? new Date(task.completedAt) : new Date(task.updatedAt);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  // Group tasks
  const todayPending = tasks.filter(
    (t) => t.status !== 'COMPLETED' && (isDateToday(t.dueDate) || !t.dueDate)
  );

  const todayCompleted = tasks.filter((t) => isTaskCompletedToday(t));

  const overdueTasks = tasks.filter((t) => isDateOverdue(t.dueDate, t.status));

  const upcomingTasks = tasks.filter((t) => isDateUpcoming(t.dueDate, t.status));

  const priorityFocus = tasks.filter(
    (t) =>
      t.status !== 'COMPLETED' &&
      (t.priority === 'URGENT' || t.priority === 'HIGH')
  );

  // Progress metrics
  const totalTodayWorkload = todayPending.length + todayCompleted.length;
  const completionPercentage =
    totalTodayWorkload > 0
      ? Math.round((todayCompleted.length / totalTodayWorkload) * 100)
      : todayCompleted.length > 0
      ? 100
      : 0;

  const metrics = [
    {
      title: 'Due Today',
      count: todayPending.length,
      badge: todayPending.length > 0 ? 'On schedule' : 'Clean slate',
      badgeColor:
        todayPending.length > 0
          ? 'bg-primary/10 text-primary'
          : 'bg-surface-subtle text-text-muted',
      icon: Clock,
    },
    {
      title: 'Completed',
      count: todayCompleted.length,
      badge: todayCompleted.length > 0 ? 'Great pace' : 'Ready',
      badgeColor: 'bg-status-successBg text-status-success',
      icon: CheckCircle2,
    },
    {
      title: 'Overdue',
      count: overdueTasks.length,
      badge: overdueTasks.length > 0 ? 'Action needed' : 'Zero overdue',
      badgeColor:
        overdueTasks.length > 0
          ? 'bg-status-dangerBg text-status-danger'
          : 'bg-surface-subtle text-text-muted',
      icon: AlertCircle,
    },
    {
      title: 'Upcoming',
      count: upcomingTasks.length,
      badge: 'Next 7 days',
      badgeColor: 'bg-surface-subtle text-text-secondary',
      icon: CalendarDays,
    },
  ];

  // Inline Quick Add Handler
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim() || isSubmittingQuick) return;

    try {
      setIsSubmittingQuick(true);
      const todayIso = new Date().toISOString();
      await createTask({
        title: quickTitle.trim(),
        dueDate: todayIso,
        priority: 'MEDIUM',
      });
      setQuickTitle('');
    } catch (err) {
      console.error('Quick task creation error:', err);
    } finally {
      setIsSubmittingQuick(false);
    }
  };

  // Helper for relative deadline label
  const formatRelativeDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 6) {
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <PageContainer>
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-xs text-text-secondary mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-text-muted" />
            <span>{formattedDate}</span>
            <span className="text-text-muted">&bull;</span>
            <span>
              {todayPending.length === 0
                ? 'Your day is all clear'
                : `${todayPending.length} item${todayPending.length > 1 ? 's' : ''} to accomplish`}
            </span>
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => openAddTask({ dueDate: new Date().toISOString() })}
          leftIcon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto shadow-sm"
        >
          New Task
        </Button>
      </div>

      {/* Live Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.title}
              className="bg-surface p-4 rounded-xl border border-border shadow-card flex flex-col justify-between hover:border-slate-300 dark:hover:border-border-subtle transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">
                  {m.title}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-medium px-2 py-0.5 rounded-full',
                    m.badgeColor
                  )}
                >
                  {m.badge}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-bold text-text-primary tracking-tight">
                  {isLoading ? '...' : m.count}
                </span>
                <Icon className="w-4 h-4 text-text-muted" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Progress Tracker */}
      {totalTodayWorkload > 0 && (
        <div className="bg-surface p-4 rounded-xl border border-border shadow-card mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-text-primary flex items-center gap-2">
                <span>Today's Progress</span>
                <span className="text-[11px] font-medium text-text-muted">
                  {todayCompleted.length} of {totalTodayWorkload} completed &bull; {completionPercentage}%
                </span>
              </div>
              <p className="text-[11px] text-text-secondary mt-0.5">
                {completionPercentage === 100
                  ? 'All tasks finished for today! Excellent momentum.'
                  : completionPercentage >= 50
                  ? 'Over halfway through your daily agenda. Keep it up!'
                  : 'Start with high-priority items to build momentum.'}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48 bg-surface-subtle h-2 rounded-full overflow-hidden border border-border">
            <div
              className="bg-primary h-full transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Daily Workload */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks Card */}
          <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-text-primary">
                  Today's Tasks
                </h2>
              </div>
              <span className="text-xs text-text-secondary font-medium">
                {todayPending.length} pending
              </span>
            </div>

            {/* Inline Quick Capture Bar */}
            <form
              onSubmit={handleQuickAdd}
              className="p-3 border-b border-border bg-surface-subtle/50 flex items-center gap-2"
            >
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Quick add a task for today... (Press Enter)"
                className="flex-1 text-xs bg-surface border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!quickTitle.trim() || isSubmittingQuick}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add
              </Button>
            </form>

            {/* Tasks List */}
            <div className="p-3 space-y-2">
              {isLoading ? (
                <>
                  <TaskSkeleton />
                  <TaskSkeleton />
                  <TaskSkeleton />
                </>
              ) : todayPending.length > 0 ? (
                todayPending.map((task) => (
                  <TaskRow key={task._id} task={task} />
                ))
              ) : (
                /* Calm Zero-State */
                <div className="py-10 text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-status-successBg text-status-success flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {todayCompleted.length > 0
                      ? "You're all done for today!"
                      : 'No tasks scheduled for today'}
                  </h3>
                  <p className="text-xs text-text-secondary max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                    {todayCompleted.length > 0
                      ? 'Take a breather, recharge, or explore upcoming items to get ahead.'
                      : 'Enjoy the breathing room or quickly schedule items whenever you are ready.'}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openAddTask({ dueDate: new Date().toISOString() })}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Schedule Task
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Recently Completed Accordion */}
          {todayCompleted.length > 0 && (
            <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
              <button
                type="button"
                onClick={() => setShowCompleted(!showCompleted)}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-surface-subtle/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span className="text-xs font-semibold text-text-primary">
                    Completed Today ({todayCompleted.length})
                  </span>
                </div>
                {showCompleted ? (
                  <ChevronUp className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                )}
              </button>

              {showCompleted && (
                <div className="p-3 pt-0 border-t border-border/50 space-y-2">
                  {todayCompleted.map((task) => (
                    <TaskRow key={task._id} task={task} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Context, Focus & Deadlines */}
        <div className="space-y-6">
          {/* Priority Focus */}
          <div className="bg-surface rounded-xl border border-border p-4 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Priority Focus
                </h2>
              </div>
              <span className="text-[11px] font-medium text-text-muted">
                {priorityFocus.length} urgent/high
              </span>
            </div>

            {priorityFocus.length > 0 ? (
              <div className="space-y-2">
                {priorityFocus.slice(0, 4).map((task) => (
                  <div
                    key={task._id}
                    onClick={() => setSelectedTask(task)}
                    className="p-2.5 rounded-lg border border-border/80 hover:border-primary/40 bg-surface-subtle/40 hover:bg-surface transition-all cursor-pointer flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={cn(
                            'text-[9px] font-semibold px-1.5 py-0.5 rounded tracking-wide uppercase',
                            task.priority === 'URGENT'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
                          )}
                        >
                          {task.priority}
                        </span>
                        {task.project?.name && (
                          <span className="text-[10px] text-text-muted truncate">
                            &bull; {task.project.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-text-primary truncate">
                        {task.title}
                      </p>
                    </div>

                    {task.dueDate && (
                      <span className="text-[10px] font-mono text-text-muted shrink-0">
                        {new Date(task.dueDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-secondary py-3 text-center">
                No high-priority tasks pending.
              </p>
            )}
          </div>

          {/* Upcoming Deadlines (Next 7 Days) */}
          <div className="bg-surface rounded-xl border border-border p-4 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-text-muted" />
                <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Upcoming Horizon
                </h2>
              </div>
              <span className="text-[11px] font-medium text-text-muted">
                {upcomingTasks.length} in 7 days
              </span>
            </div>

            {upcomingTasks.length > 0 ? (
              <div className="space-y-2">
                {upcomingTasks.slice(0, 5).map((task) => (
                  <div
                    key={task._id}
                    onClick={() => setSelectedTask(task)}
                    className="p-2.5 rounded-lg border border-border/80 hover:border-primary/40 bg-surface-subtle/30 hover:bg-surface transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-text-primary truncate">
                        {task.title}
                      </p>
                      {task.project?.name && (
                        <p className="text-[10px] text-text-muted truncate mt-0.5">
                          {task.project.name}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface-subtle border border-border text-text-secondary shrink-0">
                      {formatRelativeDate(task.dueDate)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-secondary py-3 text-center">
                Nothing due in the next 7 days.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
