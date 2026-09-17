import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary hover:bg-primary-hover text-white shadow-subtle border border-transparent',
  secondary: 'bg-surface hover:bg-surface-hover text-text-primary border border-border shadow-subtle',
  outline: 'bg-transparent hover:bg-surface-hover text-text-primary border border-border',
  ghost: 'bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-transparent',
  danger: 'bg-status-danger hover:opacity-90 text-white shadow-subtle border border-transparent',
  subtle: 'bg-primary-light text-primary hover:opacity-90 border border-transparent',
};

const sizes = {
  xs: 'px-2 py-1 text-[11px] rounded-md gap-1',
  sm: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-3.5 py-2 text-xs font-medium rounded-lg gap-2',
  lg: 'px-4 py-2.5 text-sm font-medium rounded-lg gap-2',
  icon: 'p-2 rounded-lg aspect-square',
};

export const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]',
          variants[variant] || variants.primary,
          sizes[size] || sizes.md,
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
