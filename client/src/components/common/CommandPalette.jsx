import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '@/store/uiStore';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { useThemeStore } from '@/store/themeStore';
import {
  Search,
  CheckCircle2,
  Calendar,
  FolderKanban,
  Inbox,
  LayoutGrid,
  TrendingUp,
  Settings,
  Plus,
  Moon,
  Sun,
  Laptop,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const CommandPalette = () => {
  const navigate = useNavigate();
  const {
    isCommandPaletteOpen,
    closeCommandPalette,
    openAddTask,
    openShortcutsHelp,
  } = useUiStore();
  const { tasks, setSelectedTask } = useTaskStore();
  const { projects, openCreateDialog } = useProjectStore();
  const { theme, toggleTheme } = useThemeStore();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Static Action & Navigation Definitions
  const staticItems = useMemo(
    () => [
      // Actions
      {
        id: 'action-new-task',
        title: 'Create New Task',
        category: 'Actions',
        icon: Plus,
        shortcut: 'C',
        run: () => {
          closeCommandPalette();
          openAddTask();
        },
      },
      {
        id: 'action-new-project',
        title: 'Create New Project',
        category: 'Actions',
        icon: FolderKanban,
        run: () => {
          closeCommandPalette();
          openCreateDialog();
        },
      },
      {
        id: 'action-toggle-theme',
        title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
        category: 'Actions',
        icon: theme === 'dark' ? Sun : Moon,
        run: () => {
          toggleTheme();
          closeCommandPalette();
        },
      },
      {
        id: 'action-shortcuts',
        title: 'Keyboard Shortcuts Cheat-Sheet',
        category: 'Actions',
        icon: HelpCircle,
        shortcut: '?',
        run: () => {
          closeCommandPalette();
          openShortcutsHelp();
        },
      },

      // Navigation
      {
        id: 'nav-my-day',
        title: 'Go to My Day',
        category: 'Navigation',
        icon: Sparkles,
        shortcut: 'G M',
        run: () => {
          closeCommandPalette();
          navigate('/my-day');
        },
      },
      {
        id: 'nav-tasks',
        title: 'Go to Tasks',
        category: 'Navigation',
        icon: CheckCircle2,
        shortcut: 'G T',
        run: () => {
          closeCommandPalette();
          navigate('/tasks');
        },
      },
      {
        id: 'nav-inbox',
        title: 'Go to Inbox',
        category: 'Navigation',
        icon: Inbox,
        shortcut: 'G I',
        run: () => {
          closeCommandPalette();
          navigate('/inbox');
        },
      },
      {
        id: 'nav-calendar',
        title: 'Go to Calendar',
        category: 'Navigation',
        icon: Calendar,
        shortcut: 'G C',
        run: () => {
          closeCommandPalette();
          navigate('/calendar');
        },
      },
      {
        id: 'nav-board',
        title: 'Go to Kanban Board',
        category: 'Navigation',
        icon: LayoutGrid,
        shortcut: 'G B',
        run: () => {
          closeCommandPalette();
          navigate('/board');
        },
      },
      {
        id: 'nav-projects',
        title: 'Go to Projects',
        category: 'Navigation',
        icon: FolderKanban,
        shortcut: 'G P',
        run: () => {
          closeCommandPalette();
          navigate('/projects');
        },
      },
      {
        id: 'nav-productivity',
        title: 'Go to Productivity Analytics',
        category: 'Navigation',
        icon: TrendingUp,
        run: () => {
          closeCommandPalette();
          navigate('/productivity');
        },
      },
      {
        id: 'nav-settings',
        title: 'Go to Settings',
        category: 'Navigation',
        icon: Settings,
        shortcut: 'G S',
        run: () => {
          closeCommandPalette();
          navigate('/settings');
        },
      },
    ],
    [
      closeCommandPalette,
      openAddTask,
      openCreateDialog,
      toggleTheme,
      theme,
      openShortcutsHelp,
      navigate,
    ]
  );

  // Dynamic Matching Items
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    // Matching static commands & pages
    const matchedStatic = staticItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );

    if (!q) return matchedStatic;

    // Matching live tasks
    const matchedTasks = tasks
      .filter((t) => t.title.toLowerCase().includes(q))
      .slice(0, 5)
      .map((t) => ({
        id: `task-${t._id}`,
        title: t.title,
        category: 'Tasks',
        icon: CheckCircle2,
        subtitle: t.status === 'COMPLETED' ? 'Completed' : t.priority,
        run: () => {
          closeCommandPalette();
          setSelectedTask(t);
        },
      }));

    // Matching live projects
    const matchedProjects = projects
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((p) => ({
        id: `proj-${p._id}`,
        title: p.name,
        category: 'Projects',
        icon: FolderKanban,
        subtitle: `${p.completionPercentage || 0}% complete`,
        run: () => {
          closeCommandPalette();
          navigate('/projects');
        },
      }));

    return [...matchedStatic, ...matchedTasks, ...matchedProjects];
  }, [search, staticItems, tasks, projects, closeCommandPalette, setSelectedTask, navigate]);

  // Keyboard navigation inside list
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredItems.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) current.run();
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCommandPalette}
        aria-hidden="true"
      />

      {/* Palette Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-xl bg-surface rounded-xl border border-border shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-surface">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search tasks or projects..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono rounded bg-surface-subtle border border-border text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[380px] overflow-y-auto p-2 space-y-1"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const IconComp = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => item.run()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-primary text-white font-medium'
                      : 'text-text-primary hover:bg-surface-subtle'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp
                      className={cn(
                        'w-4 h-4 shrink-0',
                        isSelected ? 'text-white' : 'text-text-muted'
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                    {item.subtitle && (
                      <span
                        className={cn(
                          'text-[10px] truncate',
                          isSelected ? 'text-white/80' : 'text-text-muted'
                        )}
                      >
                        &bull; {item.subtitle}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.category && !isSelected && (
                      <span className="text-[10px] text-text-muted bg-surface-subtle px-1.5 py-0.5 rounded border border-border/50">
                        {item.category}
                      </span>
                    )}
                    {item.shortcut && (
                      <kbd
                        className={cn(
                          'px-1.5 py-0.5 text-[10px] font-mono rounded border',
                          isSelected
                            ? 'bg-white/20 border-white/30 text-white'
                            : 'bg-surface-subtle border-border text-text-muted'
                        )}
                      >
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center text-text-muted text-xs">
              <p>No matching commands or tasks found</p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2 border-t border-border bg-surface-subtle/50 flex items-center justify-between text-[11px] text-text-muted">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.2 rounded bg-surface border border-border">↑</kbd>{' '}
              <kbd className="px-1 py-0.2 rounded bg-surface border border-border">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.2 rounded bg-surface border border-border">↵</kbd> Select
            </span>
          </div>
          <span>GoTaskManager Command Palette</span>
        </div>
      </div>
    </div>
  );
};
