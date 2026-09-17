import { create } from 'zustand';
import taskService from '@/services/taskService';
import { toast } from '@/components/ui/Toast';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  pagination: { page: 1, limit: 20, total: 0, pages: 1 },
  isLoading: false,
  selectedTask: null,
  isDetailsOpen: false,

  selectTask: (task) => set({ selectedTask: task, isDetailsOpen: true }),
  closeDetails: () => set({ selectedTask: null, isDetailsOpen: false }),

  // Fetch tasks from API
  fetchTasks: async (params = {}) => {
    set({ isLoading: true });
    try {
      const res = await taskService.getTasks(params);
      set({
        tasks: res.data || [],
        pagination: res.pagination || { page: 1, limit: 20, total: res.data?.length || 0, pages: 1 },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to load tasks', error.message);
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const res = await taskService.createTask(taskData);
      const created = res.data;
      set((state) => ({
        tasks: [created, ...state.tasks],
      }));
      toast.success('Task created', `"${created.title}" added successfully.`);
      return { success: true, data: created };
    } catch (error) {
      toast.error('Could not create task', error.message);
      return { success: false, error: error.message };
    }
  },

  // Update task details
  updateTask: async (id, updates) => {
    try {
      const res = await taskService.updateTask(id, updates);
      const updated = res.data;
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? updated : t)),
        selectedTask: state.selectedTask?._id === id ? updated : state.selectedTask,
      }));
      toast.success('Task updated', 'Changes saved successfully.');
      return { success: true, data: updated };
    } catch (error) {
      toast.error('Update failed', error.message);
      return { success: false, error: error.message };
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    // Preserve task for rollback if needed
    const previousTasks = get().tasks;
    const taskToDelete = previousTasks.find((t) => t._id === id);

    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== id),
      selectedTask: state.selectedTask?._id === id ? null : state.selectedTask,
      isDetailsOpen: state.selectedTask?._id === id ? false : state.isDetailsOpen,
    }));

    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted', `"${taskToDelete?.title || 'Task'}" removed.`);
      return { success: true };
    } catch (error) {
      // Rollback on failure
      set({ tasks: previousTasks });
      toast.error('Could not delete task', error.message);
      return { success: false, error: error.message };
    }
  },

  // Optimistic status toggle (checkbox click or Kanban drop)
  toggleTaskStatus: async (id) => {
    const currentTasks = get().tasks;
    const targetTask = currentTasks.find((t) => t._id === id);
    if (!targetTask) return;

    const isCurrentlyCompleted = targetTask.status === 'COMPLETED';
    const nextStatus = isCurrentlyCompleted ? 'TODO' : 'COMPLETED';
    const nextCompletedAt = nextStatus === 'COMPLETED' ? new Date().toISOString() : null;

    // 1. Optimistically update local state immediately
    const updatedTask = {
      ...targetTask,
      status: nextStatus,
      completedAt: nextCompletedAt,
    };

    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? updatedTask : t)),
      selectedTask: state.selectedTask?._id === id ? updatedTask : state.selectedTask,
    }));

    if (nextStatus === 'COMPLETED') {
      toast.success('Task completed', `"${targetTask.title}" marked done.`);
    }

    // 2. Dispatch to backend API
    try {
      await taskService.updateTaskStatus(id, nextStatus);
    } catch (error) {
      // Rollback on server error
      set({ tasks: currentTasks });
      if (get().selectedTask?._id === id) {
        set({ selectedTask: targetTask });
      }
      toast.error('Action failed', 'Could not sync status change with server.');
    }
  },

  // Add a subtask
  addSubtask: async (taskId, title) => {
    try {
      const res = await taskService.addSubtask(taskId, title);
      const updated = res.data;
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? updated : t)),
        selectedTask: state.selectedTask?._id === taskId ? updated : state.selectedTask,
      }));
      return { success: true };
    } catch (error) {
      toast.error('Failed to add subtask', error.message);
      return { success: false, error: error.message };
    }
  },

  // Toggle subtask completion
  toggleSubtask: async (taskId, subtaskId, completed) => {
    try {
      const res = await taskService.toggleSubtask(taskId, subtaskId, completed);
      const updated = res.data;
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? updated : t)),
        selectedTask: state.selectedTask?._id === taskId ? updated : state.selectedTask,
      }));
    } catch (error) {
      toast.error('Failed to update subtask', error.message);
    }
  },
}));
