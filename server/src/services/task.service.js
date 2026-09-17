const Task = require('../models/task.model');
const { isDBConnected } = require('../config/db');

// In-memory fallback store for offline development / testing before MongoDB Atlas is configured
let memoryTasks = [
  {
    _id: 'task-seed-1',
    user: 'demo-user-1',
    title: 'Prepare FYP proposal',
    description: 'Draft the architecture and component diagrams for the graduation submission',
    project: null,
    projectName: 'College / FYP',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: new Date(new Date().setHours(16, 0, 0, 0)),
    tags: ['college', 'fyp'],
    subtasks: [
      { _id: 's-1', title: 'Problem statement', completed: true, completedAt: new Date() },
      { _id: 's-2', title: 'Literature review', completed: true, completedAt: new Date() },
      { _id: 's-3', title: 'System architecture diagram', completed: false, completedAt: null },
      { _id: 's-4', title: 'Supervisor sign-off', completed: false, completedAt: null },
    ],
    isInbox: false,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(),
  },
  {
    _id: 'task-seed-2',
    user: 'demo-user-1',
    title: 'Finalize Versca queue UI',
    description: 'Implement responsive booking queues and checkout confirmation modal',
    project: null,
    projectName: 'Versca',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: new Date(new Date().setHours(18, 30, 0, 0)),
    tags: ['frontend', 'client'],
    subtasks: [],
    isInbox: false,
    createdAt: new Date(Date.now() - 43200000),
    updatedAt: new Date(),
  },
  {
    _id: 'task-seed-3',
    user: 'demo-user-1',
    title: 'Fix GoNepali authentication',
    description: 'Resolve OAuth token expiration race condition during callback',
    project: null,
    projectName: 'GoNepali',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: new Date(new Date().setHours(20, 0, 0, 0)),
    tags: ['auth', 'urgent-fix'],
    subtasks: [],
    isInbox: false,
    createdAt: new Date(Date.now() - 21600000),
    updatedAt: new Date(),
  },
  {
    _id: 'task-seed-4',
    user: 'demo-user-1',
    title: 'Review Gym Udaan mobile UI',
    description: 'Inspect workout tracker tap targets on 375px mobile breakpoint',
    project: null,
    projectName: 'Gym Udaan',
    status: 'TODO',
    priority: 'LOW',
    dueDate: new Date(Date.now() + 86400000),
    tags: ['mobile', 'qa'],
    subtasks: [],
    isInbox: false,
    createdAt: new Date(Date.now() - 10800000),
    updatedAt: new Date(),
  },
  {
    _id: 'task-seed-5',
    user: 'demo-user-1',
    title: 'Complete task tracker dashboard',
    description: 'Phase 1 and 2 foundation and design system integration',
    project: null,
    projectName: 'GoTaskManager',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    dueDate: new Date(),
    completedAt: new Date(),
    tags: ['core'],
    subtasks: [],
    isInbox: false,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(),
  },
];

class TaskService {
  // Create a new task scoped strictly to the authenticated user
  async createTask(userId, data) {
    if (isDBConnected()) {
      const task = new Task({
        ...data,
        user: userId,
      });
      return await task.save();
    }

    // In-memory fallback
    const newTask = {
      _id: 'task-' + Date.now(),
      user: userId.toString(),
      title: data.title.trim(),
      description: data.description || '',
      project: data.project || null,
      status: data.status || 'TODO',
      priority: data.priority || 'MEDIUM',
      startDate: data.startDate ? new Date(data.startDate) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      estimatedMinutes: data.estimatedMinutes || null,
      tags: data.tags || [],
      subtasks: (data.subtasks || []).map((s) => ({
        _id: 'sub-' + Math.random().toString(36).substr(2, 6),
        title: s.title,
        completed: !!s.completed,
        completedAt: s.completed ? new Date() : null,
      })),
      recurrence: data.recurrence || { frequency: 'NONE', interval: 1, daysOfWeek: [], endDate: null },
      isInbox: data.project ? false : data.isInbox !== undefined ? data.isInbox : true,
      notes: data.notes || '',
      completedAt: data.status === 'COMPLETED' ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryTasks.unshift(newTask);
    return newTask;
  }

  // Get tasks with filtering, search, pagination, and sorting
  async getTasks(userId, options = {}) {
    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(options.limit, 10) || 20));
    const skip = (page - 1) * limit;

    if (isDBConnected()) {
      const query = { user: userId };

      // Status filter
      if (options.status) {
        query.status = options.status;
      }

      // Priority filter
      if (options.priority) {
        query.priority = options.priority;
      }

      // Project filter
      if (options.project) {
        query.project = options.project;
      }

      // isInbox filter
      if (options.isInbox !== undefined) {
        query.isInbox = options.isInbox === 'true' || options.isInbox === true;
      }

      // Date range filter
      if (options.due) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        if (options.due === 'today') {
          query.dueDate = { $gte: startOfToday, $lte: endOfToday };
        } else if (options.due === 'upcoming') {
          query.dueDate = { $gt: endOfToday };
        } else if (options.due === 'overdue') {
          query.dueDate = { $lt: startOfToday };
          query.status = { $ne: 'COMPLETED' };
        }
      }

