import React, { useEffect, useMemo } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/ui/Card';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import {
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  FolderKanban,
  Flame,
  Award,
  Zap,
  Clock,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const ProductivityPage = () => {
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  // Real-time analytics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'COMPLETED' || !t.dueDate) return false;
    const d = new Date(t.dueDate);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return d < todayStart;
  }).length;

  const activeProjectsCount = projects.filter((p) => !p.isArchived).length;

  // Last 7 days completion velocity
  const last7DaysVelocity = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - i);
      const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = targetDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      // Count tasks completed on this date
      const count = tasks.filter((t) => {
        if (t.status !== 'COMPLETED') return false;
        const compDate = t.completedAt ? new Date(t.completedAt) : new Date(t.updatedAt);
        return (
          compDate.getDate() === targetDate.getDate() &&
          compDate.getMonth() === targetDate.getMonth() &&
          compDate.getFullYear() === targetDate.getFullYear()
        );
      }).length;

      days.push({ dayName, monthDay, count, isToday: i === 0 });
    }

    const maxCount = Math.max(...days.map((d) => d.count), 1);
    return days.map((d) => ({
      ...d,
      heightPercent: Math.max(Math.round((d.count / maxCount) * 100), 10),
    }));
  }, [tasks]);

  const totalWeeklyCompleted = last7DaysVelocity.reduce((sum, d) => sum + d.count, 0);

  // Active Streak calculation (consecutive days with completed tasks)
  const streak = useMemo(() => {
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);

      const hasCompleted = tasks.some((t) => {
        if (t.status !== 'COMPLETED') return false;
        const cDate = t.completedAt ? new Date(t.completedAt) : new Date(t.updatedAt);
        return (
          cDate.getDate() === checkDate.getDate() &&
          cDate.getMonth() === checkDate.getMonth() &&
          cDate.getFullYear() === checkDate.getFullYear()
        );
      });

      if (hasCompleted) {
        currentStreak++;
      } else if (i > 0) {
        // Break streak if not today
        break;
      }
    }
    return currentStreak;
  }, [tasks]);

  // Priority Distribution
  const priorityBreakdown = useMemo(() => {
    const counts = { URGENT: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    tasks.forEach((t) => {
      const p = t.priority || 'MEDIUM';
      if (counts[p] !== undefined) counts[p]++;
    });

    return [
      {
        priority: 'URGENT',
        label: 'Urgent',
        count: counts.URGENT,
        color: 'bg-rose-500',
        textColor: 'text-rose-600 dark:text-rose-400',
        percent: totalTasks > 0 ? Math.round((counts.URGENT / totalTasks) * 100) : 0,
      },
      {
        priority: 'HIGH',
        label: 'High',
        count: counts.HIGH,
        color: 'bg-amber-500',
        textColor: 'text-amber-600 dark:text-amber-400',
        percent: totalTasks > 0 ? Math.round((counts.HIGH / totalTasks) * 100) : 0,
      },
      {
        priority: 'MEDIUM',
        label: 'Medium',
        count: counts.MEDIUM,
        color: 'bg-primary',
        textColor: 'text-primary',
        percent: totalTasks > 0 ? Math.round((counts.MEDIUM / totalTasks) * 100) : 0,
      },
      {
        priority: 'LOW',
        label: 'Low',
        count: counts.LOW,
        color: 'bg-slate-400',
        textColor: 'text-slate-600 dark:text-slate-400',
        percent: totalTasks > 0 ? Math.round((counts.LOW / totalTasks) * 100) : 0,
      },
    ];
  }, [tasks, totalTasks]);

  // KPI Metrics
  const metrics = [
    {
      title: 'Completed Rate',
      value: `${completionRate}%`,
      subtitle: `${completedTasks} of ${totalTasks} tasks`,
      subtitleColor: 'text-status-success',
      icon: TrendingUp,
    },
    {
      title: 'Active Streak',
      value: `${streak} day${streak === 1 ? '' : 's'}`,
      subtitle: streak > 0 ? 'Daily momentum active' : 'Complete a task today',
      subtitleColor: 'text-amber-500',
      icon: Flame,
    },
    {
      title: 'Weekly Velocity',
      value: `${totalWeeklyCompleted}`,
      subtitle: 'Completed in last 7 days',
      subtitleColor: 'text-primary',
      icon: Zap,
    },
    {
      title: 'Overdue Items',
      value: `${overdueTasks}`,
      subtitle: overdueTasks > 0 ? 'Action required' : 'All schedules on track',
      subtitleColor:
        overdueTasks > 0 ? 'text-status-danger' : 'text-text-secondary',
      icon: AlertTriangle,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Productivity"
        subtitle="Meaningful metrics, completion velocity, and workload distributions"
      />

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.title} className="p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-border-subtle transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">
                  {m.title}
                </span>
                <Icon className="w-4 h-4 text-text-muted" />
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-text-primary tracking-tight">
                  {isLoading ? '...' : m.value}
                </p>
                <p className={cn('text-[11px] font-medium mt-0.5', m.subtitleColor)}>
                  {m.subtitle}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Two Column Grid: Weekly Velocity & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Chart: Completed by Day (Last 7 Days) */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Weekly Execution Velocity
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Tasks completed each day over the last 7 days
              </p>
            </div>
            <span className="text-xs font-bold text-text-primary px-2 py-0.5 rounded-full bg-surface-subtle border border-border">
              {totalWeeklyCompleted} completed
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 pb-2 border-b border-border">
            {last7DaysVelocity.map((day) => (
              <div
                key={day.dayName}
                className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
              >
                <span className="text-[10px] font-bold text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.count}
                </span>
                <div className="w-full bg-surface-subtle h-32 rounded-lg relative overflow-hidden flex items-end border border-border/50">
                  <div
                    className={cn(
                      'w-full rounded-b-md transition-all duration-500',
                      day.isToday ? 'bg-primary' : 'bg-primary/50 group-hover:bg-primary'
                    )}
                    style={{ height: `${day.heightPercent}%` }}
                  />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-semibold mt-1',
                    day.isToday ? 'text-primary font-bold' : 'text-text-secondary'
                  )}
                >
                  {day.dayName}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 flex items-center justify-between text-[11px] text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              <span>Current day highlighted</span>
            </span>
            <span>Hover bars for exact count</span>
          </div>
        </Card>

        {/* Priority Workload Distribution */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Workload by Priority
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Distribution across urgency levels
              </p>
            </div>
            <span className="text-xs font-bold text-text-primary">
              {totalTasks} total tasks
            </span>
          </div>

          <div className="space-y-4 my-auto py-2">
            {priorityBreakdown.map((item) => (
              <div key={item.priority}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={cn('font-semibold flex items-center gap-1.5', item.textColor)}>
                    <span className={cn('w-2 h-2 rounded-full', item.color)} />
                    <span>{item.label} Priority</span>
                  </span>
                  <span className="text-text-secondary font-mono text-[11px]">
                    {item.count} tasks &bull; {item.percent}%
                  </span>
                </div>
                <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden border border-border/40">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', item.color)}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border/60 text-[11px] text-text-muted flex items-center justify-between">
            <span>High & Urgent: {priorityBreakdown[0].count + priorityBreakdown[1].count} tasks</span>
            <span>Medium & Low: {priorityBreakdown[2].count + priorityBreakdown[3].count} tasks</span>
          </div>
        </Card>
      </div>

      {/* Project Progress Breakdown */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Project Workload & Progress
            </h3>
          </div>
          <span className="text-xs text-text-secondary font-medium">
            {activeProjectsCount} active workspaces
          </span>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects
              .filter((p) => !p.isArchived)
              .map((p) => {
                const percent = p.completionPercentage || 0;
                const total = p.totalTasks || 0;
                const done = p.completedTasks || 0;

                return (
                  <div
                    key={p._id}
                    className="p-3 rounded-lg border border-border bg-surface-subtle/40 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="text-xs font-bold text-text-primary truncate">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold font-mono text-text-primary shrink-0">
                        {percent}%
                      </span>
                    </div>

                    <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border/50 mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: p.color,
                        }}
                      />
                    </div>

                    <div className="text-[10px] text-text-muted flex items-center justify-between">
                      <span>
                        {done} of {total} completed
                      </span>
                      <span>{total - done} pending</span>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-xs text-text-secondary py-4 text-center">
            No active projects yet.
          </p>
        )}
      </Card>
    </PageContainer>
  );
};
