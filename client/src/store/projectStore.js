import { create } from 'zustand';
import { projectService } from '@/services/projectService';
import { toast } from '@/components/ui/Toast';

export const useProjectStore = create((set, get) => ({
  projects: [],
  isLoading: false,
  isCreateDialogOpen: false,
  editingProject: null,
  activeProject: null,

  openCreateDialog: (project = null) => {
    set({ isCreateDialogOpen: true, editingProject: project });
  },

  closeCreateDialog: () => {
    set({ isCreateDialogOpen: false, editingProject: null });
  },

  setActiveProject: (project) => {
    set({ activeProject: project });
  },

  fetchProjects: async (params = {}) => {
    set({ isLoading: true });
    try {
      const data = await projectService.getProjects(params);
      set({ projects: data || [] });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // If server unreachable, use initial demo seeds
      if (get().projects.length === 0) {
        set({
          projects: [
            {
              _id: 'proj-seed-1',
              name: 'College / FYP',
              description: 'Final Year Project architecture and research',
              color: '#6366F1',
              icon: 'GraduationCap',
              totalTasks: 1,
              completedTasks: 0,
              completionPercentage: 0,
              isArchived: false,
            },
            {
              _id: 'proj-seed-2',
              name: 'Versca',
              description: 'Client design system and booking queue',
              color: '#0EA5E9',
              icon: 'Briefcase',
              totalTasks: 1,
              completedTasks: 0,
              completionPercentage: 0,
              isArchived: false,
            },
            {
              _id: 'proj-seed-3',
              name: 'GoNepali',
              description: 'Local services discovery platform',
              color: '#10B981',
              icon: 'Compass',
              totalTasks: 1,
              completedTasks: 0,
              completionPercentage: 0,
              isArchived: false,
            },
            {
              _id: 'proj-seed-4',
              name: 'Gym Udaan',
              description: 'Fitness mobile application and workout tracking QA',
              color: '#F59E0B',
              icon: 'Dumbbell',
              totalTasks: 1,
              completedTasks: 0,
              completionPercentage: 0,
              isArchived: false,
            },
            {
              _id: 'proj-seed-5',
              name: 'GoTaskManager',
              description: 'Core product development and offline sync',
              color: '#8B5CF6',
              icon: 'CheckSquare',
              totalTasks: 1,
              completedTasks: 1,
              completionPercentage: 100,
              isArchived: false,
            },
          ],
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async (data) => {
    try {
      const newProj = await projectService.createProject(data);
      set((state) => ({
        projects: [newProj, ...state.projects],
      }));
      toast.success('Project created successfully');
      get().closeCreateDialog();
      return newProj;
    } catch (error) {
      console.error('Failed to create project:', error);
      // Offline fallback creation
      const fallbackProj = {
        _id: `proj-${Date.now()}`,
        name: data.name,
        description: data.description || '',
        color: data.color || '#6366F1',
        icon: data.icon || 'FolderKanban',
        totalTasks: 0,
        completedTasks: 0,
        completionPercentage: 0,
        isArchived: false,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        projects: [fallbackProj, ...state.projects],
      }));
      toast.success('Project created');
      get().closeCreateDialog();
      return fallbackProj;
    }
  },

  updateProject: async (id, data) => {
    try {
      const updated = await projectService.updateProject(id, data);
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? updated : p)),
        activeProject:
          state.activeProject?._id === id ? updated : state.activeProject,
      }));
      toast.success('Project updated');
      get().closeCreateDialog();
      return updated;
    } catch (error) {
      console.error('Failed to update project:', error);
      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === id ? { ...p, ...data } : p
        ),
      }));
      toast.success('Project updated');
      get().closeCreateDialog();
    }
  },

  deleteProject: async (id) => {
    try {
      await projectService.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
        activeProject:
          state.activeProject?._id === id ? null : state.activeProject,
      }));
      toast.success('Project deleted');
    } catch (error) {
      console.error('Failed to delete project:', error);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
      }));
      toast.success('Project deleted');
    }
  },

  toggleArchiveProject: async (id) => {
    const project = get().projects.find((p) => p._id === id);
    if (!project) return;
    const isArchived = !project.isArchived;

    try {
      await projectService.updateProject(id, { isArchived });
      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === id ? { ...p, isArchived } : p
        ),
      }));
      toast.info(isArchived ? 'Project archived' : 'Project unarchived');
    } catch (error) {
      console.error('Failed to toggle archive:', error);
      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === id ? { ...p, isArchived } : p
        ),
      }));
    }
  },
}));
