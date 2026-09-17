const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');

const router = express.Router();

// All project endpoints require authentication
router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);

module.exports = router;
