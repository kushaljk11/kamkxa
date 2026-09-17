import api from './api';

export const projectService = {
  /**
   * Fetch all projects
   */
  async getProjects(params = {}) {
    const res = await api.get('/projects', { params });
    return res.data.data;
  },

  /**
   * Fetch single project by ID
   */
  async getProjectById(id) {
    const res = await api.get(`/projects/${id}`);
    return res.data.data;
  },

  /**
   * Create new project
   */
  async createProject(data) {
    const res = await api.post('/projects', data);
    return res.data.data;
  },

  /**
   * Update project
   */
  async updateProject(id, data) {
    const res = await api.patch(`/projects/${id}`, data);
    return res.data.data;
  },

  /**
   * Delete project
   */
  async deleteProject(id) {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },
};
