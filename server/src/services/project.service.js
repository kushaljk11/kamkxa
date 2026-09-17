const Project = require('../models/project.model');
const Task = require('../models/task.model');
const { isDBConnected } = require('../config/db');

// In-memory fallback store for offline development / testing before MongoDB Atlas is configured
let memoryProjects = [
  {
    _id: 'proj-seed-1',
    user: 'demo-user-1',
    name: 'College / FYP',
    description: 'Final Year Project architecture, research, and documentation',
    color: '#6366F1', // Indigo
    icon: 'GraduationCap',
    isArchived: false,
    createdAt: new Date(Date.now() - 30 * 86400000),
    updatedAt: new Date(),
  },
  {
    _id: 'proj-seed-2',
    user: 'demo-user-1',
    name: 'Versca',
    description: 'Client design system and booking queue web application',
    color: '#0EA5E9', // Sky blue
    icon: 'Briefcase',
    isArchived: false,
    createdAt: new Date(Date.now() - 20 * 86400000),
    updatedAt: new Date(),
  },
  {
    _id: 'proj-seed-3',
    user: 'demo-user-1',
    name: 'GoNepali',
    description: 'Local services discovery platform and payment integration',
    color: '#10B981', // Emerald
    icon: 'Compass',
    isArchived: false,
    createdAt: new Date(Date.now() - 15 * 86400000),
    updatedAt: new Date(),
  },
  {
    _id: 'proj-seed-4',
    user: 'demo-user-1',
    name: 'Gym Udaan',
    description: 'Fitness mobile application and workout tracking QA',
    color: '#F59E0B', // Amber
    icon: 'Dumbbell',
    isArchived: false,
    createdAt: new Date(Date.now() - 10 * 86400000),
    updatedAt: new Date(),
  },
  {
    _id: 'proj-seed-5',
    user: 'demo-user-1',
    name: 'GoTaskManager',
    description: 'Core product development, PWA features, and offline sync',
    color: '#8B5CF6', // Purple
    icon: 'CheckSquare',
    isArchived: false,
    createdAt: new Date(Date.now() - 5 * 86400000),
    updatedAt: new Date(),
  },
];

class ProjectService {
  /**
   * Helper to compute task stats for a project
   */
  async _attachStats(userId, project) {
    const mongoose = require('mongoose');
    const projId = project._id.toString();
    const isRealMongo = isDBConnected() && mongoose.Types.ObjectId.isValid(userId);

    if (isRealMongo && mongoose.Types.ObjectId.isValid(project._id)) {
      const [totalTasks, completedTasks] = await Promise.all([
        Task.countDocuments({ user: userId, project: project._id }),
        Task.countDocuments({ user: userId, project: project._id, status: 'COMPLETED' }),
      ]);
      const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      return {
        ...project.toObject ? project.toObject() : project,
        totalTasks,
        completedTasks,
        completionPercentage: percent,
      };
    }

    // In-memory fallback
    // Matches either project ID or matching seed name
    const { getMemoryTasks } = require('./task.service');
    const tasks = getMemoryTasks ? getMemoryTasks() : [];
    const projTasks = tasks.filter(
      (t) =>
        t.user.toString() === userId.toString() &&
        (t.project?.toString() === projId || t.projectName === project.name)
    );
    const totalTasks = projTasks.length;
    const completedTasks = projTasks.filter((t) => t.status === 'COMPLETED').length;
    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      ...project,
      totalTasks,
      completedTasks,
      completionPercentage: percent,
    };
  }

  /**
   * Create a new project
   */
  async createProject(userId, data) {
    const mongoose = require('mongoose');
    const isRealMongo = isDBConnected() && mongoose.Types.ObjectId.isValid(userId);

    if (isRealMongo) {
      const project = await Project.create({
        user: userId,
        name: data.name,
        description: data.description || '',
        color: data.color || '#6366F1',
        icon: data.icon || 'FolderKanban',
        isArchived: false,
      });
      return this._attachStats(userId, project);
    }

    const newProj = {
      _id: `proj-${Date.now()}`,
      user: userId,
      name: data.name,
      description: data.description || '',
      color: data.color || '#6366F1',
      icon: data.icon || 'FolderKanban',
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryProjects.unshift(newProj);
    return this._attachStats(userId, newProj);
  }

  /**
   * Get all projects for a user with aggregated statistics
   */
  async getProjects(userId, query = {}) {
    const mongoose = require('mongoose');
    const isRealMongo = isDBConnected() && mongoose.Types.ObjectId.isValid(userId);
    const isArchived = query.archived === 'true';

    if (isRealMongo) {
      const projects = await Project.find({
        user: userId,
        isArchived,
      }).sort({ createdAt: -1 });

      return Promise.all(projects.map((p) => this._attachStats(userId, p)));
    }

    const filtered = memoryProjects.filter((p) => {
      const matchesUser = p.user.toString() === userId.toString() || p.user === 'demo-user-1';
      const matchesArchived = Boolean(p.isArchived) === isArchived;
      return matchesUser && matchesArchived;
    });

    return Promise.all(filtered.map((p) => this._attachStats(userId, p)));
  }

  /**
   * Get single project by ID
   */
  async getProjectById(userId, projectId) {
    const mongoose = require('mongoose');
    const isRealMongo = isDBConnected() && mongoose.Types.ObjectId.isValid(userId);

    if (isRealMongo && mongoose.Types.ObjectId.isValid(projectId)) {
      const project = await Project.findOne({ _id: projectId, user: userId });
      if (!project) return null;
      return this._attachStats(userId, project);
    }

    const project = memoryProjects.find(
      (p) =>
        p._id.toString() === projectId.toString() &&
        (p.user.toString() === userId.toString() || p.user === 'demo-user-1')
    );
    if (!project) return null;
    return this._attachStats(userId, project);
  }

  /**
   * Update project
   */
  async updateProject(userId, projectId, data) {
    const mongoose = require('mongoose');
    const isRealMongo = isDBConnected() && mongoose.Types.ObjectId.isValid(userId);

    if (isRealMongo && mongoose.Types.ObjectId.isValid(projectId)) {
      const project = await Project.findOneAndUpdate(
        { _id: projectId, user: userId },
        { $set: data },
        { new: true, runValidators: true }
      );
      if (!project) return null;
      return this._attachStats(userId, project);
    }

    const idx = memoryProjects.findIndex(
      (p) =>
        p._id.toString() === projectId.toString() &&
        (p.user.toString() === userId.toString() || p.user === 'demo-user-1')
    );
    if (idx === -1) return null;

    memoryProjects[idx] = {
      ...memoryProjects[idx],
      ...data,
      updatedAt: new Date(),
    };
    return this._attachStats(userId, memoryProjects[idx]);
  }

  /**
   * Delete project
   */
  async deleteProject(userId, projectId) {
    const mongoose = require('mongoose');
    const isRealMongo = isDBConnected() && mongoose.Types.ObjectId.isValid(userId);

    if (isRealMongo && mongoose.Types.ObjectId.isValid(projectId)) {
      const result = await Project.findOneAndDelete({ _id: projectId, user: userId });
      if (result) {
        // Unlink project from tasks
        await Task.updateMany(
          { user: userId, project: projectId },
          { $set: { project: null, isInbox: true } }
        );
      }
      return result;
    }

    const idx = memoryProjects.findIndex(
      (p) =>
        p._id.toString() === projectId.toString() &&
        (p.user.toString() === userId.toString() || p.user === 'demo-user-1')
    );
    if (idx === -1) return null;

    const deleted = memoryProjects.splice(idx, 1)[0];
    return deleted;
  }
}

module.exports = new ProjectService();
