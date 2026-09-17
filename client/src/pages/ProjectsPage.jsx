import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { useProjectStore } from '@/store/projectStore';
import { useUiStore } from '@/store/uiStore';
import {
  FolderKanban,
  Briefcase,
  GraduationCap,
  Compass,
  Dumbbell,
  Sparkles,
  Rocket,
  Heart,
  Plus,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  Edit2,
  Search,
  CheckSquare,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const ICON_MAP = {
  FolderKanban,
  Briefcase,
  GraduationCap,
  Compass,
  Dumbbell,
  Sparkles,
  Rocket,
  Heart,
};

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { openAddTask } = useUiStore();
  const {
    projects,
    isLoading,
    fetchProjects,
    openCreateDialog,
    deleteProject,
    toggleArchiveProject,
  } = useProjectStore();

  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const activeProjects = projects.filter((p) => !p.isArchived);
  const archivedProjects = projects.filter((p) => p.isArchived);

  const displayedProjects = (activeTab === 'active' ? activeProjects : archivedProjects).filter(
    (p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
  );

  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        subtitle="Organize related tasks, milestones, and deliverables by initiative"
        actions={
          <Button
            variant="primary"
            onClick={() => openCreateDialog()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Project
          </Button>
        }
      />

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 border-b border-border pb-px">
          <button
            onClick={() => setActiveTab('active')}
            className={cn(
              'px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5',
              activeTab === 'active'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            )}
          >
            <span>Active</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-subtle font-mono text-text-muted">
              {activeProjects.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={cn(
              'px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5',
              activeTab === 'archived'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            )}
          >
            <span>Archived</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-subtle font-mono text-text-muted">
              {archivedProjects.length}
            </span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {displayedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedProjects.map((project) => {
            const IconComponent = ICON_MAP[project.icon] || FolderKanban;
            const progress = project.completionPercentage || 0;
            const total = project.totalTasks || 0;
            const completed = project.completedTasks || 0;

            return (
              <div
                key={project._id}
                className="bg-surface p-5 rounded-xl border border-border shadow-card hover:border-slate-300 dark:hover:border-border-subtle transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Icon, Name, Options */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${project.color}15`,
                          color: project.color,
                        }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-text-primary tracking-tight truncate">
                        {project.name}
                      </h3>
                    </div>

                    <Dropdown
                      trigger={
                        <button
                          type="button"
                          className="p-1 rounded text-text-muted hover:text-text-primary opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      }
                      items={[
                        {
                          label: 'Add Task to Project',
                          icon: <Plus className="w-3.5 h-3.5" />,
                          onClick: () =>
                            openAddTask({
                              project: project._id,
                              projectName: project.name,
                            }),
                        },
                        {
                          label: 'Edit Details',
                          icon: <Edit2 className="w-3.5 h-3.5" />,
                          onClick: () => openCreateDialog(project),
                        },
                        {
                          label: project.isArchived ? 'Unarchive' : 'Archive',
                          icon: <Archive className="w-3.5 h-3.5" />,
                          onClick: () => toggleArchiveProject(project._id),
                        },
                        {
                          label: 'Delete',
                          icon: <Trash2 className="w-3.5 h-3.5" />,
                          variant: 'danger',
                          onClick: () => setProjectToDelete(project),
                        },
                      ]}
                    />
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed min-h-[32px]">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                {/* Progress & Task Metrics */}
                <div className="pt-4 border-t border-border/70">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-text-secondary font-medium text-[11px]">
                      {completed} / {total} Tasks Completed
                    </span>
                    <span className="font-bold text-text-primary text-[11px]">
                      {progress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden mb-3.5 border border-border/40">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: project.color,
                      }}
                    />
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() =>
                        openAddTask({
                          project: project._id,
                          projectName: project.name,
                        })
                      }
                      className="text-text-muted hover:text-primary transition-colors flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Task</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/tasks')}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium cursor-pointer"
                    >
                      <span>View Tasks</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-surface rounded-xl border border-border p-12 text-center shadow-card">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            {searchQuery
              ? 'No matching projects found'
              : activeTab === 'archived'
              ? 'No archived projects'
              : 'No projects yet'}
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4 leading-relaxed">
            {searchQuery
              ? 'Try changing your search keywords or clear the search filter.'
              : 'Group your tasks into projects like Work, Personal, Client Initiatives, or College.'}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (searchQuery) setSearchQuery('');
              else openCreateDialog();
            }}
          >
            {searchQuery ? 'Clear Search' : 'Create First Project'}
          </Button>
        </div>
      )}

      {/* Global Project Create/Edit Dialog */}
      <CreateProjectDialog />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onConfirm={async () => {
          if (projectToDelete) {
            await deleteProject(projectToDelete._id);
            setProjectToDelete(null);
          }
        }}
        title="Delete Project"
        description={`Are you sure you want to delete "${projectToDelete?.name}"? Tasks associated with this project will be preserved in your Inbox.`}
        confirmText="Delete Project"
        variant="danger"
      />
    </PageContainer>
  );
};
