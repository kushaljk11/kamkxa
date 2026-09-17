import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export const TaskCheckbox = ({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  className,
  ariaLabel = 'Toggle task completion',
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && onChange) {
        onChange(!checked);
      }
    }
  };

  return (
    <div
      role="checkbox"
      tabIndex={disabled ? -1 : 0}
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'rounded-full border flex items-center justify-center transition-all duration-150 cursor-pointer select-none shrink-0',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1',
        checked
          ? 'bg-status-success border-status-success text-white shadow-subtle'
          : 'border-slate-300 dark:border-border/80 bg-surface hover:border-primary',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        sizeClasses[size] || sizeClasses.md,
        className
      )}
    >
      <Check
        className={cn(
          'transition-all duration-150 stroke-[3]',
          iconSizes[size] || iconSizes.md,
          checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        )}
      />
    </div>
  );
};
