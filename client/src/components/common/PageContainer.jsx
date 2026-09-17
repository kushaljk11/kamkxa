import React from 'react';
import { cn } from '@/utils/cn';

export const PageContainer = ({ children, className }) => {
  return (
    <div className={cn('w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10', className)}>
      {children}
    </div>
  );
};
