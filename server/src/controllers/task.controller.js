const taskService = require('../services/task.service');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.userId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/tasks
// @desc    Get paginated, filtered, and sorted tasks for the authenticated user
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.userId, req.query);
    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/tasks/:id
// @desc    Get a single task by ID with strict ownership verification
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.userId, req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/tasks/:id
// @desc    Update task details with ownership check
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.userId, req.params.id, req.body);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/tasks/:id
// @desc    Delete task with ownership check
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await taskService.deleteTask(req.userId, req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/tasks/:id/status
// @desc    Quick status update (e.g. checkbox click or column drag)
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await taskService.updateTaskStatus(req.userId, req.params.id, status);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/tasks/:id/subtasks
// @desc    Add an embedded subtask
// @access  Private
const addSubtask = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Subtask title is required' });
    }

    const task = await taskService.addSubtask(req.userId, req.params.id, title);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(201).json({
      success: true,
      message: 'Subtask added successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
// @desc    Toggle subtask completion state
// @access  Private
const toggleSubtask = async (req, res, next) => {
  try {
    const { completed } = req.body;
    const task = await taskService.toggleSubtask(
      req.userId,
      req.params.id,
      req.params.subtaskId,
      !!completed
    );

    if (!task) {
      return res.status(404).json({ error: 'Task or subtask not found' });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addSubtask,
  toggleSubtask,
};
