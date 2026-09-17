import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '@/store/uiStore';
import { useTaskStore } from '@/store/taskStore';

export const useGlobalKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const {
    openAddTask,
    closeAddTask,
    isAddTaskOpen,
    openCommandPalette,
    closeCommandPalette,
    isCommandPaletteOpen,
    toggleCommandPalette,
    openShortcutsHelp,
    closeShortcutsHelp,
    isShortcutsHelpOpen,
    toggleSidebarCollapsed,
  } = useUiStore();
  const { closeDetails, isDetailsOpen } = useTaskStore();

  const chordRef = useRef({ key: null, timeoutId: null });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const isInput =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          activeElement.isContentEditable);

      // Global Escape handling (always active)
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          e.preventDefault();
          closeCommandPalette();
          return;
        }
        if (isShortcutsHelpOpen) {
          e.preventDefault();
          closeShortcutsHelp();
          return;
        }
        if (isAddTaskOpen) {
          e.preventDefault();
          closeAddTask();
          return;
        }
        if (isDetailsOpen) {
          e.preventDefault();
          closeDetails();
          return;
        }
      }

      // Command Palette (Cmd+K / Ctrl+K) - always active
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Toggle Sidebar (Cmd+B / Ctrl+B or [) - always active
      if ((e.metaKey || e.ctrlKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        toggleSidebarCollapsed();
        return;
      }

      // If user is typing in a form field, don't trigger single-key or chord shortcuts
      if (isInput) return;

      // Single Key: '[' for toggling sidebar when not in input
      if (e.key === '[' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        toggleSidebarCollapsed();
        return;
      }

      // Single Key: 'c' for new task
      if ((e.key === 'c' || e.key === 'C') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        openAddTask();
        return;
      }

      // Single Key: '?' for shortcuts help modal
      if (e.key === '?') {
        e.preventDefault();
        openShortcutsHelp();
        return;
      }

      // Two-key chord navigation: 'g' then <key>
      if ((e.key === 'g' || e.key === 'G') && !chordRef.current.key) {
        chordRef.current.key = 'g';
        if (chordRef.current.timeoutId) clearTimeout(chordRef.current.timeoutId);
        chordRef.current.timeoutId = setTimeout(() => {
          chordRef.current.key = null;
        }, 1000);
        return;
      }

      if (chordRef.current.key === 'g') {
        const targetKey = e.key.toLowerCase();
        chordRef.current.key = null;
        if (chordRef.current.timeoutId) clearTimeout(chordRef.current.timeoutId);

        switch (targetKey) {
          case 'm':
            e.preventDefault();
            navigate('/my-day');
            break;
          case 't':
            e.preventDefault();
            navigate('/tasks');
            break;
          case 'i':
            e.preventDefault();
            navigate('/inbox');
            break;
          case 'c':
            e.preventDefault();
            navigate('/calendar');
            break;
          case 'p':
            e.preventDefault();
            navigate('/projects');
            break;
          case 'b':
            e.preventDefault();
            navigate('/board');
            break;
          case 's':
            e.preventDefault();
            navigate('/settings');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (chordRef.current.timeoutId) clearTimeout(chordRef.current.timeoutId);
    };
  }, [
    navigate,
    openAddTask,
    closeAddTask,
    isAddTaskOpen,
    openCommandPalette,
    closeCommandPalette,
    isCommandPaletteOpen,
    toggleCommandPalette,
    openShortcutsHelp,
    closeShortcutsHelp,
    isShortcutsHelpOpen,
    closeDetails,
    isDetailsOpen,
    toggleSidebarCollapsed,
  ]);
};
