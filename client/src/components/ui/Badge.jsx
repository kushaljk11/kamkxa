import React from 'react';
import { cn } from '@/utils/cn';

const variants = {
  default: 'bg-surface-subtle text-text-secondary border-border',
  brand: 'bg-primary-light text-primary border-primary/20',
  success: 'bg-status-successBg text-status-success border-status-successBorder',
  warning: 'bg-status-warningBg text-status-warning border-status-warningBorder',
  danger: 'bg-status-dangerBg text-status-danger border-status-dangerBorder',
  outline: 'bg-transparent text-text-secondary border-border',
};

const sizes = {
  xs: 'px-1.5 py-0.2 text-[10px] font-medium leading-tight',
  sm: 'px-2 py-0.5 text-[11px] font-medium',
  md: 'px-2.5 py-1 text-xs font-medium',
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
  dot,
  dotColor,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        variants[variant] || variants.default,
        sizes[size] || sizes.sm,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColor || 'bg-current'
          )}
        />
      )}
      {children}
    </span>
  );
};
