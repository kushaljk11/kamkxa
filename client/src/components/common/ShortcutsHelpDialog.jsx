import React from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { useUiStore } from '@/store/uiStore';
import { Keyboard } from 'lucide-react';

const SHORTCUT_GROUPS = [
  {
    title: 'Navigation Chords',
    items: [
      { keys: ['G', 'M'], desc: 'Go to My Day' },
      { keys: ['G', 'T'], desc: 'Go to Tasks' },
      { keys: ['G', 'I'], desc: 'Go to Inbox' },
      { keys: ['G', 'C'], desc: 'Go to Calendar' },
      { keys: ['G', 'B'], desc: 'Go to Board' },
      { keys: ['G', 'P'], desc: 'Go to Projects' },
      { keys: ['G', 'S'], desc: 'Go to Settings' },
    ],
  },
  {
    title: 'Global Actions',
    items: [
      { keys: ['C'], desc: 'Create New Task' },
      { keys: ['⌘', 'K'], desc: 'Open Command Palette' },
      { keys: ['⌘', 'B'], desc: 'Toggle Sidebar Collapse' },
      { keys: ['?'], desc: 'Open Shortcuts Cheat-Sheet' },
      { keys: ['ESC'], desc: 'Close any active drawer or modal' },
    ],
  },
  {
    title: 'Inside Task Drawers',
    items: [
      { keys: ['⌘', '↵'], desc: 'Submit and save task' },
      { keys: ['Enter'], desc: 'Add subtask in checklist' },
    ],
  },
];

export const ShortcutsHelpDialog = () => {
  const { isShortcutsHelpOpen, closeShortcutsHelp } = useUiStore();

  return (
    <Dialog
      isOpen={isShortcutsHelpOpen}
      onClose={closeShortcutsHelp}
      title="Keyboard Shortcuts"
      description="Navigate and manage tasks without touching your mouse"
      maxWidth="max-w-lg"
    >
      <div className="p-5 space-y-5">
        {SHORTCUT_GROUPS.map((group) => (
          <div key={group.title}>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5">
              {group.title}
            </h4>
            <div className="space-y-1.5">
              {group.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-surface-subtle transition-colors text-xs"
                >
                  <span className="text-text-primary">{item.desc}</span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-surface-subtle border border-border text-text-primary shadow-subtle"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Dialog>
  );
};
