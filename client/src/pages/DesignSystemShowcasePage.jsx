import React, { useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import { Drawer } from '@/components/ui/Drawer';
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/ui/Dropdown';
import { Tooltip } from '@/components/ui/Tooltip';
import { Skeleton, TaskSkeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { toast } from '@/components/ui/Toast';
import { useThemeStore } from '@/store/themeStore';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Share2,
  MoreVertical,
  Calendar,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const DesignSystemShowcasePage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  const handleSimulateAction = () => {
    setIsLoadingBtn(true);
    setTimeout(() => {
      setIsLoadingBtn(false);
      toast.success('Action completed', 'Your simulated request was successfully processed.');
    }, 1200);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Design System & UI Primitives"
        subtitle="Phase 2 standardized components matching GoTaskManager visual identity"
        actions={
          <Button
            variant="secondary"
            onClick={toggleTheme}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Mode: {theme.toUpperCase()}
          </Button>
        }
      />

      <div className="space-y-10">
        {/* Section: Buttons */}
        <section className="bg-surface p-6 rounded-xl border border-border shadow-card space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Buttons & Interactive Triggers</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Restrained variants, consistent heights, focus rings, and loading indicators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="danger" leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
              Danger
            </Button>
            <Button
              variant="primary"
              isLoading={isLoadingBtn}
              onClick={handleSimulateAction}
            >
              {isLoadingBtn ? 'Processing...' : 'Click to Load'}
            </Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium (Default)</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" variant="outline" aria-label="Add">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Section: Badges & Priority */}
        <section className="bg-surface p-6 rounded-xl border border-border shadow-card space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Badges & Priority Indicators</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Subtle accents that inform without dominating the layout.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PriorityBadge priority="URGENT" />
            <PriorityBadge priority="HIGH" />
            <PriorityBadge priority="MEDIUM" />
            <PriorityBadge priority="LOW" />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="success" dot>Success</Badge>
            <Badge variant="warning" dot>Warning</Badge>
            <Badge variant="danger" dot>Overdue</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        {/* Section: Form Controls */}
        <section className="bg-surface p-6 rounded-xl border border-border shadow-card space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Form Inputs & Selectors</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Accessible inputs, inline error handling, and clean typography.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Task Title"
              placeholder="e.g. Finish Versca booking flow"
              required
            />
            <Input
              label="Search Query"
              placeholder="Type to filter..."
              leftIcon={<Search className="w-3.5 h-3.5" />}
              helperText="Press Enter to search"
            />
            <Input
              label="Invalid Field Example"
              defaultValue="invalid-format-field"
              error="Please enter a valid format"
            />
            <Select label="Project" defaultValue="versca">
              <option value="versca">Versca</option>
              <option value="gonepali">GoNepali</option>
              <option value="gymudaan">Gym Udaan</option>
              <option value="fyp">College / FYP</option>
            </Select>
            <div className="sm:col-span-2">
              <Textarea
                label="Task Notes"
                placeholder="Add optional markdown or execution details..."
                rows={2}
              />
            </div>
          </div>
        </section>

        {/* Section: Overlays & Drawers (Dialog, Drawer, Confirm, Dropdown, Tooltip, Toasts) */}
        <section className="bg-surface p-6 rounded-xl border border-border shadow-card space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Overlays, Drawers & Feedback</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Modal dialogs, slide-over task drawers, context dropdowns, tooltips, and toasts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
              Open Dialog
            </Button>
            <Button variant="primary" onClick={() => setIsDrawerOpen(true)}>
              Open Right Drawer
            </Button>
            <Button variant="outline" onClick={() => setIsConfirmOpen(true)}>
              Open Confirm Modal
            </Button>

            {/* Dropdown Menu */}
            <Dropdown
              trigger={
                <Button variant="secondary" size="icon" aria-label="More options">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              }
            >
              <DropdownItem icon={<Edit2 />}>Edit Task</DropdownItem>
              <DropdownItem icon={<Share2 />}>Share Link</DropdownItem>
              <DropdownDivider />
              <DropdownItem
                danger
                icon={<Trash2 />}
                onClick={() => setIsConfirmOpen(true)}
              >
                Delete Task
              </DropdownItem>
            </Dropdown>

            {/* Tooltip */}
            <Tooltip content="Scheduled for Nepal Standard Time">
              <div className="p-2 rounded-lg border border-border bg-surface-subtle text-text-secondary cursor-help text-xs flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Hover Tooltip</span>
              </div>
            </Tooltip>
          </div>

          {/* Toast triggers */}
          <div className="pt-3 border-t border-border flex flex-wrap items-center gap-2">
            <span className="text-xs text-text-secondary font-medium mr-2">Toasts:</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success('Task Completed', 'Versca UI review marked complete.')}
            >
              Success Toast
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.error('Save Failed', 'Server connection timed out. Please retry.')}
            >
              Error Toast
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.warning('Approaching Due Date', 'FYP Proposal is due in 30 minutes.')}
            >
              Warning Toast
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info('Reminder Scheduled', 'WhatsApp reminder queued for 4:00 PM.')}
            >
              Info Toast
            </Button>
          </div>
        </section>

        {/* Section: Skeletons & Loading States */}
        <section className="bg-surface p-6 rounded-xl border border-border shadow-card space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Loading Skeletons</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Gentle shimmer feedback ensuring zero jarring layout shifts.
            </p>
          </div>

          <div className="space-y-4">
            <CardSkeleton count={2} />
            <TaskSkeleton count={2} />
          </div>
        </section>
      </div>

      {/* Modal Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Example Dialog Modal"
        description="Used for confirmations, project settings, and focused interactions."
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            This modal responds to backdrop clicks and the Escape key. Notice the clean typography, subtle border, and restrained shadow.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsDialogOpen(false);
                toast.success('Confirmed', 'Dialog action acknowledged.');
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Task Creation / Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Task Drawer Preview"
        description="Desktop slides in from right, mobile adapts smoothly"
        footer={
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsDrawerOpen(false);
                toast.success('Task Created', 'Added to My Day for today.');
              }}
            >
              Create Task
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Task Title" placeholder="What needs to be done?" required />
          <Select label="Project">
            <option>College / FYP</option>
            <option>Versca</option>
            <option>GoNepali</option>
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Due Date" type="date" />
            <Select label="Priority">
              <option>HIGH</option>
              <option>MEDIUM</option>
              <option>LOW</option>
              <option>URGENT</option>
            </Select>
          </div>
          <Textarea label="Description" placeholder="Optional notes or context..." />
        </div>
      </Drawer>

      {/* Destructive Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          toast.error('Task Deleted', 'Removed from database and cancelled reminders.');
        }}
        isDestructive
        title="Delete this task?"
        description="This task and any associated delayed reminder jobs will be permanently cancelled."
        confirmText="Delete Task"
      />
    </PageContainer>
  );
};
