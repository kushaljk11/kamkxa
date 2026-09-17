import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { SubtaskEditor } from './SubtaskEditor';
import { useUiStore } from '@/store/uiStore';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { toast } from '@/components/ui/Toast';
import { ChevronDown, ChevronUp, Clock, Tag, Repeat, Bell, Sparkles } from 'lucide-react';

const PRIORITY_OPTIONS = [
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Urgent', value: 'URGENT' },
  { label: 'Low', value: 'LOW' },
];

const REMINDER_PRESETS = [
  { label: 'At due time', value: '0' },
  { label: '10 minutes before', value: '10' },
  { label: '30 minutes before', value: '30' },
  { label: '1 hour before', value: '60' },
  { label: '1 day before', value: '1440' },
  { label: 'None', value: 'none' },
];

export const CreateTaskDrawer = () => {
  const { isAddTaskOpen, closeAddTask, quickTaskTitle, addTaskPrefill } = useUiStore();
  const { createTask } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();

  // Core 10-second fields
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('16:00');
  const [priority, setPriority] = useState('MEDIUM');
  const [reminder, setReminder] = useState('30');

  // Expandable "More Options" fields
  const [showMore, setShowMore] = useState(false);
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, [projects.length, fetchProjects]);

  // Sync quickTaskTitle and addTaskPrefill when drawer opens
  useEffect(() => {
    if (isAddTaskOpen) {
      if (quickTaskTitle) {
        setTitle(quickTaskTitle);
      }
      if (addTaskPrefill) {
        if (addTaskPrefill.project) setProject(addTaskPrefill.project);
        if (addTaskPrefill.priority) setPriority(addTaskPrefill.priority);
        if (addTaskPrefill.dueDate) {
          const dStr = addTaskPrefill.dueDate.split('T')[0];
          setDueDate(dStr);
        }
      } else if (!dueDate) {
        // Set default due date to today if empty
        const todayStr = new Date().toISOString().split('T')[0];
        setDueDate(todayStr);
      }
    }
  }, [isAddTaskOpen, quickTaskTitle, addTaskPrefill]);

  const resetForm = () => {
    setTitle('');
    setProject('');
    setDueDate('');
    setDueTime('16:00');
    setPriority('MEDIUM');
    setReminder('30');
    setShowMore(false);
    setDescription('');
    setSubtasks([]);
    setTags([]);
    setTagInput('');
    setEstimatedMinutes('');
    setNotes('');
  };

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.replace(',', '').trim().toLowerCase();
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title required', 'Please enter what needs to be done.');
      return;
    }

    setIsSubmitting(true);

    let combinedDueDate = null;
    if (dueDate) {
      const [year, month, day] = dueDate.split('-');
      const [hours, minutes] = dueTime ? dueTime.split(':') : ['12', '00'];
      combinedDueDate = new Date(year, parseInt(month, 10) - 1, day, hours, minutes).toISOString();
    }

    const payload = {
      title: title.trim(),
      project: project || null,
      priority,
      dueDate: combinedDueDate,
      description: description.trim(),
      subtasks: subtasks.map((s) => ({ title: s.title })),
      tags,
      estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes, 10) : null,
      notes: notes.trim(),
    };

    const res = await createTask(payload);
    setIsSubmitting(false);

    if (res.success) {
      resetForm();
      closeAddTask();
    }
  };

  // Keyboard shortcut Ctrl+Enter to submit
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Drawer
      isOpen={isAddTaskOpen}
      onClose={closeAddTask}
      title="Create New Task"
      description="Enter basic details in seconds or expand for advanced options."
      width="max-w-lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={closeAddTask}>
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] text-text-muted">
              Press <kbd className="px-1 py-0.5 rounded bg-surface border border-border font-mono">⌘↵</kbd>
            </span>
            <Button
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              Create Task
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
        {/* Core Field 1: Title (Auto-focused) */}
        <Input
          label="Task Title"
          placeholder="What do you need to accomplish?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        {/* Core Field 2: Project (Optional) */}
        <Select
          label="Project (Optional)"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        >
          <option value="">No Project (Save to Inbox)</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </Select>

        {/* Core Field 3: Due Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Input
            label="Due Time"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </div>

        {/* Core Field 4: Priority & Reminder Preset */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>

          <Select
            label="Reminder"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          >
            {REMINDER_PRESETS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Expandable "More Options" Section */}
        <div className="pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="w-full flex items-center justify-between py-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            <span>{showMore ? 'Hide advanced options' : '+ More options (Subtasks, tags, notes)'}</span>
            {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMore && (
            <div className="space-y-4 pt-3 animate-in fade-in-50 duration-200">
              {/* Description */}
              <Textarea
                label="Description"
                placeholder="Add detailed task instructions or background context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />

              {/* Subtasks */}
              <div>
                <label className="text-xs font-medium text-text-primary block mb-1.5">
                  Subtasks Checklist
                </label>
                <SubtaskEditor
                  subtasks={subtasks}
                  onChange={setSubtasks}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-medium text-text-primary block mb-1.5">
                  Tags (Press Enter or comma to add)
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-subtle border border-border text-[11px] text-text-primary"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-text-muted hover:text-status-danger ml-0.5"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="e.g. frontend, bug-fix, q4"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>

              {/* Estimated Duration */}
              <Input
                label="Estimated Duration (Minutes)"
                type="number"
                placeholder="e.g. 45"
                min="1"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
              />

              {/* Notes */}
              <Textarea
                label="Execution Notes"
                placeholder="Markdown scratchpad or follow-up notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          )}
        </div>
      </form>
    </Drawer>
  );
};
