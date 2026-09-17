import React from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { Bell } from 'lucide-react';

export const NotificationsPage = () => {
  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Notifications</h1>
          <p className="text-xs text-text-secondary mt-1">Scheduled task reminders and alerts</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-12 text-center shadow-card">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <Bell className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">Notification Center</h3>
        <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
          All task alerts and scheduled reminders will be managed here in Phase 15.
        </p>
      </div>
    </PageContainer>
  );
};
