import api from '@/services/api';

export const taskService = {
  // Get tasks with query params (page, limit, status, priority, project, search, due, sort)
  async getTasks(params = {}) {
    const res = await api.get('/tasks', { params });
    return res.data;
  },

  // Get a single task by ID
  async getTaskById(id) {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  // Create a new task
  async createTask(data) {
    const res = await api.post('/tasks', data);
    return res.data;
  },

  // Update task details
  async updateTask(id, data) {
    const res = await api.patch(`/tasks/${id}`, data);
    return res.data;
  },

  // Delete a task
  async deleteTask(id) {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

  // Fast status toggle
  async updateTaskStatus(id, status) {
    const res = await api.patch(`/tasks/${id}/status`, { status });
    return res.data;
  },

  // Add an embedded subtask
  async addSubtask(taskId, title) {
    const res = await api.post(`/tasks/${taskId}/subtasks`, { title });
    return res.data;
  },

  // Toggle subtask completion
  async toggleSubtask(taskId, subtaskId, completed) {
    const res = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, { completed });
    return res.data;
  },
};

export default taskService;
