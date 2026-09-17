import React, { useState, useEffect, useMemo } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { TaskRow } from '@/components/tasks/TaskRow';
import { TaskBoardView } from '@/components/tasks/TaskBoardView';
import { TaskSkeleton } from '@/components/ui/Skeleton';
import { useUiStore } from '@/store/uiStore';
import { useTaskStore } from '@/store/taskStore';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  List,
  LayoutGrid,
  CheckCircle2,
  X,
  Clock,
  AlertCircle,
  CalendarDays,
  Flame,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const TABS = ['All', 'Today', 'Upcoming', 'Overdue', 'Completed'];

const PRIORITY_ORDER = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export const TasksPage = () => {
  const { openAddTask } = useUiStore();
  const { tasks, isLoading, fetchTasks } = useTaskStore();

  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate-asc');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

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
    return d > todayEnd;
  };

  // Tab counts for badge display
  const tabCounts = useMemo(() => {
    return {
      All: tasks.length,
      Today: tasks.filter(
        (t) => t.status !== 'COMPLETED' && (isDateToday(t.dueDate) || !t.dueDate)
      ).length,
      Upcoming: tasks.filter((t) => isDateUpcoming(t.dueDate, t.status)).length,
      Overdue: tasks.filter((t) => isDateOverdue(t.dueDate, t.status)).length,
      Completed: tasks.filter((t) => t.status === 'COMPLETED').length,
    };
  }, [tasks]);

  // Filter and sort tasks
  const processedTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      // Search filter
      if (debouncedQuery.trim()) {
        const q = debouncedQuery.toLowerCase();
        const match =
          task.title.toLowerCase().includes(q) ||
          (task.description && task.description.toLowerCase().includes(q)) ||
          (task.tags && task.tags.some((t) => t.toLowerCase().includes(q)));
        if (!match) return false;
      }

      // Priority filter
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) {
        return false;
      }

      // Tab filter
      if (activeTab === 'Completed') return task.status === 'COMPLETED';
      if (activeTab === 'Today') {
        return (
          task.status !== 'COMPLETED' &&
          (isDateToday(task.dueDate) || !task.dueDate)
        );
      }
      if (activeTab === 'Upcoming') {
        return isDateUpcoming(task.dueDate, task.status);
      }
      if (activeTab === 'Overdue') {
        return isDateOverdue(task.dueDate, task.status);
      }
      return true; // 'All'
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'dueDate-asc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'dueDate-desc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
      }
      if (sortBy === 'priority-desc') {
        return (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0);
      }
      if (sortBy === 'priority-asc') {
        return (PRIORITY_ORDER[a.priority] || 0) - (PRIORITY_ORDER[b.priority] || 0);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'createdAt-desc') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    return result;
  }, [tasks, activeTab, debouncedQuery, priorityFilter, sortBy]);

  // Tab empty states configuration
  const getEmptyStateDetails = () => {
    if (debouncedQuery.trim()) {
      return {
        icon: Search,
        title: 'No matching tasks',
        desc: `No tasks found matching "${debouncedQuery}". Try a different keyword or clear search.`,
      };
    }
    if (priorityFilter !== 'ALL') {
      return {
        icon: Flame,
        title: `No ${priorityFilter.toLowerCase()} priority tasks`,
        desc: 'Try clearing the priority filter to view all work.',
      };
    }
    switch (activeTab) {
      case 'Overdue':
        return {
          icon: CheckCircle2,
          title: "You're all caught up!",
          desc: 'No overdue tasks found. Everything is well on schedule.',
        };
      case 'Today':
        return {
          icon: Clock,
          title: 'Nothing due today',
          desc: 'Enjoy the breather, or schedule high-priority work for today.',
        };
      case 'Upcoming':
        return {
          icon: CalendarDays,
          title: 'No upcoming deadlines',
          desc: 'No items are scheduled for the next 7 days.',
        };
      case 'Completed':
        return {
          icon: CheckCircle2,
          title: 'No completed tasks yet',
          desc: 'Mark tasks complete to track your daily progress here.',
        };
      default:
        return {
          icon: CheckCircle2,
          title: 'No tasks found',
          desc: 'Get started by creating your first task in under 10 seconds.',
        };
    }
  };

  const emptyInfo = getEmptyStateDetails();
  const EmptyIcon = emptyInfo.icon;

  return (
    <PageContainer>
      <PageHeader
        title="Tasks"
        subtitle="Manage, filter, and track all scheduled work"
        actions={
          <Button
            variant="primary"
            onClick={() => openAddTask()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Task
          </Button>
        }
      />

      {/* Tabs Row */}
      <div className="flex items-center justify-between border-b border-border mb-5 overflow-x-auto pb-px">
        <div className="flex items-center gap-1 sm:gap-2">
          {TABS.map((tab) => {
            const count = tabCounts[tab] || 0;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5',
                  activeTab === tab
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                <span>{tab}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                    activeTab === tab
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'bg-surface-subtle text-text-muted'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle (List / Board) */}
        <div className="hidden sm:flex items-center gap-1 bg-surface-subtle p-1 rounded-lg border border-border shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-1.5 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer',
              viewMode === 'list'
                ? 'bg-surface text-text-primary shadow-subtle font-medium'
                : 'text-text-muted hover:text-text-primary'
            )}
            title="List view"
          >
            <List className="w-3.5 h-3.5" />
            <span className="text-[11px]">List</span>
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={cn(
              'p-1.5 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer',
              viewMode === 'board'
                ? 'bg-surface text-text-primary shadow-subtle font-medium'
                : 'text-text-muted hover:text-text-primary'
            )}
            title="Board view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="text-[11px]">Board</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        {/* Search input with clear button */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks, descriptions, tags..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 relative flex-wrap">
          {/* Priority Filter Dropdown */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Filter className="w-3.5 h-3.5" />}
              onClick={() => {
                setShowFilterMenu(!showFilterMenu);
                setShowSortMenu(false);
              }}
              className={cn(priorityFilter !== 'ALL' && 'border-primary text-primary')}
            >
              {priorityFilter === 'ALL' ? 'Priority' : priorityFilter}
            </Button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-surface border border-border rounded-lg shadow-elevation z-20 py-1 text-xs">
                {['ALL', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPriorityFilter(p);
                      setShowFilterMenu(false);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-1.5 hover:bg-surface-subtle transition-colors flex items-center justify-between',
                      priorityFilter === p ? 'text-primary font-semibold' : 'text-text-primary'
                    )}
                  >
                    <span>{p === 'ALL' ? 'All Priorities' : p}</span>
                    {priorityFilter === p && <span className="text-primary text-xs">&bull;</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ArrowUpDown className="w-3.5 h-3.5" />}
              onClick={() => {
                setShowSortMenu(!showSortMenu);
                setShowFilterMenu(false);
              }}
            >
              Sort
            </Button>

            {showSortMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-surface border border-border rounded-lg shadow-elevation z-20 py-1 text-xs">
                {[
                  { id: 'dueDate-asc', label: 'Due Date (Earliest)' },
                  { id: 'dueDate-desc', label: 'Due Date (Latest)' },
                  { id: 'priority-desc', label: 'Priority (High to Low)' },
                  { id: 'priority-asc', label: 'Priority (Low to High)' },
                  { id: 'title-asc', label: 'Title (A-Z)' },
                  { id: 'createdAt-desc', label: 'Recently Created' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSortBy(s.id);
                      setShowSortMenu(false);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-1.5 hover:bg-surface-subtle transition-colors flex items-center justify-between',
                      sortBy === s.id ? 'text-primary font-semibold' : 'text-text-primary'
                    )}
                  >
                    <span>{s.label}</span>
                    {sortBy === s.id && <span className="text-primary text-xs">&bull;</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Content: List or Board */}
      {isLoading && tasks.length === 0 ? (
        <div className="space-y-2">
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
        </div>
      ) : processedTasks.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center shadow-card">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <EmptyIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            {emptyInfo.title}
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4 leading-relaxed">
            {emptyInfo.desc}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (debouncedQuery || priorityFilter !== 'ALL') {
                setSearchInput('');
                setPriorityFilter('ALL');
              } else {
                openAddTask();
              }
            }}
          >
            {debouncedQuery || priorityFilter !== 'ALL'
              ? 'Clear Filters'
              : 'Add New Task'}
          </Button>
        </div>
      ) : viewMode === 'board' ? (
        <TaskBoardView tasks={processedTasks} />
      ) : (
        <div className="space-y-2">
          {processedTasks.map((task) => (
            <TaskRow key={task._id} task={task} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
