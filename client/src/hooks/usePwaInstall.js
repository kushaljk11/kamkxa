import { useState, useEffect } from 'react';

export const usePwaInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('gotaskmanager_pwa_dismissed') === 'true';
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent browser default mini-infobar
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
      console.log('[GoTaskManager PWA] App was successfully installed!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
    }
    setDeferredPrompt(null);
  };

  const dismissPrompt = () => {
    setIsDismissed(true);
    localStorage.setItem('gotaskmanager_pwa_dismissed', 'true');
  };

  return {
    canInstall: canInstall && !isDismissed,
    promptInstall,
    dismissPrompt,
  };
};
