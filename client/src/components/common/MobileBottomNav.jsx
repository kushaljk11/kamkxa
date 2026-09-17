import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, CheckSquare, Plus, Calendar, FolderKanban } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/utils/cn';

export const MobileBottomNav = () => {
  const { openAddTask } = useUiStore();

  const navItems = [
    { name: 'My Day', path: '/my-day', icon: Sun },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { isAction: true, name: 'Add', action: () => openAddTask() },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-md border-t border-border lg:hidden px-3 pb-[env(safe-area-inset-bottom)] transition-colors">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item, idx) => {
          if (item.isAction) {
            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center justify-center -mt-5 bg-primary text-white w-12 h-12 rounded-full shadow-dropdown hover:bg-primary-hover active:scale-95 transition-transform"
                aria-label="Add Task"
              >
                <Plus className="w-6 h-6" />
              </button>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center min-w-[56px] h-full py-1 text-[11px] font-medium transition-colors relative',
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 mb-1 transition-transform',
                      isActive && 'scale-110'
                    )}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
