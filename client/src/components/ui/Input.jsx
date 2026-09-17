import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      className,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-text-primary flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-status-danger ml-0.5">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-text-muted pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              'w-full bg-surface text-text-primary text-xs rounded-lg border border-border px-3 py-2 transition-all placeholder:text-text-muted',
              'focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary',
              'disabled:opacity-50 disabled:bg-surface-subtle disabled:cursor-not-allowed',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-status-danger focus:ring-status-danger focus:border-status-danger',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 text-text-muted pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';
