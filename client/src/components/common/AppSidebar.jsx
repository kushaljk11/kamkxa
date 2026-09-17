import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sun,
  CheckSquare,
  Inbox,
  Calendar,
  FolderKanban,
  LayoutGrid,
  BarChart3,
  Bell,
  Settings,
  CheckCircle2,
  X,
  PanelLeftClose,
  PanelLeft,
  LogOut,
} from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/utils/cn';

const MAIN_LINKS = [
  { name: 'My Day', path: '/my-day', icon: Sun },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Inbox', path: '/inbox', icon: Inbox },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
];

const WORKSPACE_LINKS = [
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Board', path: '/board', icon: LayoutGrid },
];

const INSIGHTS_LINKS = [
  { name: 'Productivity', path: '/productivity', icon: BarChart3 },
];

const BOTTOM_LINKS = [
  { name: 'Notifications', path: '/notifications', icon: Bell, badge: 3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const AppSidebar = () => {
  const {
    sidebarCollapsed,
    toggleSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useUiStore();
  const { user, logout } = useAuthStore();

  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Kushal';
  const displayEmail = user?.email || 'kushal@gotaskmanager.app';
  const initial = (user?.firstName || 'K')[0].toUpperCase();

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const content = (
      <NavLink
        to={item.path}
        onClick={() => setMobileSidebarOpen(false)}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150 relative group',
            isActive
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover',
            sidebarCollapsed && 'justify-center px-0 w-10 h-10 mx-auto'
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={cn(
                'w-4 h-4 shrink-0 transition-transform group-hover:scale-105',
                isActive ? 'text-primary' : 'text-text-secondary'
              )}
            />
            {!sidebarCollapsed && (
              <span className="flex-1 truncate">{item.name}</span>
            )}
            {!sidebarCollapsed && item.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-primary/10 text-primary">
                {item.badge}
              </span>
            )}
            {sidebarCollapsed && item.badge && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            )}
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
            )}
          </>
        )}
      </NavLink>
    );

    if (sidebarCollapsed) {
      return (
        <li key={item.path}>
          <Tooltip content={item.name} position="right">
            {content}
          </Tooltip>
        </li>
      );
    }

    return <li key={item.path}>{content}</li>;
  };

  const renderNavGroup = (title, items) => (
    <div className={cn('mb-5', sidebarCollapsed && 'mb-4')}>
      {title && !sidebarCollapsed && (
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
          {title}
        </p>
      )}
      <ul className="space-y-1">{items.map(renderNavItem)}</ul>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen bg-surface border-r border-border flex flex-col justify-between transition-all duration-200 ease-in-out',
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-64',
          mobileSidebarOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Header / Logo */}
        <div>
          <div
            className={cn(
              'flex items-center justify-between px-4 h-16 border-b border-border',
              sidebarCollapsed && 'justify-center px-0'
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-subtle shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-semibold text-base text-text-primary tracking-tight truncate">
                  GoTaskManager
                </span>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-hover"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-3 overflow-y-auto max-h-[calc(100vh-160px)]">
            {renderNavGroup('MAIN', MAIN_LINKS)}
            {renderNavGroup('WORKSPACE', WORKSPACE_LINKS)}
            {renderNavGroup('INSIGHTS', INSIGHTS_LINKS)}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-border bg-surface shrink-0">
          {renderNavGroup(null, BOTTOM_LINKS)}

          {/* Desktop Rail Toggle Button */}
          <div className="hidden lg:block mb-2">
            <button
              onClick={toggleSidebarCollapsed}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors',
                sidebarCollapsed && 'justify-center px-0'
              )}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeft className="w-4 h-4" />
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 shrink-0" />
                  <span className="truncate">Collapse Sidebar</span>
                </>
              )}
            </button>
          </div>

          {/* User Profile / Logout Capsule */}
          <div
            className={cn(
              'flex items-center justify-between gap-2 px-2 pt-2 border-t border-border/60',
              sidebarCollapsed && 'justify-center px-0 border-t-0'
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs shrink-0"
                title={displayName}
              >
                {initial}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {displayEmail}
                  </p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-md text-text-muted hover:text-status-danger hover:bg-status-dangerBg transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
