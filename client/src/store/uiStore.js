import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      mobileMoreOpen: false,
      isAddTaskOpen: false,
      isCommandPaletteOpen: false,
      addTaskPrefill: null,
      quickTaskTitle: '',

      // Sidebar collapsed toggle & setter
      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Mobile sidebar drawer
      toggleMobileSidebar: () =>
        set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

      // Mobile more menu sheet
      toggleMobileMore: () =>
        set((state) => ({ mobileMoreOpen: !state.mobileMoreOpen })),
      setMobileMoreOpen: (open) => set({ mobileMoreOpen: open }),

      // Quick add task drawer
      openAddTask: (prefill = '') => {
        if (typeof prefill === 'string') {
          set({ isAddTaskOpen: true, quickTaskTitle: prefill, addTaskPrefill: null });
        } else if (typeof prefill === 'object' && prefill !== null) {
          set({
            isAddTaskOpen: true,
            quickTaskTitle: prefill.title || '',
            addTaskPrefill: prefill,
          });
        } else {
          set({ isAddTaskOpen: true, quickTaskTitle: '', addTaskPrefill: null });
        }
      },
      closeAddTask: () =>
        set({ isAddTaskOpen: false, quickTaskTitle: '', addTaskPrefill: null }),

      isShortcutsHelpOpen: false,

      // Command palette
      openCommandPalette: () => set({ isCommandPaletteOpen: true }),
      closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
      toggleCommandPalette: () =>
        set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

      // Shortcuts cheat-sheet
      openShortcutsHelp: () => set({ isShortcutsHelpOpen: true }),
      closeShortcutsHelp: () => set({ isShortcutsHelpOpen: false }),
    }),
    {
      name: 'gotaskmanager_ui_store',
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);
