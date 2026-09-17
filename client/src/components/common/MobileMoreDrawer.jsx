import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Inbox,
  LayoutGrid,
  BarChart3,
  Bell,
  Settings,
  Moon,
  Sun,
  LogOut,
  X,
  Sparkles,
} from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils/cn';

const MORE_LINKS = [
  { name: 'Inbox', path: '/inbox', icon: Inbox, desc: 'Quick capture & unsorted' },
  { name: 'Kanban Board', path: '/board', icon: LayoutGrid, desc: 'Visual task pipeline' },
  { name: 'Productivity', path: '/productivity', icon: BarChart3, desc: 'Metrics & completion insights' },
  { name: 'Notifications', path: '/notifications', icon: Bell, desc: 'Task reminders & alerts' },
  { name: 'Settings', path: '/settings', icon: Settings, desc: 'Preferences, timezones & quiet hours' },
];

export const MobileMoreDrawer = () => {
  const { mobileMoreOpen, setMobileMoreOpen } = useUiStore();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  if (!mobileMoreOpen) return null;

  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Kushal';
  const displayEmail = user?.email || 'kushal@gotaskmanager.app';
  const initial = (user?.firstName || 'K')[0].toUpperCase();

  return (
    <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setMobileMoreOpen(false)}
      />

      {/* Slide-over sheet from bottom */}
      <div className="fixed inset-x-0 bottom-0 bg-surface rounded-t-2xl border-t border-border shadow-drawer max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-250">
        {/* Header handle & close */}
        <div className="p-4 pb-2 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">
              {initial}
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">{displayName}</p>
              <p className="text-[11px] text-text-muted">{displayEmail}</p>
            </div>
          </div>

          <button
            onClick={() => setMobileMoreOpen(false)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable destinations */}
        <div className="p-4 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2 px-2">
            More Destinations
          </p>

          {MORE_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMoreOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3.5 p-3 rounded-xl transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-primary hover:bg-surface-hover'
                  )
                }
              >
                <div className="w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{item.name}</p>
                  <p className="text-[10px] text-text-muted truncate">{item.desc}</p>
                </div>
              </NavLink>
            );
          })}

          <div className="pt-2 border-t border-border mt-3 space-y-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3 rounded-xl text-text-primary hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-text-secondary" />
                  )}
                </div>
                <span className="text-xs font-medium">Appearance</span>
              </div>
              <span className="text-xs text-text-muted capitalize">{theme}</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                setMobileMoreOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-status-danger hover:bg-status-dangerBg transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-status-dangerBg flex items-center justify-center">
                <LogOut className="w-4 h-4 text-status-danger" />
              </div>
              <span className="text-xs font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
