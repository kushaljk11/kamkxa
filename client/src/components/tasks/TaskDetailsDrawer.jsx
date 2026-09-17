import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { TaskCheckbox } from './TaskCheckbox';
import { SubtaskEditor } from './SubtaskEditor';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import {
  X,
  Clock,
  Calendar,
  Tag,
  Trash2,
  CheckCircle2,
  FileText,
  Activity,
  FolderKanban,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const TaskDetailsDrawer = () => {
  const {
    selectedTask,
    isDetailsOpen,
    closeDetails,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    addSubtask,
    toggleSubtask,
  } = useTaskStore();
  const { projects } = useProjectStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [notes, setNotes] = useState('');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title || '');
      setDescription(selectedTask.description || '');
      setProject(
        selectedTask.project?._id ||
          (typeof selectedTask.project === 'string' ? selectedTask.project : '')
      );
      setStatus(selectedTask.status || 'TODO');
      setPriority(selectedTask.priority || 'MEDIUM');
      setNotes(selectedTask.notes || '');
    }
  }, [selectedTask]);

  if (!selectedTask) return null;

  const isCompleted = status === 'COMPLETED';

  const handleSave = async () => {
    setIsSaving(true);
    await updateTask(selectedTask._id, {
      title,
      description,
      project: project || null,
      status,
      priority,
      notes,
    });
    setIsSaving(false);
  };

  const handleDelete = async () => {
    await deleteTask(selectedTask._id);
    setIsConfirmDeleteOpen(false);
  };

  return (
    <>
      <Drawer
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        title="Task Details"
        width="max-w-lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsConfirmDeleteOpen(true)}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={closeDetails}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isSaving}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-5">
          {/* Status Capsule & Title header */}
          <div className="flex items-start gap-3">
            <div className="pt-1">
              <TaskCheckbox
                checked={isCompleted}
                onChange={() => toggleTaskStatus(selectedTask._id)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={cn(
                  'w-full text-base font-bold text-text-primary bg-transparent border-0 border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-colors pb-0.5',
                  isCompleted && 'line-through text-text-muted'
                )}
                placeholder="Task title..."
              />
            </div>
          </div>

          {/* Quick Properties Bar */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-subtle/60 border border-border text-xs">
            {/* Status Select */}
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Status
              </span>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="py-1"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
            </div>

            {/* Priority Select */}
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Priority
              </span>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="py-1"
              >
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </Select>
            </div>

            {/* Project Select */}
            <div className="col-span-2 pt-2 border-t border-border/60">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                Project
              </span>
              <Select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="py-1"
              >
                <option value="">No Project (Inbox)</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-text-primary flex items-center gap-1.5 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-text-muted" />
              <span>Description</span>
            </label>
            <Textarea
              placeholder="Add description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Embedded Subtasks Editor */}
          <div className="pt-2 border-t border-border">
            <SubtaskEditor
              subtasks={selectedTask.subtasks || []}
              onAddSubtask={(subtaskTitle) =>
                addSubtask(selectedTask._id, subtaskTitle)
              }
              onToggleSubtask={(subtaskId, completed) =>
                toggleSubtask(selectedTask._id, subtaskId, completed)
              }
            />
          </div>

          {/* Tags */}
          {selectedTask.tags && selectedTask.tags.length > 0 && (
            <div className="pt-2 border-t border-border">
              <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5 mb-1.5">
                <Tag className="w-3.5 h-3.5 text-text-muted" />
                <span>Tags</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedTask.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-surface-subtle border border-border text-[11px] text-text-primary font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="pt-2 border-t border-border">
            <label className="text-xs font-semibold text-text-primary block mb-1.5">
              Follow-up Notes
            </label>
            <Textarea
              placeholder="Personal scratchpad..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Activity / Timestamp Meta */}
          <div className="pt-3 border-t border-border text-[11px] text-text-muted flex items-center justify-between">
            <span>Created {new Date(selectedTask.createdAt || Date.now()).toLocaleDateString()}</span>
            {selectedTask.completedAt && (
              <span className="text-status-success font-medium">
                Done {new Date(selectedTask.completedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>
      </Drawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        isDestructive
        title="Delete this task?"
        description={`"${selectedTask.title}" and any scheduled reminder triggers will be permanently deleted.`}
        confirmText="Delete Task"
      />
    </>
  );
};
