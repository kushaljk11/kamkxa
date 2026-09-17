import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/common/AppSidebar';
import { TopHeader } from '@/components/common/TopHeader';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { MobileMoreDrawer } from '@/components/common/MobileMoreDrawer';
import { CreateTaskDrawer } from '@/components/tasks/CreateTaskDrawer';
import { TaskDetailsDrawer } from '@/components/tasks/TaskDetailsDrawer';
import { CommandPalette } from '@/components/common/CommandPalette';
import { ShortcutsHelpDialog } from '@/components/common/ShortcutsHelpDialog';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { PwaInstallBanner } from '@/components/common/PwaInstallBanner';
import { useGlobalKeyboardShortcuts } from '@/hooks/useGlobalKeyboardShortcuts';
import { ToastContainer } from '@/components/ui/Toast';

export const AppLayout = () => {
  // Global keyboard shortcuts engine (Cmd+K, C, ?, Esc, G chords)
  useGlobalKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors">
      {/* Offline connectivity warning banner */}
      <OfflineBanner />

      <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        {/* Sidebar for desktop and tablet */}
        <AppSidebar />

        {/* Main content wrapper */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopHeader />

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Fixed bottom navigation for mobile */}
      <MobileBottomNav />

      {/* Slide-over menu for mobile secondary routes */}
      <MobileMoreDrawer />

      {/* Global Task Creation & Details Drawers */}
      <CreateTaskDrawer />
      <TaskDetailsDrawer />

      {/* Global Command Palette & Shortcuts Help */}
      <CommandPalette />
      <ShortcutsHelpDialog />

      {/* PWA Install Banner */}
      <PwaInstallBanner />

      {/* Global Toast notifications container */}
      <ToastContainer />
    </div>
  );
};
