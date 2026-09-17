import React from 'react';
import { cn } from '@/utils/cn';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200/70 dark:bg-surface-subtle',
        className
      )}
      {...props}
    />
  );
};

export const TaskSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface/50 animate-pulse"
        >
          <div className="flex items-center gap-3 w-3/4">
            <Skeleton className="w-4 h-4 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-2.5 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface p-4 rounded-xl border border-border shadow-card flex flex-col justify-between animate-pulse h-24"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <Skeleton className="h-6 w-10 mt-3" />
        </div>
      ))}
    </div>
  );
};
