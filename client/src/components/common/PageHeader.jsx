import React from 'react';
import { cn } from '@/utils/cn';

export const PageHeader = ({
  title,
  subtitle,
  actions,
  children,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6', className)}>
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-text-secondary mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {(actions || children) && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
};
