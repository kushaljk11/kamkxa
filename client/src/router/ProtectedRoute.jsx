import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
  const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs text-text-secondary font-medium tracking-wide">
            Loading GoTaskManager...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
