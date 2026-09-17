import React from 'react';
import { cn } from '@/utils/cn';

const PRIORITY_CONFIG = {
  URGENT: {
    label: 'Urgent',
    badgeClass: 'bg-status-dangerBg text-status-danger border-status-dangerBorder',
    dotClass: 'bg-status-danger',
  },
  HIGH: {
    label: 'High',
    badgeClass: 'bg-status-dangerBg/70 text-status-danger border-status-dangerBorder/60',
    dotClass: 'bg-status-danger',
  },
  MEDIUM: {
    label: 'Medium',
    badgeClass: 'bg-status-warningBg text-status-warning border-status-warningBorder',
    dotClass: 'bg-status-warning',
  },
  LOW: {
    label: 'Low',
    badgeClass: 'bg-surface-subtle text-text-secondary border-border',
    dotClass: 'bg-text-muted',
  },
};

export const PriorityBadge = ({ priority = 'MEDIUM', className, showDot = true }) => {
  const normalized = (priority || 'MEDIUM').toUpperCase();
  const config = PRIORITY_CONFIG[normalized] || PRIORITY_CONFIG.MEDIUM;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium rounded-md border tracking-wide uppercase',
        config.badgeClass,
        className
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotClass)} />
      )}
      <span>{config.label}</span>
    </span>
  );
};
