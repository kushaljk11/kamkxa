import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

export const Dropdown = ({
  trigger,
  children,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-40 mt-1.5 min-w-[160px] bg-surface rounded-lg border border-border shadow-dropdown py-1',
            'animate-in fade-in-0 zoom-in-95 duration-100',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
  children,
  icon,
  onClick,
  danger = false,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors cursor-pointer',
        danger
          ? 'text-status-danger hover:bg-status-dangerBg'
          : 'text-text-primary hover:bg-surface-hover',
        className
      )}
    >
      {icon && <span className="w-3.5 h-3.5 shrink-0 text-current">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};

export const DropdownDivider = () => {
  return <div className="my-1 border-t border-border" />;
};