      // Global Search filter
      if (options.search && options.search.trim()) {
        const searchRegex = new RegExp(options.search.trim(), 'i');
        query.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
        ];
      }

      // Sorting
      let sort = { createdAt: -1 };
      if (options.sort === 'dueDate_asc') sort = { dueDate: 1 };
      else if (options.sort === 'dueDate_desc') sort = { dueDate: -1 };
      else if (options.sort === 'createdAt_asc') sort = { createdAt: 1 };

      const total = await Task.countDocuments(query);
      const data = await Task.find(query)
        .populate('project', 'name color icon')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      };
    }

    // In-memory fallback
    let filtered = memoryTasks.filter((t) => t.user === userId.toString());

    if (options.status) {
      filtered = filtered.filter((t) => t.status === options.status);
    }
    if (options.priority) {
      filtered = filtered.filter((t) => t.priority === options.priority);
    }
    if (options.project) {
      filtered = filtered.filter((t) => t.project === options.project);
    }
    if (options.isInbox !== undefined) {
      const isInboxVal = options.isInbox === 'true' || options.isInbox === true;
      filtered = filtered.filter((t) => t.isInbox === isInboxVal);
    }

    if (options.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  // Get a single task strictly checking user ownership
  async getTaskById(userId, taskId) {
    if (isDBConnected()) {
      return await Task.findOne({ _id: taskId, user: userId }).populate(
        'project',
        'name color icon'
      );
    }

    const task = memoryTasks.find(
      (t) => t._id === taskId && t.user === userId.toString()
    );
    return task || null;
  }

  // Update a task with ownership check
  async updateTask(userId, taskId, updates) {
    if (isDBConnected()) {
      const task = await Task.findOne({ _id: taskId, user: userId });
      if (!task) return null;

      Object.assign(task, updates);
      return await task.save();
    }

    const taskIndex = memoryTasks.findIndex(
      (t) => t._id === taskId && t.user === userId.toString()
    );
    if (taskIndex === -1) return null;

    const task = memoryTasks[taskIndex];
    const updated = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };

    if (updates.status === 'COMPLETED' && task.status !== 'COMPLETED') {
      updated.completedAt = new Date();
    } else if (updates.status && updates.status !== 'COMPLETED') {
      updated.completedAt = null;
    }

    memoryTasks[taskIndex] = updated;
    return updated;
  }

  // Delete a task with ownership check
  async deleteTask(userId, taskId) {
    if (isDBConnected()) {
      return await Task.findOneAndDelete({ _id: taskId, user: userId });
    }

    const taskIndex = memoryTasks.findIndex(
      (t) => t._id === taskId && t.user === userId.toString()
    );
    if (taskIndex === -1) return null;

    const [deleted] = memoryTasks.splice(taskIndex, 1);
    return deleted;
  }

  // Fast status update (e.g. checkbox click or Kanban column drop)
  async updateTaskStatus(userId, taskId, status) {
    const completedAt = status === 'COMPLETED' ? new Date() : null;
    return await this.updateTask(userId, taskId, { status, completedAt });
  }

  // Subtask management
  async addSubtask(userId, taskId, title) {
    if (isDBConnected()) {
      const task = await Task.findOne({ _id: taskId, user: userId });
      if (!task) return null;

      task.subtasks.push({ title: title.trim() });
      await task.save();
      return task;
    }

    const task = await this.getTaskById(userId, taskId);
    if (!task) return null;

    const newSubtask = {
      _id: 'sub-' + Math.random().toString(36).substr(2, 6),
      title: title.trim(),
      completed: false,
      completedAt: null,
    };
    task.subtasks.push(newSubtask);
    return task;
  }

  async toggleSubtask(userId, taskId, subtaskId, completed) {
    if (isDBConnected()) {
      const task = await Task.findOne({ _id: taskId, user: userId });
      if (!task) return null;

      const subtask = task.subtasks.id(subtaskId);
      if (!subtask) return null;

      subtask.completed = completed;
      subtask.completedAt = completed ? new Date() : null;
      await task.save();
      return task;
    }

    const task = await this.getTaskById(userId, taskId);
    if (!task) return null;

    const sub = task.subtasks.find((s) => s._id === subtaskId);
    if (!sub) return null;

    sub.completed = completed;
    sub.completedAt = completed ? new Date() : null;
    return task;
  }

  getMemoryTasks() {
    return memoryTasks;
  }
}

const taskServiceInstance = new TaskService();
taskServiceInstance.getMemoryTasks = () => memoryTasks;

module.exports = taskServiceInstance;
