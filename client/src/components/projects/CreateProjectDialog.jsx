import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useProjectStore } from '@/store/projectStore';
import {
  FolderKanban,
  Briefcase,
  GraduationCap,
  Compass,
  Dumbbell,
  Sparkles,
  Rocket,
  Heart,
  Check,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const COLOR_PRESETS = [
  { hex: '#6366F1', label: 'Indigo' },
  { hex: '#0EA5E9', label: 'Sky' },
  { hex: '#10B981', label: 'Emerald' },
  { hex: '#F59E0B', label: 'Amber' },
  { hex: '#F43F5E', label: 'Rose' },
  { hex: '#8B5CF6', label: 'Purple' },
  { hex: '#14B8A6', label: 'Teal' },
  { hex: '#64748B', label: 'Slate' },
];

const ICON_PRESETS = [
  { name: 'FolderKanban', icon: FolderKanban },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Compass', icon: Compass },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Rocket', icon: Rocket },
  { name: 'Heart', icon: Heart },
];

export const CreateProjectDialog = () => {
  const {
    isCreateDialogOpen,
    closeCreateDialog,
    createProject,
    updateProject,
    editingProject,
  } = useProjectStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366F1');
  const [icon, setIcon] = useState('FolderKanban');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name || '');
      setDescription(editingProject.description || '');
      setColor(editingProject.color || '#6366F1');
      setIcon(editingProject.icon || 'FolderKanban');
    } else {
      setName('');
      setDescription('');
      setColor('#6366F1');
      setIcon('FolderKanban');
    }
  }, [editingProject, isCreateDialogOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (editingProject) {
        await updateProject(editingProject._id, {
          name: name.trim(),
          description: description.trim(),
          color,
          icon,
        });
      } else {
        await createProject({
          name: name.trim(),
          description: description.trim(),
          color,
          icon,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isCreateDialogOpen}
      onClose={closeCreateDialog}
      title={editingProject ? 'Edit Project' : 'Create New Project'}
      description="Organize your tasks into structured, focused workspaces"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Project Name */}
        <div>
          <label className="text-xs font-semibold text-text-primary block mb-1.5">
            Project Name <span className="text-status-danger">*</span>
          </label>
          <Input
            placeholder="e.g. Versca Redesign, Final Year Project..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-text-primary block mb-1.5">
            Description
          </label>
          <Textarea
            placeholder="Brief purpose, objectives, or scope..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        {/* Color Presets */}
        <div>
          <label className="text-xs font-semibold text-text-primary block mb-1.5">
            Accent Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {COLOR_PRESETS.map((c) => (
              <button
                type="button"
                key={c.hex}
                onClick={() => setColor(c.hex)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer relative"
                style={{ backgroundColor: c.hex }}
                title={c.label}
              >
                {color === c.hex && (
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Presets */}
        <div>
          <label className="text-xs font-semibold text-text-primary block mb-1.5">
            Icon Identifier
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ICON_PRESETS.map((item) => {
              const IconComp = item.icon;
              const isSelected = icon === item.name;
              return (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setIcon(item.name)}
                  className={cn(
                    'p-2 rounded-lg border text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                  )}
                >
                  <IconComp className="w-4 h-4" />
                  <span className="text-[10px] truncate max-w-full">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={closeCreateDialog}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!name.trim() || isSubmitting}
          >
            {editingProject ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
