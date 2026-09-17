import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      className,
      disabled,
      required,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium text-text-primary flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-status-danger ml-0.5">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              'w-full bg-surface text-text-primary text-xs rounded-lg border border-border pl-3 pr-8 py-2 appearance-none transition-all cursor-pointer',
              'focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary',
              'disabled:opacity-50 disabled:bg-surface-subtle disabled:cursor-not-allowed',
              error && 'border-status-danger focus:ring-status-danger focus:border-status-danger',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-text-muted absolute right-3 pointer-events-none" />
        </div>

        {error && (
          <p className="text-[11px] text-status-danger font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-[11px] text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
