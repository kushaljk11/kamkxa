const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addSubtask,
  toggleSubtask,
} = require('../controllers/task.controller');
const {
  validateCreateTask,
  validateUpdateTask,
  validateUpdateStatus,
} = require('../validators/task.validator');
const { protect } = require('../middleware/auth.middleware');

// All task routes require authentication
router.use(protect);

router.route('/')
  .post(validateCreateTask, createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTaskById)
  .patch(validateUpdateTask, updateTask)
  .delete(deleteTask);

router.patch('/:id/status', validateUpdateStatus, updateTaskStatus);

router.post('/:id/subtasks', addSubtask);
router.patch('/:id/subtasks/:subtaskId', toggleSubtask);

module.exports = router;
