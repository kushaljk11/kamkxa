import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Plus,
  Bell,
  Moon,
  Sun,
  PanelLeft,
  PanelLeftClose,
  CornerDownLeft,
  Search,
  Command,
} from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useThemeStore } from '@/store/themeStore';
import { checkHealth } from '@/services/api';
import { Tooltip } from '@/components/ui/Tooltip';

export const TopHeader = () => {
  const navigate = useNavigate();
  const {
    sidebarCollapsed,
    toggleSidebarCollapsed,
    toggleMobileMore,
    openAddTask,
    openCommandPalette,
  } = useUiStore();
  const { theme, toggleTheme } = useThemeStore();
  const [quickTitle, setQuickTitle] = useState('');
  const [serverStatus, setServerStatus] = useState({
    checked: false,
    online: false,
    db: 'unknown',
  });

  useEffect(() => {
    let isMounted = true;
    const verifyApi = async () => {
      try {
        const data = await checkHealth();
        if (isMounted) {
          setServerStatus({
            checked: true,
            online: data.status === 'ok',
            db: data.database || 'unknown',
          });
        }
      } catch (err) {
        if (isMounted) {
          setServerStatus({
            checked: true,
            online: false,
            db: 'disconnected',
          });
        }
      }
    };

    verifyApi();
    const interval = setInterval(verifyApi, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleQuickCaptureSubmit = (e) => {
    if (e.key === 'Enter' && quickTitle.trim()) {
      openAddTask(quickTitle.trim());
      setQuickTitle('');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/90 backdrop-blur-md border-b border-border px-4 lg:px-6 flex items-center justify-between transition-colors">
      {/* Left section: Sidebar toggle / Mobile menu & Quick capture */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {/* Mobile menu trigger */}
        <button
          onClick={toggleMobileMore}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop / Tablet rail collapse trigger */}
        <button
          onClick={toggleSidebarCollapsed}
          className="hidden lg:flex p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        {/* Quick Task Capture Input */}
        <div className="relative w-full hidden sm:block">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            onKeyDown={handleQuickCaptureSubmit}
            placeholder="Quick capture: type task & press Enter..."
            className="w-full pl-3.5 pr-14 py-1.5 text-xs bg-background border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-text-muted">
            <span className="font-mono bg-surface px-1 py-0.2 rounded border border-border">
              ↵
            </span>
          </div>
        </div>

        {/* Command Palette Trigger Button */}
        <button
          type="button"
          onClick={openCommandPalette}
          className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-background hover:bg-surface-subtle text-text-secondary hover:text-text-primary transition-colors text-xs shrink-0 cursor-pointer"
          title="Open Command Palette (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-[11px] font-medium hidden lg:inline">Search...</span>
          <kbd className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-surface border border-border text-text-muted">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right section: System status, Theme toggle, Notifications, Add Task */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Backend & DB Health Indicator */}
        <Tooltip
          content={`Backend: ${
            serverStatus.online ? 'Online' : 'Offline'
          } • DB: ${serverStatus.db}`}
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-border bg-background cursor-help">
            <span
              className={`w-2 h-2 rounded-full ${
                serverStatus.online
                  ? serverStatus.db === 'connected'
                    ? 'bg-status-success animate-pulse'
                    : 'bg-status-warning'
                  : 'bg-status-danger'
              }`}
            />
            <span className="text-text-secondary hidden md:inline">
              {serverStatus.online
                ? serverStatus.db === 'connected'
                  ? 'System Ready'
                  : 'DB Pending'
                : 'Connecting...'}
            </span>
          </div>
        </Tooltip>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Notifications button */}
        <button
          onClick={() => navigate('/notifications')}
          aria-label="Notifications"
          className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-surface" />
        </button>

        {/* Primary Add Task Button */}
        <button
          onClick={() => openAddTask()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-subtle transition-colors duration-150"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
};
