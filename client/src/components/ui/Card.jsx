import React from 'react';
import { cn } from '@/utils/cn';

export const Card = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-surface rounded-xl border border-border shadow-card transition-all duration-150',
        hover && 'hover:border-slate-300 dark:hover:border-border/80 hover:shadow-dropdown',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={cn('p-5 pb-3 flex flex-col gap-1', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3
      className={cn('text-sm font-semibold text-text-primary tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className, ...props }) => {
  return (
    <p className={cn('text-xs text-text-secondary', className)} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={cn('p-5 pt-0', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('p-5 pt-3 border-t border-border flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  );
};
