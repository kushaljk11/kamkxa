import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-500 text-white text-xs font-semibold px-4 py-2 flex items-center justify-center gap-2 shadow-sm sticky top-0 z-50 animate-in slide-in-from-top-2 duration-200">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — You are disconnected. Local actions and tasks remain cached.</span>
    </div>
  );
};
