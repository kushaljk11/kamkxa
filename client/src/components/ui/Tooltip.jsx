import React, { useState } from 'react';
import { cn } from '@/utils/cn';

export const Tooltip = ({
  children,
  content,
  position = 'top',
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  if (!content) return children;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2 py-1 text-[10px] font-medium text-white bg-slate-900 dark:bg-slate-800 rounded shadow-sm whitespace-nowrap pointer-events-none transition-opacity animate-in fade-in-0 duration-150',
            positionClasses[position] || positionClasses.top,
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
