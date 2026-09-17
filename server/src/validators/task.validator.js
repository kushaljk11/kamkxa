const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const VALID_PRIORITIES = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];

const validateCreateTask = (req, res, next) => {
  const { title, status, priority, dueDate, subtasks } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({ error: 'Task title cannot exceed 200 characters' });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
    });
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    return res.status(400).json({ error: 'Invalid due date format' });
  }

  if (subtasks && !Array.isArray(subtasks)) {
    return res.status(400).json({ error: 'Subtasks must be an array' });
  }

  next();
};

const validateUpdateTask = (req, res, next) => {
  const { title, status, priority, dueDate } = req.body;

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'Task title cannot be empty' });
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
    });
  }

  if (dueDate !== undefined && dueDate !== null && isNaN(Date.parse(dueDate))) {
    return res.status(400).json({ error: 'Invalid due date format' });
  }

  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Status is required and must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  next();
};

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateUpdateStatus,
};
